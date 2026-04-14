/**
 * Backend API origin (no trailing slash).
 * - Set VITE_BACKEND_URL in Vercel (and redeploy) so Preview/Production builds embed your API host.
 * - If that env var is missing at build time, production bundles would otherwise fall back to localhost;
 *   we default to the deployed API so the site still works when the dashboard env is mis-scoped or missing.
 */
const PRODUCTION_DEFAULT_ORIGIN = "https://movietime-u9aa.onrender.com";

function resolveApiOrigin() {
  const fromEnv = import.meta.env.VITE_BACKEND_URL;
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "http://localhost:3000";
  return PRODUCTION_DEFAULT_ORIGIN;
}

export const API_ORIGIN = resolveApiOrigin().replace(/\/+$/, "");
