import type { ReviewInput } from '../src/types/index.ts';
import { SESSION_TTL_MS, MAX_REVIEW_TOKEN_CHARS } from '../src/lib/constants.ts';
import { validateReviewInput } from '../src/lib/review.ts';
import { HttpError } from './http.ts';

export interface ReviewSession extends ReviewInput {
  version: 2;
  id: string;
  expiresAt: number;
}
function encode(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decode(value: string): Uint8Array {
  const base = value.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base), (char) => char.charCodeAt(0));
}
async function keyFor(secret: string): Promise<CryptoKey> {
  if (secret.length < 32) throw new HttpError(503, 'Secure checkout is not configured yet.');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt', 'decrypt']);
}
export async function createSession(
  input: ReviewInput,
  secret: string,
  now = Date.now(),
): Promise<{ token: string; session: ReviewSession }> {
  validateReviewInput(input);
  const session: ReviewSession = {
    ...input,
    version: 2,
    id: crypto.randomUUID(),
    expiresAt: now + SESSION_TTL_MS,
  };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new TextEncoder().encode(JSON.stringify(session));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode('cvfix-review-v2') },
    await keyFor(secret),
    data,
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return { token: encode(combined), session };
}
export async function readSession(
  token: string,
  secret: string,
  now = Date.now(),
): Promise<ReviewSession> {
  if (!token || token.length > MAX_REVIEW_TOKEN_CHARS || !/^[A-Za-z0-9_-]+$/.test(token))
    throw new HttpError(400, 'This review session is invalid. Please review your CV again.');
  const key = await keyFor(secret);
  let session: ReviewSession;
  try {
    const data = decode(token);
    if (data.length < 30) throw new Error('short');
    const result = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: data.slice(0, 12),
        additionalData: new TextEncoder().encode('cvfix-review-v2'),
      },
      key,
      data.slice(12),
    );
    session = JSON.parse(new TextDecoder().decode(result)) as ReviewSession;
    if (
      session.version !== 2 ||
      !session.id ||
      !Number.isFinite(session.expiresAt) ||
      typeof session.cvText !== 'string' ||
      typeof session.targetRole !== 'string' ||
      typeof session.jobDescription !== 'string'
    )
      throw new Error('shape');
    validateReviewInput(session);
  } catch {
    throw new HttpError(400, 'This review session is invalid. Please review your CV again.');
  }
  if (session.expiresAt <= now)
    throw new HttpError(
      410,
      'This checkout session has expired. If you have already paid, contact support with your payment reference; otherwise review your CV again.',
    );
  return session;
}
