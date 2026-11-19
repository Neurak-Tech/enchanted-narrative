import { COUPLE } from "@/components/wedding/data";

import { absolutePublicAsset, canonicalSiteUrl, OG_IMAGE, SITE_NAME } from "./site";

const ogImage = absolutePublicAsset(OG_IMAGE);
const canonical = canonicalSiteUrl();

/** Browser tab, Open Graph, and Twitter title. */
export const PAGE_TITLE = "Muskan and Prajwal, A Journey Written Under The Stars";

export const OG_IMAGE_ALT = `${COUPLE.bride} and ${COUPLE.groom} — wedding invitation and love story`;

/** Width / height of `public/share-logo.jpg` (keep in sync if the asset changes). */
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "1200";

export function buildPageHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: PAGE_TITLE },
      { name: "author", content: `${COUPLE.bride} & ${COUPLE.groom}` },
      { name: "theme-color", content: "#d7eef6" },
      { name: "apple-mobile-web-app-title", content: COUPLE.monogram },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IN" },
      { property: "og:url", content: canonical },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:type", content: "website" },
      { property: "og:image", content: ogImage },
      { property: "og:image:url", content: ogImage },
      { property: "og:image:secure_url", content: ogImage },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: OG_IMAGE_WIDTH },
      { property: "og:image:height", content: OG_IMAGE_HEIGHT },
      { property: "og:image:alt", content: OG_IMAGE_ALT },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:image", content: ogImage },
      { name: "twitter:image:alt", content: OG_IMAGE_ALT },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}
