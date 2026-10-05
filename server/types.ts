export interface Env {
  SESSION_SECRET?: string;
  PAYSTACK_SECRET_KEY?: string;
  APP_URL?: string;
  SUPPORT_EMAIL?: string;
}
export interface FunctionContext {
  request: Request;
  env: Env;
}
