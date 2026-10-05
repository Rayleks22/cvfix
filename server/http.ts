import { MAX_API_BYTES } from '../src/lib/constants.ts';
import type { Env } from './types.ts';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, private',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
export function errorResponse(error: unknown): Response {
  return error instanceof HttpError
    ? json({ error: error.message }, error.status)
    : json({ error: 'We could not complete this request. Please try again.' }, 500);
}
export function requirePost(request: Request, env: Env): void {
  if (request.method !== 'POST') throw new HttpError(405, 'Use POST for this request.');
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
    throw new HttpError(415, 'Please send a JSON request.');
  const origin = request.headers.get('origin');
  const allowed = [new URL(request.url).origin];
  if (env.APP_URL) {
    try {
      allowed.push(new URL(env.APP_URL).origin);
    } catch {
      /* configuration checked at checkout */
    }
  }
  if (origin && !allowed.includes(origin))
    throw new HttpError(403, 'This request must come from CVFix.');
}
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const limit = MAX_API_BYTES;
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > limit) throw new HttpError(413, 'This request is too large.');
  if (!request.body) throw new HttpError(400, 'Please provide a request body.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new HttpError(413, 'This request is too large.');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    const result: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('shape');
    return result as Record<string, unknown>;
  } catch {
    throw new HttpError(400, 'This request is not valid JSON.');
  }
}
export function stringField(body: Record<string, unknown>, key: string, optional = false): string {
  if (optional && body[key] === undefined) return '';
  if (typeof body[key] !== 'string') throw new HttpError(400, `Please provide a valid ${key}.`);
  return body[key] as string;
}
export function paymentSettings(env: Env): {
  key: string;
  mode: 'test' | 'live';
  origin: string;
  supportEmail: string;
} {
  const key = env.PAYSTACK_SECRET_KEY || '';
  const mode = key.startsWith('sk_live_') ? 'live' : 'test';
  let origin = '';
  try {
    const url = new URL(env.APP_URL || '');
    const localTest =
      mode === 'test' &&
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname);
    if (url.protocol !== 'https:' && !localTest) throw new Error('protocol');
    if (url.username || url.password || url.pathname !== '/' || url.search || url.hash)
      throw new Error('url');
    origin = url.origin;
  } catch {
    throw new HttpError(
      503,
      'Paid downloads are not configured yet. Your free review is still available.',
    );
  }
  if (
    !/^sk_(?:test|live)_[A-Za-z0-9]{16,}$/.test(key) ||
    (env.SESSION_SECRET || '').length < 32 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.SUPPORT_EMAIL || '')
  ) {
    throw new HttpError(
      503,
      'Paid downloads are not configured yet. Your free review is still available.',
    );
  }
  return { key, mode, origin, supportEmail: env.SUPPORT_EMAIL! };
}
