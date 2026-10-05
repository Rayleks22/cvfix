import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSession, readSession } from '../server/sessions.ts';
import { onRequest as analyze } from '../functions/api/analyze-cv.ts';
import { onRequest as initialize } from '../functions/api/payments/initialize.ts';
import { onRequest as verify } from '../functions/api/payments/verify.ts';
import { onRequestGet as getConfig } from '../functions/api/config.ts';
import { SAMPLE_CV, SAMPLE_ROLE, SAMPLE_JOB_DESCRIPTION } from '../src/data/sampleCV.ts';
import { PRICE_KOBO, SESSION_TTL_MS, MAX_API_BYTES } from '../src/lib/constants.ts';
import { reviewCV } from '../src/lib/review.ts';
import type { Env } from '../server/types.ts';

// Explicit fake test configuration. No calls to Paystack or any live credentials are used.
const env: Env = {
  SESSION_SECRET: 'only-a-test-secret-with-more-than-32-characters',
  PAYSTACK_SECRET_KEY: `sk_test_${'x'.repeat(40)}`,
  APP_URL: 'https://cvfix.com.ng',
  SUPPORT_EMAIL: 'test-support@example.com',
};
const input = { cvText: SAMPLE_CV, targetRole: SAMPLE_ROLE, jobDescription: '' };
const request = (path: string, data: unknown, origin = 'https://cvfix.com.ng') =>
  new Request(`https://cvfix.com.ng/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify(data),
  });
const reference = `CVFIX_${'a'.repeat(32)}`;
afterEach(() => vi.unstubAllGlobals());

describe('encrypted review sessions', () => {
  it('supports large Unicode CV and description tokens within the advertised limits', async () => {
    const source = {
      cvText: 'FICTIONAL CANDIDATE\nWORK EXPERIENCE\n' + 'ọ'.repeat(29_000),
      targetRole: 'Example role',
      jobDescription: 'ẹ'.repeat(11_000),
    };
    const value = await createSession(source, env.SESSION_SECRET!);
    expect(value.token.length).toBeGreaterThan(120_000);
    expect((await readSession(value.token, env.SESSION_SECRET!)).cvText).toBe(source.cvText);
  });
  it('round trips without putting plain CV text in the token', async () => {
    const value = await createSession(input, env.SESSION_SECRET!);
    expect(value.token).not.toContain('AMARA');
    expect(value.token).not.toContain('example.com');
    expect((await readSession(value.token, env.SESSION_SECRET!)).cvText).toBe(SAMPLE_CV);
  });
  it('binds a 24-hour expiry and a unique ID', async () => {
    const first = await createSession(input, env.SESSION_SECRET!, 1000);
    const second = await createSession(input, env.SESSION_SECRET!, 1000);
    expect(first.session.expiresAt).toBe(1000 + SESSION_TTL_MS);
    expect(first.session.id).not.toBe(second.session.id);
  });
  it('rejects tampering and wrong keys', async () => {
    const { token } = await createSession(input, env.SESSION_SECRET!);
    const altered = (token[0] === 'A' ? 'B' : 'A') + token.slice(1);
    await expect(readSession(altered, env.SESSION_SECRET!)).rejects.toMatchObject({ status: 400 });
    await expect(readSession(token, `${env.SESSION_SECRET}different`)).rejects.toMatchObject({
      status: 400,
    });
  });
  it('rejects expired tokens', async () => {
    const { token, session } = await createSession(input, env.SESSION_SECRET!, 1000);
    await expect(readSession(token, env.SESSION_SECRET!, session.expiresAt)).rejects.toMatchObject({
      status: 410,
    });
  });
  it('fails closed without a strong secret', async () => {
    await expect(createSession(input, 'short')).rejects.toMatchObject({ status: 503 });
  });
});

describe('checkout preparation and configuration', () => {
  it('does not leak secrets in public configuration', async () => {
    const value = await getConfig({
      env,
      request: new Request('https://cvfix.com.ng/api/config'),
    }).json();
    expect(value.paymentsEnabled).toBe(true);
    expect(value.paymentMode).toBe('test');
    expect(JSON.stringify(value)).not.toContain(env.PAYSTACK_SECRET_KEY);
    expect(JSON.stringify(value)).not.toContain(env.SESSION_SECRET);
  });
  it('disables payments when credentials or support are missing', async () => {
    const value = await getConfig({
      env: {},
      request: new Request('https://cvfix.com.ng/api/config'),
    }).json();
    expect(value.paymentsEnabled).toBe(false);
    const missingSupport = await getConfig({
      env: { ...env, SUPPORT_EMAIL: '' },
      request: new Request('https://cvfix.com.ng/api/config'),
    }).json();
    expect(missingSupport.paymentsEnabled).toBe(false);
  });
  it('requires explicit consent before transmitting and sealing a CV', async () => {
    expect((await analyze({ env, request: request('analyze-cv', input) })).status).toBe(400);
  });
  it('returns a sealed session but no paid document on preparation', async () => {
    const response = await analyze({
      env,
      request: request('analyze-cv', { ...input, consent: true }),
    });
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value.reviewToken).toBeTruthy();
    expect(value.package).toBeUndefined();
    expect(value.result.premiumFullRewrite).toBeUndefined();
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
  it('rejects empty CVs on the server too', async () => {
    expect(
      (
        await analyze({
          env,
          request: request('analyze-cv', { ...input, cvText: '', consent: true }),
        })
      ).status,
    ).toBe(400);
  });
  it('rejects cross-origin requests', async () => {
    expect(
      (
        await analyze({
          env,
          request: request('analyze-cv', { ...input, consent: true }, 'https://evil.example'),
        })
      ).status,
    ).toBe(403);
  });
  it('enforces a request-body limit', async () => {
    expect(
      (
        await analyze({
          env,
          request: request('analyze-cv', {
            ...input,
            cvText: 'x'.repeat(MAX_API_BYTES + 1),
            consent: true,
          }),
        })
      ).status,
    ).toBe(413);
  });
  it('returns 503 instead of simulating checkout success', async () => {
    expect(
      (
        await initialize({
          env: {},
          request: request('payments/initialize', { email: 'test@example.com' }),
        })
      ).status,
    ).toBe(503);
  });
  it('initializes exactly the server price and sends no CV to Paystack', async () => {
    const { token, session } = await createSession(input, env.SESSION_SECRET!);
    const mock = vi.fn(async (_url: string, init: RequestInit) => {
      const body = JSON.parse(init.body as string);
      expect(body.amount).toBe(PRICE_KOBO);
      expect(body.currency).toBe('NGN');
      expect(body.metadata.reviewId).toBe(session.id);
      expect(JSON.stringify(body)).not.toContain('AMARA');
      return new Response(
        JSON.stringify({
          status: true,
          data: {
            authorization_url: 'https://checkout.paystack.com/test-checkout',
            reference: body.reference,
          },
        }),
        { status: 200 },
      );
    });
    vi.stubGlobal('fetch', mock);
    const response = await initialize({
      env,
      request: request('payments/initialize', {
        reviewToken: token,
        email: 'candidate@example.com',
        amount: 1,
      }),
    });
    expect(response.status).toBe(200);
    expect(mock).toHaveBeenCalledOnce();
  });
  it('rejects an invalid receipt email without calling the provider', async () => {
    const { token } = await createSession(input, env.SESSION_SECRET!);
    const mock = vi.fn();
    vi.stubGlobal('fetch', mock);
    expect(
      (
        await initialize({
          env,
          request: request('payments/initialize', { reviewToken: token, email: 'not-an-email' }),
        })
      ).status,
    ).toBe(400);
    expect(mock).not.toHaveBeenCalled();
  });
});

describe('payment verification is the only live unlock authority', () => {
  async function run(transaction: Record<string, unknown>, source = input) {
    const { token, session } = await createSession(source, env.SESSION_SECRET!);
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              status: true,
              data: {
                status: 'success',
                amount: PRICE_KOBO,
                currency: 'NGN',
                domain: 'test',
                reference,
                metadata: { reviewId: session.id, product: 'cvfix_full_cv_v2' },
                ...transaction,
              },
            }),
            { status: 200 },
          ),
      ),
    );
    return verify({ env, request: request('payments/verify', { reviewToken: token, reference }) });
  }
  it('returns the complete package only for a correct confirmed transaction', async () => {
    const response = await run({});
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value.verified).toBe(true);
    expect(value.package.cvText).toContain('Higher National Diploma');
    expect(value.package.cvText).toContain('2019 – 2021');
  });
  it('restores the original source and job-specific review, not a rescore of the cleaned draft', async () => {
    const source = { ...input, jobDescription: SAMPLE_JOB_DESCRIPTION };
    const response = await run({}, source);
    const value = await response.json();
    expect(response.status).toBe(200);
    expect(value.source).toEqual(source);
    expect(value.review).toEqual(reviewCV(source));
    expect(value.review.keywordSource).toBe('job-description');
    expect(value.package.cvText).not.toBe(source.cvText);
    expect(value.review).not.toEqual(reviewCV({ ...input, cvText: value.package.cvText }));
  });
  it.each([
    ['wrong amount', { amount: 100 }, 403],
    ['wrong currency', { currency: 'USD' }, 403],
    ['wrong reference', { reference: 'different' }, 403],
    ['wrong payment mode', { domain: 'live' }, 403],
    ['wrong review', { metadata: { reviewId: 'different', product: 'cvfix_full_cv_v2' } }, 403],
    ['missing metadata', { metadata: null }, 403],
    ['unpaid', { status: 'pending' }, 402],
    ['failed', { status: 'failed' }, 402],
  ])('does not unlock for %s', async (_label, transaction, status) => {
    const response = await run(transaction);
    const value = await response.json();
    expect(response.status).toBe(status);
    expect(value.package).toBeUndefined();
  });
  it('rejects a browser-only success flag', async () => {
    const response = await verify({
      env,
      request: request('payments/verify', { verified: true, reference }),
    });
    expect(response.status).toBe(400);
    expect((await response.json()).package).toBeUndefined();
  });
  it('does not unlock on a provider error', async () => {
    const { token } = await createSession(input, env.SESSION_SECRET!);
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network');
      }),
    );
    const response = await verify({
      env,
      request: request('payments/verify', { reviewToken: token, reference }),
    });
    expect(response.status).toBe(502);
    expect((await response.json()).package).toBeUndefined();
  });
});
