import { json, paymentSettings } from '../../server/http.ts';
import type { FunctionContext } from '../../server/types.ts';
import { PRICE_KOBO } from '../../src/lib/constants.ts';

export function onRequestGet({ env }: FunctionContext): Response {
  let paymentsEnabled = false;
  let paymentMode: 'test' | 'live' | 'unavailable' = 'unavailable';
  try {
    const settings = paymentSettings(env);
    paymentsEnabled = true;
    paymentMode = settings.mode;
  } catch {
    /* Fail closed, never simulate a payment. */
  }
  return json({
    paymentsEnabled,
    paymentMode,
    supportEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.SUPPORT_EMAIL || '')
      ? env.SUPPORT_EMAIL
      : null,
    priceKobo: PRICE_KOBO,
    currency: 'NGN',
  });
}
