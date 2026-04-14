/** Backend API origin (no trailing slash). Vite injects at build time. */
export const API_ORIGIN = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
).replace(/\/+$/, "");
