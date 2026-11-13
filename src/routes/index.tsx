import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import ActBeginning from "@/components/wedding/ActBeginning";
import ActDate from "@/components/wedding/ActDate";
import ActCouple from "@/components/wedding/ActCouple";
import ActAlbum from "@/components/wedding/ActAlbum";
import ActFunctions from "@/components/wedding/ActFunctions";
import ActEnd from "@/components/wedding/ActEnd";
import { BackgroundMusic } from "@/components/wedding/BackgroundMusic";
import { CurtainPreloader } from "@/components/wedding/CurtainPreloader";
import { ActSeam } from "@/components/wedding/ActSeam";
import { SEAM } from "@/components/wedding/ActSection";
import { COUPLE } from "@/components/wedding/data";
import { setSmoothScroll, type SmoothScroll } from "@/lib/smooth-scroll";
import { absolutePublicAsset, OG_IMAGE } from "@/lib/site";

const ogImage = absolutePublicAsset(OG_IMAGE);

const TITLE = `${COUPLE.bride} & ${COUPLE.groom} — A Wedding Story`;
const DESC =
  "An interactive wedding story: unlock the date, meet the couple, wander the years, and celebrate every function.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
  }),
  component: Index,
});

function scrollPageToTop(immediate = true) {
  if (typeof window === "undefined") return;
  window.history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const lenis = (window as unknown as { __smoothScroll?: SmoothScroll }).__smoothScroll;
  lenis?.scrollTo(0, { immediate: true });
}

function Index() {
  const [curtainDone, setCurtainDone] = useState(false);

  useLayoutEffect(() => {
    scrollPageToTop(true);
  }, []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) scrollPageToTop(true);
    };
    window.addEventListener("pageshow", onPageShow);
    scrollPageToTop(true);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!curtainDone) return;

    let raf = 0;
    let lenis: SmoothScroll | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ duration: 1.25, smoothWheel: true }) as unknown as SmoothScroll;
      lenis = instance;
      setSmoothScroll(instance);
      (window as unknown as { __smoothScroll?: SmoothScroll }).__smoothScroll = instance;
      scrollPageToTop(true);
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      setSmoothScroll(null);
      delete (window as unknown as { __smoothScroll?: SmoothScroll }).__smoothScroll;
      lenis?.destroy();
    };
  }, [curtainDone]);

  return (
    <>
      <BackgroundMusic visible={curtainDone} />
      <CurtainPreloader onComplete={() => setCurtainDone(true)} />
      <main
        className="relative bg-[var(--seam-meadow)]"
        aria-hidden={!curtainDone}
        inert={!curtainDone ? true : undefined}
      >
      <ActBeginning />
      <ActDate />
      <ActSeam from={SEAM.blush} to={SEAM.coral} compact />
      <ActCouple />
      <ActSeam from={SEAM.coral} to={SEAM.blush} />
      <ActAlbum />
      <ActFunctions />
      <ActSeam from={SEAM.blush} to={SEAM.ending} dramatic />
      <ActEnd />
    </main>
    </>
  );
}
