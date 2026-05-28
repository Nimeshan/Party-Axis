/**
 * Absolute base URL for the legacy PHP deployment (same origin as /api/*.php files).
 */
export function getBackendOrigin(): string | null {
  const raw = process.env.PARTYAXIS_BACKEND_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

export function backendApiUrl(path: string): string | null {
  const origin = getBackendOrigin();
  if (!origin) return null;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}
