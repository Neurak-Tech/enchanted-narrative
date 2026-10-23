/** Public asset path (respects Vite `base`, e.g. `/enchanted-narrative/`). */
export function publicAsset(path: string) {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}

const siteOrigin = (
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) ?? "https://neurak-tech.github.io"
).replace(/\/$/, "");

/** Absolute URL for Open Graph / Twitter cards (override with `VITE_SITE_ORIGIN` if needed). */
export function absolutePublicAsset(path: string) {
  const relative = publicAsset(path);
  return `${siteOrigin}${relative.startsWith("/") ? relative : `/${relative}`}`;
}

export const OG_IMAGE = "logo-white.png";
