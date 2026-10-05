import { MAX_REVIEW_TOKEN_CHARS } from './constants.ts';
import type { PublicConfig } from '../types/index.ts';

export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(25_000),
    cache: 'no-store',
  });
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('The service returned an unexpected response. Please try again.');
  }
  if (!response.ok)
    throw new Error(
      typeof data === 'object' && data && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'This request could not be completed.',
    );
  return data as T;
}
export const EMPTY_CONFIG: PublicConfig = {
  paymentsEnabled: false,
  paymentMode: 'unavailable',
  supportEmail: null,
  priceKobo: 100_000,
  currency: 'NGN',
};

export interface PurchaseSession {
  reviewToken: string;
  reference: string;
  expiresAt: number;
}
const STORAGE_KEY = 'cvfix.checkout.v2';
export function savePurchase(session: PurchaseSession): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    throw new Error(
      'Your browser blocked temporary checkout storage. Please allow storage in this tab before paying; you have not been charged.',
    );
  }
}
export function loadPurchase(): PurchaseSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as PurchaseSession;
    if (
      typeof value.reviewToken !== 'string' ||
      value.reviewToken.length > MAX_REVIEW_TOKEN_CHARS ||
      !/^CVFIX_[A-Za-z0-9]{32}$/.test(value.reference) ||
      !Number.isFinite(value.expiresAt)
    ) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    // Expired references are kept for the recovery message, not silently retried or discarded.
    return value;
  } catch {
    return null;
  }
}
export function clearPurchase(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* unavailable storage */
  }
}
