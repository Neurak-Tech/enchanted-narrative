import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import ActBeginning from "@/components/wedding/ActBeginning";
import ActCouple from "@/components/wedding/ActCouple";
import ActJourney from "@/components/wedding/ActJourney";
import ActDate from "@/components/wedding/ActDate";
import ActWorld from "@/components/wedding/ActWorld";
import ActFinale from "@/components/wedding/ActFinale";
import SurpriseLayer from "@/components/wedding/SurpriseLayer";
import { COUPLE } from "@/components/wedding/data";

const TITLE = `${COUPLE.groom} & ${COUPLE.bride} — A Wedding in Six Acts`;
const DESC =
  "An interactive, cinematic wedding story: the meeting, the couple, the journey, the date, the venue world, and a constellation finale.";

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
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let cancelled = false;

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.25, smoothWheel: true });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <main className="relative">
      <ActBeginning />
      <ActCouple />
      <ActJourney />
      <ActDate />
      <ActWorld />
      <ActFinale />
      <SurpriseLayer />
    </main>
  );
}
