import fs from 'node:fs';
import { PRICE_KOBO, PRICE_LABEL } from '../src/lib/constants.ts';
import { describe, expect, it } from 'vitest';
import { buildPageHTML, PAGE_METADATA } from '../scripts/build-pages.js';

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
describe('metadata and source assets', () => {
  it('generates route-specific metadata even when HTML attributes span multiple lines', () => {
    for (const [slug, [title, description]] of Object.entries(PAGE_METADATA)) {
      const output = buildPageHTML(index, slug);
      expect(output).toContain(title.replace(/&/g, '&amp;'));
      expect(output.match(/<meta\s+name="description"\s+content="([^"]*)"/)[1]).toBe(
        description.replace(/&/g, '&amp;'),
      );
      expect(output).toContain(`href="https://cvfix.com.ng/${slug}"`);
      expect(output.match(/<meta\s+property="og:url"\s+content="([^"]*)"/)[1]).toBe(
        `https://cvfix.com.ng/${slug}`,
      );
    }
  });
  it('rejects unknown static entry routes', () => {
    expect(() => buildPageHTML(index, 'unknown')).toThrow(/Unknown/);
  });
  it('publishes matching free and one-time offer prices', () => {
    expect(Number(PRICE_LABEL.replace(/[^0-9]/g, ''))).toBe(PRICE_KOBO / 100);
    const schema = JSON.parse(
      index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
    );
    expect(schema.offers.map((offer) => [offer.price, offer.priceCurrency])).toEqual([
      ['0', 'NGN'],
      [String(PRICE_KOBO / 100), 'NGN'],
    ]);
  });
  it('ships an actual 1200×630 PNG share image', () => {
    const image = fs.readFileSync(new URL('../public/og-card.png', import.meta.url));
    expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  });
});
