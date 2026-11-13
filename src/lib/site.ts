/** Public asset path (respects Vite `base`, e.g. `/enchanted-narrative/`). */
export function publicAsset(path: string) {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\//, "");
  return `${base}${clean}`;
}

const siteOrigin = (
  (import.meta.env.VITE_SITE_ORIGIN as string | undefined) ?? "https://neurak-tech.github.io"
).replace(/\/$/, "");

export const SITE_NAME = "From Yaar to Pyaar";

/** Canonical site URL (respects `VITE_SITE_ORIGIN` and Vite `base`). */
export function canonicalSiteUrl(): string {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/" || base === "") {
    return `${siteOrigin}/`;
  }
  const path = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${siteOrigin}${path.startsWith("/") ? path : `/${path}`}/`;
}

/** Absolute URL for Open Graph / Twitter cards (override with `VITE_SITE_ORIGIN` if needed). */
export function absolutePublicAsset(path: string) {
  const relative = publicAsset(path);
  return `${siteOrigin}${relative.startsWith("/") ? relative : `/${relative}`}`;
}

/** Social preview image (served from `/public`). */
export const OG_IMAGE = "share-og.jpg";

/** Favicon / touch icon (monogram on dark). */
export const FAVICON_IMAGE = "logo-white.png";
