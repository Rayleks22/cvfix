import { buildFullPackage } from '../../../server/documents.ts';
import { reviewCV } from '../../../src/lib/review.ts';
import type { VerifiedPayment } from '../../../src/types/index.ts';
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

interface VerifiedTransaction {
  status?: string;
  amount?: number;
  currency?: string;
  reference?: string;
  domain?: string;
  metadata?: { reviewId?: string; product?: string } | string;
}
export async function onRequest(context: FunctionContext): Promise<Response> {
  try {
    requirePost(context.request, context.env);
    const settings = paymentSettings(context.env);
    const body = await readJson(context.request);
    const session = await readSession(
      stringField(body, 'reviewToken'),
      context.env.SESSION_SECRET!,
    );
    const reference = stringField(body, 'reference');
    if (!/^CVFIX_[A-Za-z0-9]{32}$/.test(reference))
      throw new HttpError(400, 'Please provide a valid CVFix payment reference.');
    let response: Response;
    try {
      response = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          signal: AbortSignal.timeout(15_000),
          headers: { Authorization: `Bearer ${settings.key}` },
        },
      );
    } catch {
      throw new HttpError(
        502,
        'We could not verify payment yet. Keep your reference and retry; do not pay again.',
      );
    }
    if (!response.ok)
      throw new HttpError(
        502,
        'We could not verify payment yet. Keep your reference and retry; do not pay again.',
      );
    const payload = (await response.json()) as { status?: boolean; data?: VerifiedTransaction };
    const transaction = payload.data;
    let metadata = transaction?.metadata;
    if (typeof metadata === 'string') {
      try {
        metadata = JSON.parse(metadata) as VerifiedTransaction['metadata'];
      } catch {
        metadata = undefined;
      }
    }
    if (!payload.status || !transaction || transaction.status !== 'success')
      throw new HttpError(
        402,
        'This payment has not been confirmed. If you were charged, retry verification rather than paying again.',
      );
    if (
      transaction.reference !== reference ||
      transaction.currency !== 'NGN' ||
      transaction.amount !== PRICE_KOBO ||
      transaction.domain !== settings.mode ||
      !metadata ||
      typeof metadata !== 'object' ||
      metadata.reviewId !== session.id ||
      metadata.product !== 'cvfix_full_cv_v2'
    ) {
      throw new HttpError(
        403,
        'This payment does not match this CV package. Contact support with your reference.',
      );
    }
    // The server, not a browser callback, is the authority on access to paid output.
    const payment: VerifiedPayment = {
      verified: true,
      reference,
      package: buildFullPackage(session),
      review: reviewCV(session),
      source: {
        cvText: session.cvText,
        targetRole: session.targetRole,
        jobDescription: session.jobDescription,
      },
    };
    return json(payment);
  } catch (error) {
    return errorResponse(error);
  }
}
