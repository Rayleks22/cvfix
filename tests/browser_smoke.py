"""End-to-end checks with fictional fixtures only. Does not connect to Paystack or upload to production.
Run: python tests/browser_smoke.py --base-url http://127.0.0.1:3000
Requires a running dev server, `npm ci`, Python dependencies below, and Playwright Chromium.
"""
import argparse
import asyncio
import json
import pathlib
import re
import subprocess
import zipfile
from docx import Document
from pypdf import PdfReader, PdfWriter
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'test-results' / 'browser-smoke'
OUT.mkdir(parents=True, exist_ok=True)
SAMPLE = re.search(r'export const SAMPLE_CV = `([\s\S]*?)`;', (ROOT / 'src/data/sampleCV.ts').read_text()).group(1)
AXE = ROOT / 'node_modules/axe-core/axe.min.js'


def fixtures():
    doc = Document()
    for line in SAMPLE.splitlines():
        doc.add_paragraph(line)
    doc.save(OUT / 'fictional-cv.docx')
    (OUT / 'fictional-cv.txt').write_text(SAMPLE)
    (OUT / 'old-cv.doc').write_text('A legacy Word file must be saved as DOCX first.')
    (OUT / 'oversized.pdf').write_bytes(b' ' * (5 * 1024 * 1024 + 1))
    writer = PdfWriter()
    writer.add_blank_page(width=595, height=842)
    with (OUT / 'no-selectable-text.pdf').open('wb') as f:
        writer.write(f)
    # Build a fictional trusted-server response from the real, shared review rules.
    # Vite is used as a TS module loader only; this does not start an HTTP server.
    generated = subprocess.run(['node', '--input-type=module', '-e', """
      import { createServer } from 'vite';
      const server = await createServer({ configFile: false, logLevel: 'error', server: { middlewareMode: true, hmr: false } });
      try {
        const { reviewCV } = await server.ssrLoadModule('/src/lib/review.ts');
        const { SAMPLE_CV, SAMPLE_ROLE, SAMPLE_JOB_DESCRIPTION } = await server.ssrLoadModule('/src/data/sampleCV.ts');
        const { SAMPLE_PACKAGE } = await server.ssrLoadModule('/src/data/samplePackage.ts');
        const source = { cvText: SAMPLE_CV, targetRole: SAMPLE_ROLE, jobDescription: SAMPLE_JOB_DESCRIPTION };
        console.log(JSON.stringify({ verified: true, reference: 'CVFIX_' + 'a'.repeat(32), package: SAMPLE_PACKAGE, review: reviewCV(source), source }));
      } finally { await server.close(); }
    """], cwd=ROOT, check=True, capture_output=True, text=True)
    return json.loads(generated.stdout)



async def audit(page, name, results):
    await page.evaluate(AXE.read_text())
    violations = await page.evaluate("""async () => (await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa']}})).violations.map(v => ({id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({target: n.target, summary: n.failureSummary}))}))""")
    results[name] = violations
    assert not violations, f'{name}: accessibility violations: {violations}'


