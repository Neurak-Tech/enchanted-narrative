import { useMemo } from "react";
import { motion } from "motion/react";
import { ParallaxPinned } from "./parallax/ParallaxPinned";
import { JourneyRoad } from "./parallax/JourneyRoad";
import { getJourneyLayers, getJourneyScene, journeyHeightClass } from "./parallax/journeyLayers";
import { useMediaQuery } from "./parallax/useMediaQuery";

function Title() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[42%] bg-gradient-to-b from-[#d7eef6]/90 via-[#d7eef6]/40 to-transparent md:h-[34%] md:from-[#d7eef6]/75 md:via-[#d7eef6]/25" />
      <header className="pointer-events-none absolute left-1/2 top-[8%] z-50 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 text-left sm:top-[4%] md:top-[5%]">
        <h1 className="font-display text-[clamp(1.7rem,6.2vw,3.15rem)] font-semibold leading-[0.98] text-[#241810]">
          <span className="block">Muskan and Prajwal,</span>
          <span className="ml-[8%] block leading-[0.95] text-[#95271d] sm:ml-12">
            A Journey Written
          </span>
          <span className="ml-[16%] block leading-[0.95] text-[#95271d] sm:ml-24">
            Under The Stars
          </span>
        </h1>
        <motion.p
          animate={{ opacity: [0.4, 0.75, 0.4], y: [0, 3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-3 text-center text-[0.58rem] uppercase tracking-[0.32em] text-[#95271d]/60"
        >
          Scroll
        </motion.p>
      </header>
    </>
  );
}

export default function ActBeginning() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const layers = useMemo(() => getJourneyLayers(isDesktop), [isDesktop]);
  const scene = useMemo(() => getJourneyScene(isDesktop), [isDesktop]);

  return (
    <ParallaxPinned
      id="act-1"
      key={isDesktop ? "desktop" : "mobile"}
      layers={layers}
      scene={scene}
      heightClass={journeyHeightClass}
      tone="meadow"
      smoothScrollProgress={false}
      inScene={(progress) => <JourneyRoad progress={progress} />}
    >
      <Title />
    </ParallaxPinned>
  );
}
