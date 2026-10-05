import { normaliseCV, reviewCV, validateReviewInput } from '../../src/lib/review.ts';
import { createSession } from '../../server/sessions.ts';
import {
  errorResponse,
  HttpError,
  json,
  paymentSettings,
  readJson,
  requirePost,
  stringField,
} from '../../server/http.ts';
import type { FunctionContext } from '../../server/types.ts';

/** Only used after explicit checkout consent. Free reviews run in the browser. */
export async function onRequest(context: FunctionContext): Promise<Response> {
  try {
    requirePost(context.request, context.env);
    paymentSettings(context.env);
    const body = await readJson(context.request);
    if (body.consent !== true)
      throw new HttpError(400, 'Please confirm that you agree to secure checkout processing.');
    const input = {
      cvText: normaliseCV(stringField(body, 'cvText')),
      targetRole: stringField(body, 'targetRole', true).trim(),
      jobDescription: stringField(body, 'jobDescription', true).trim(),
    };
    try {
      validateReviewInput(input);
    } catch (error) {
      throw new HttpError(
        400,
        error instanceof Error ? error.message : 'Please provide a readable CV.',
      );
    }
    const { token, session } = await createSession(input, context.env.SESSION_SECRET!);
    // No full rewrite or paid document is returned by this endpoint.
    return json({
      result: reviewCV(input),
      reviewToken: token,
      reviewId: session.id,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
