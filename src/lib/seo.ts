import { COUPLE } from "@/components/wedding/data";

import { absolutePublicAsset, canonicalSiteUrl, OG_IMAGE, SITE_NAME } from "./site";

const ogImage = absolutePublicAsset(OG_IMAGE);
const canonical = canonicalSiteUrl();

const weddingDate = `${COUPLE.date.day} ${COUPLE.date.month} ${COUPLE.date.year}`;

/** Browser tab & primary OG/Twitter title (~60 chars for SERP). */
export const PAGE_TITLE = `${COUPLE.bride} & ${COUPLE.groom} — A Journey to Remember`;

/** Longer variant when you want the date in the title (some crawlers show it). */
export const PAGE_TITLE_WITH_DATE = `${PAGE_TITLE} · ${weddingDate}`;

export const PAGE_DESCRIPTION =
  "An interactive wedding story in six acts — unlock the date, meet Muskan & Prajwal, wander the years, and celebrate every function. November 25, 2026.";

export const OG_IMAGE_ALT = `${COUPLE.bride} and ${COUPLE.groom} — wedding invitation and love story`;

/** Width / height of `public/share-og.jpg` (keep in sync if the asset changes). */
export const OG_IMAGE_WIDTH = "681";
export const OG_IMAGE_HEIGHT = "1024";

export function buildPageHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { name: "author", content: `${COUPLE.bride} & ${COUPLE.groom}` },
      { name: "theme-color", content: "#d7eef6" },
      { name: "apple-mobile-web-app-title", content: COUPLE.monogram },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { property: "og:url", content: canonical },
      { property: "og:title", content: PAGE_TITLE_WITH_DATE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { property: "og:image:url", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: OG_IMAGE_WIDTH },
      { property: "og:image:height", content: OG_IMAGE_HEIGHT },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE_WITH_DATE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
