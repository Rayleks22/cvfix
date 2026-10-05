import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { Env, FunctionContext } from './server/types.ts';

/** Run the real Pages handlers locally, using Vite's SSR loader for fresh backend modules. */
function localPagesAPI(env: Env): Plugin {
  return {
    name: 'cvfix-local-pages-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0];
        if (!path?.startsWith('/api/')) return next();
        const modules: Record<string, string> = {
          '/api/analyze-cv': '/functions/api/analyze-cv.ts',
          '/api/payments/initialize': '/functions/api/payments/initialize.ts',
          '/api/payments/verify': '/functions/api/payments/verify.ts',
          '/api/config': '/functions/api/config.ts',
        };
        const modulePath = modules[path];
        if (!modulePath) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Not found.' }));
          return;
        }
        try {
          const chunks: Buffer[] = [];
          let size = 0;
          for await (const chunk of req) {
            const bytes = Buffer.from(chunk);
            size += bytes.length;
            if (size > 240_000) {
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'This request is too large.' }));
              return;
            }
            chunks.push(bytes);
          }
          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers))
            if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
          const host = req.headers.host || 'localhost:3000';
          const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
          const request = new Request(`${protocol}://${host}${req.url}`, {
            method: req.method || 'GET',
            headers,
            body: ['GET', 'HEAD'].includes(req.method || 'GET') ? undefined : Buffer.concat(chunks),
          });
          const module = await server.ssrLoadModule(modulePath);
          let response: Response;
          if (path === '/api/config' && request.method !== 'GET') {
            response = new Response(JSON.stringify({ error: 'Use GET for this request.' }), {
              status: 405,
              headers: { 'Content-Type': 'application/json' },
            });
          } else {
            const handler = (path === '/api/config' ? module.onRequestGet : module.onRequest) as (
              context: FunctionContext,
            ) => Response | Promise<Response>;
            response = await handler({ request, env });
          }
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Local API could not complete this request.' }));
        }
      });
    },
  };
}
export default defineConfig(({ mode }) => {
  const values = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const env: Env = {
    SESSION_SECRET: values.SESSION_SECRET,
    PAYSTACK_SECRET_KEY: values.PAYSTACK_SECRET_KEY,
    APP_URL: values.APP_URL,
    SUPPORT_EMAIL: values.SUPPORT_EMAIL,
  };
  return {
    plugins: [react(), localPagesAPI(env)],
    resolve: { alias: { buffer: 'buffer/' } },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    },
    build: { outDir: 'dist', sourcemap: false, chunkSizeWarningLimit: 1300 },
  };
});
