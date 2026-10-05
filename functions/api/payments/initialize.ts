import { PRICE_KOBO } from '../../../src/lib/constants.ts';
import { readSession } from '../../../server/sessions.ts';
import {
  errorResponse,
  HttpError,
  json,
  paymentSettings,
  readJson,
  requirePost,
  stringField,
} from '../../../server/http.ts';
import type { FunctionContext } from '../../../server/types.ts';

export async function onRequest(context: FunctionContext): Promise<Response> {
  try {
    requirePost(context.request, context.env);
    const settings = paymentSettings(context.env);
    const body = await readJson(context.request);
    const session = await readSession(
      stringField(body, 'reviewToken'),
      context.env.SESSION_SECRET!,
    );
    const email = stringField(body, 'email').trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new HttpError(400, 'Please enter a valid email for your Paystack receipt.');
    const reference = `CVFIX_${crypto.randomUUID().replace(/-/g, '')}`;
    let response: Response;
    try {
      response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        signal: AbortSignal.timeout(15_000),
        headers: { Authorization: `Bearer ${settings.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: PRICE_KOBO,
          currency: 'NGN',
          reference,
          callback_url: `${settings.origin}/?payment=return&reference=${reference}`,
          metadata: { reviewId: session.id, product: 'cvfix_full_cv_v2' },
        }),
      });
    } catch {
      throw new HttpError(
        502,
        'Paystack could not be reached. Please try again; no document has been unlocked.',
      );
    }
    if (!response.ok)
      throw new HttpError(502, 'Paystack could not start checkout. Please try again later.');
    const data = (await response.json()) as {
      status?: boolean;
      data?: { authorization_url?: string; reference?: string };
    };
    const authorizationUrl = data.data?.authorization_url || '';
    let url: URL;
    try {
      url = new URL(authorizationUrl);
    } catch {
      throw new HttpError(502, 'Paystack returned an invalid checkout link.');
    }
    if (
      !data.status ||
      data.data?.reference !== reference ||
      url.protocol !== 'https:' ||
      url.hostname !== 'checkout.paystack.com'
    )
      throw new HttpError(502, 'Paystack returned an invalid checkout link.');
    return json({ authorizationUrl, reference, expiresAt: session.expiresAt, mode: settings.mode });
  } catch (error) {
    return errorResponse(error);
  }
}
