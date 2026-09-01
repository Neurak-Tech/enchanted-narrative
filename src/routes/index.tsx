import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ActBeginning from "@/components/wedding/ActBeginning";
import ActDate from "@/components/wedding/ActDate";
import ActCouple from "@/components/wedding/ActCouple";
import ActAlbum from "@/components/wedding/ActAlbum";
import ActJourney from "@/components/wedding/ActJourney";
import ActFunctions from "@/components/wedding/ActFunctions";
import ActEnd from "@/components/wedding/ActEnd";
import SurpriseLayer from "@/components/wedding/SurpriseLayer";
import { COUPLE } from "@/components/wedding/data";
import { setSmoothScroll, type SmoothScroll } from "@/lib/smooth-scroll";

const TITLE = `${COUPLE.bride} & ${COUPLE.groom} — A Wedding Story`;
const DESC =
  "An interactive wedding story: unlock the date, meet the couple, wander the years, follow the journey, and celebrate every function.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    let raf = 0;
    let lenis: SmoothScroll | null = null;
    let cancelled = false;

    window.history.scrollRestoration = "manual";
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ duration: 1.25, smoothWheel: true }) as unknown as SmoothScroll;
      lenis = instance;
      setSmoothScroll(instance);
      (window as unknown as { __smoothScroll?: SmoothScroll }).__smoothScroll = instance;
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
  }, []);

  return (
    <main className="relative">
      <ActBeginning />
      <ActDate />
      <ActCouple />
      <ActAlbum />
      <ActJourney />
      <ActFunctions />
      <ActEnd />
      <SurpriseLayer />
    </main>
  );
}