async def main(base, production_headers=False):
    verified_fixture = fixtures()
    findings = {'checks': [], 'accessibility': {}, 'production_headers_replayed': production_headers}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000})
        errors, posts, external, csp_errors = [], [], [], []
        if production_headers:
            headers = {}
            scope = None
            for line in (ROOT / 'public/_headers').read_text().splitlines():
                if line and not line.startswith(' '):
                    scope = line
                elif scope == '/*' and ': ' in line:
                    name, value = line.strip().split(': ', 1)
                    headers[name.lower()] = value
            async def replay_headers(route):
                if route.request.url.startswith(base):
                    response = await route.fetch()
                    await route.fulfill(response=response, headers={**response.headers, **headers})
                else:
                    await route.continue_()
            await page.route('**/*', replay_headers)
            page.on('console', lambda message: csp_errors.append(message.text) if message.type == 'error' and 'security policy' in message.text.lower() else None)
        page.on('pageerror', lambda error: errors.append(str(error)))
        def observe(request):
            if request.method == 'POST':
                posts.append(request.url)
            if request.url.startswith('http') and not request.url.startswith(base):
                external.append(request.url)
        page.on('request', observe)
        await page.goto(base, wait_until='networkidle')
        await audit(page, 'home-desktop', findings['accessibility'])
        await page.screenshot(path=str(OUT / 'home-desktop.png'), full_page=True)
        await page.get_by_role('button', name='Check my CV free', exact=True).first.click()
        assert 'Please add your CV first' in await page.get_by_role('alert').inner_text()
        assert not posts, 'Empty submission must not send a sample or upload a CV.'
        findings['checks'].append('Empty CV blocked; no POST or automatic sample')
        for width in [320, 360, 390, 768]:
            await page.set_viewport_size({'width': width, 'height': 844})
            dimensions = await page.evaluate('({viewport: innerWidth, content: document.documentElement.scrollWidth})')
            assert dimensions['content'] <= dimensions['viewport'], f'Horizontal overflow at {width}px'
        await page.set_viewport_size({'width': 390, 'height': 844})
        await page.reload(wait_until='networkidle')
        await audit(page, 'home-mobile', findings['accessibility'])
        await page.get_by_role('button', name='Open navigation').click()
        await page.locator('.mobile-nav').get_by_role('link', name='Pricing', exact=True).click()
        assert '/pricing' in page.url
        await page.go_back(wait_until='networkidle')
        assert await page.get_by_role('heading', name='Good experience. A better CV.').count() == 1
        findings['checks'].append('320/360/390/768px layouts and mobile menu/back navigation')
        await page.set_viewport_size({'width': 1440, 'height': 1000})
        for filename, expected in [('old-cv.doc', 'Older .doc'), ('oversized.pdf', 'over 5 MB'), ('no-selectable-text.pdf', 'little or no selectable text')]:
            await page.locator('input[type=file]').set_input_files(str(OUT / filename))
            await page.get_by_role('alert').wait_for()
            await page.wait_for_function("(expected) => document.querySelector('[role=alert]')?.innerText.includes(expected)", arg=expected)
            assert await page.locator('#cv-text').count() == 0
        findings['checks'].append('Legacy DOC, oversized and image/blank PDF errors are actionable')
        await page.locator('input[type=file]').set_input_files(str(OUT / 'fictional-cv.docx'))
        await page.locator('#cv-text').wait_for()
        await page.wait_for_function("document.querySelector('#cv-text').value.includes('AMARA OKAFOR')")
        source = await page.locator('#cv-text').input_value()
        assert 'Higher National Diploma' in source and 'Example Retail Store' in source
        assert not source.startswith('PK')
        assert not posts
        await page.locator('#cv-text').fill(source.replace('AMARA OKAFOR', 'FICTIONAL TEST CANDIDATE'))
        await page.locator('.source-confirmation input').check()
        await page.get_by_role('button', name='Check my CV free', exact=True).first.click()
        await page.locator('.score-ring').wait_for()
        assert not posts and not external, 'Free review must not transmit the CV or fetch external assets.'
        await audit(page, 'custom-review', findings['accessibility'])
        await page.get_by_role('button', name='Get my CV package').click()
        await page.get_by_role('dialog').wait_for()
        assert 'Paid downloads are not connected yet' in await page.get_by_role('dialog').inner_text(), 'Run this smoke test without payment credentials.'
        await audit(page, 'unconfigured-checkout', findings['accessibility'])
        await page.get_by_role('button', name='Back to my free review').click()
        findings['checks'].append('DOCX extraction works, requires confirmation, local-only review, checkout fails closed')
        await page.goto(base, wait_until='networkidle')
        await page.locator('input[type=file]').set_input_files(str(OUT / 'fictional-cv.txt'))
        await page.locator('#cv-text').wait_for()
        assert 'AMARA OKAFOR' in await page.locator('#cv-text').input_value()
        findings['checks'].append('TXT extraction works')
        await page.goto(base, wait_until='networkidle')
        await page.get_by_role('button', name='See a sample review', exact=True).click()
        await page.locator('.score-ring').wait_for()
        await audit(page, 'sample-review', findings['accessibility'])
        await page.get_by_role('button', name='Explore sample editor').click()
        await page.locator('#document-editor').wait_for()
        await audit(page, 'sample-editor', findings['accessibility'])
        assert await page.get_by_role('button', name='Download PDF').is_disabled()
        edited = (await page.locator('#document-editor').input_value()).replace('AMARA OKAFOR', 'ỌLÁ ADÉ — FICTIONAL EXAMPLE')
        edited += '\n\nADDITIONAL PROJECT NOTES\n- Reconciled ₦65,000 using POS terminals.\n'
        edited += '\n'.join(f'- Recorded project note {i} using the supplied records and kept the source information for review.' for i in range(1, 85))
        await page.locator('#document-editor').fill(edited)
        await page.locator('.export-confirmation input').check()
        async with page.expect_download() as capture:
            await page.get_by_role('button', name='Download Word').click()
        download = await capture.value
        await download.save_as(str(OUT / 'exported-cv.docx'))
        async with page.expect_download() as capture:
            await page.get_by_role('button', name='Download PDF').click()
        download = await capture.value
        await download.save_as(str(OUT / 'exported-cv.pdf'))
        text = '\n'.join(page.extract_text() or '' for page in PdfReader(OUT / 'exported-cv.pdf').pages)
        assert len(PdfReader(OUT / 'exported-cv.pdf').pages) > 1
        for fact in ['ỌLÁ ADÉ', '₦65,000', 'Higher National Diploma', 'Example Retail Store', 'project note 84']:
            assert fact in text, f'PDF lost {fact}'
        with zipfile.ZipFile(OUT / 'exported-cv.docx') as z:
            xml = z.read('word/document.xml').decode()
            for fact in ['ỌLÁ ADÉ', '₦65,000', 'Higher National Diploma', 'Example Retail Store', 'project note 84']:
                assert fact in xml, f'Word lost {fact}'
        findings['checks'].append('Confirmed-only PDF/DOCX exports, multiple pages, Yoruba characters, naira, all history/education and final line retained')
        await page.get_by_role('tab', name='Cover-letter draft', exact=True).click()
        assert await page.get_by_role('button', name='Download PDF').is_disabled()
        await page.locator('.export-confirmation input').check()
        async with page.expect_download() as capture:
            await page.get_by_role('button', name='Download Word').click()
        await (await capture.value).save_as(str(OUT / 'cover-letter.docx'))
        findings['checks'].append('Cover-letter draft has separate confirmation and Word export')
        await page.goto(base, wait_until='networkidle')
        await page.locator('input[type=file]').set_input_files(str(OUT / 'exported-cv.pdf'))
        await page.locator('#cv-text').wait_for()
        extracted = await page.locator('#cv-text').input_value()
        assert 'Higher National Diploma' in extracted and 'project note 84' in extracted
        findings['checks'].append('Generated multi-page PDF can be extracted again')
        await page.evaluate("sessionStorage.setItem('cvfix.checkout.v2', JSON.stringify({ reviewToken: 'test-only-ciphertext', reference: 'CVFIX_' + 'a'.repeat(32), expiresAt: Date.now() + 86400000 }))")
        async def accept_clear(dialog):
            await dialog.accept()
        page.once('dialog', accept_clear)
        await page.get_by_role('button', name='Clear this tab’s CV', exact=True).click()
        await page.locator('.dropzone').wait_for()
        assert await page.locator('#cv-text').count() == 0
        assert await page.locator('.file-chip').count() == 0
        assert await page.evaluate("sessionStorage.getItem('cvfix.checkout.v2')") is None
        findings['checks'].append('Clear-session action resets the CV, filename, confirmation and checkout state')
        for route in ['pricing', 'jobs', 'privacy', 'terms', 'refunds', 'methodology', 'contact']:
            await page.goto(f'{base}/{route}', wait_until='networkidle')
            await audit(page, route, findings['accessibility'])
            await page.set_viewport_size({'width': 390, 'height': 844})
            assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            await page.set_viewport_size({'width': 1440, 'height': 1000})
        await page.goto(f'{base}/jobs', wait_until='networkidle')
        if await page.locator('.job-card').count():
            title = await page.locator('.job-card').first.locator('h2').inner_text()
            await page.locator('.job-card').first.get_by_role('button', name='Review my CV for this role').click()
            assert await page.locator('#target-role').input_value() == title
        findings['checks'].append('Direct page navigation, mobile layout, genuine job links and role-to-review prefill')
        await page.goto(base + '/?payment=return&reference=CVFIX_' + 'a' * 32, wait_until='networkidle')
        await page.get_by_role('alert').wait_for()
        assert 'session is missing' in await page.get_by_role('alert').inner_text()
        assert await page.locator('#document-editor').count() == 0
        findings['checks'].append('Payment redirect without a valid encrypted session does not unlock')
        async def verified_response(route):
            await route.fulfill(status=200, content_type='application/json', body=json.dumps(verified_fixture))
        await page.route('**/api/payments/verify', verified_response)
        seed = "sessionStorage.setItem('cvfix.checkout.v2', JSON.stringify({ reviewToken: 'test-only-ciphertext', reference: 'CVFIX_' + 'a'.repeat(32), expiresAt: Date.now() + 86400000 }))"
        await page.evaluate(seed)
        await page.reload(wait_until='networkidle')
        await page.locator('#document-editor').wait_for()
        assert await page.locator('#document-editor').input_value() == verified_fixture['package']['cvText']
        await page.get_by_role('button', name='Back to your review', exact=True).click()
        assert await page.locator('.score-ring strong').inner_text() == str(verified_fixture['review']['score'])
        assert await page.get_by_role('heading', name='A check against your job description.', exact=True).count() == 1
        await page.get_by_role('button', name='Edit CV details', exact=True).click()
        assert await page.locator('#cv-text').input_value() == SAMPLE
        assert await page.locator('#job-description').input_value() == verified_fixture['source']['jobDescription']
        findings['checks'].append('Mocked verified return restores the original source, score and job-description comparison')
        # A late verification response must never undo the user's clear-session action.
        release_response = asyncio.Event()
        async def delayed_response(route):
            await release_response.wait()
            await verified_response(route)
        await page.route('**/api/payments/verify', delayed_response)
        await page.evaluate(seed)
        await page.reload(wait_until='domcontentloaded')
        await page.get_by_role('heading', name='Checking your payment.', exact=True).wait_for()
        page.once('dialog', accept_clear)
        await page.get_by_role('button', name='Clear this tab’s CV', exact=True).click()
        await page.locator('.dropzone').wait_for()
        release_response.set()
        await page.wait_for_load_state('networkidle')
        assert await page.locator('#document-editor').count() == 0
        assert await page.locator('#cv-text').count() == 0
        assert await page.evaluate("sessionStorage.getItem('cvfix.checkout.v2')") is None
        findings['checks'].append('Clearing during verification prevents a late response from restoring the CV')

        findings['page_errors'] = errors
        findings['csp_errors'] = csp_errors
        assert not csp_errors, f'Production CSP errors: {csp_errors}'
        assert not errors, f'Browser errors: {errors}'
        (OUT / 'results.json').write_text(json.dumps(findings, indent=2))
        print(json.dumps(findings, indent=2))
        await browser.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base-url', default='http://127.0.0.1:3000')
    parser.add_argument('--production-headers', action='store_true', help='Replay the production static security headers; use with built static assets, not Vite development.')
    args = parser.parse_args()
    # Prevent accidental checks against the real public website or live checkout.
    assert args.base_url.startswith(('http://127.0.0.1:', 'http://localhost:')), 'Use a local test server without live payment settings.'
    asyncio.run(main(args.base_url.rstrip('/'), args.production_headers))
