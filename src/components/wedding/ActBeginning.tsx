import { useMemo } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { ParallaxPinned } from "./parallax/ParallaxPinned";
import { getJourneyLayers, getJourneyScene, journeyHeightClass } from "./parallax/journeyLayers";
import { useMediaQuery } from "./parallax/useMediaQuery";

function Title({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.32, 0.42], [1, 1, 0]);
  const y = useTransform(progress, [0, 0.32, 0.42], ["0%", "0%", "-12%"]);

  return (
    <>
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[42%] bg-gradient-to-b from-pearl/85 via-pearl/35 to-transparent md:h-[34%] md:from-pearl/75 md:via-pearl/25"
      />
      <motion.header
        style={{ opacity, y }}
        className="pointer-events-none absolute inset-x-0 top-[2.5%] z-50 px-5 text-center sm:top-[4%] md:top-[5%] md:px-4"
      >
        <p className="mb-2 text-[0.58rem] uppercase tracking-luxe text-ink/70 sm:mb-3 sm:text-[0.65rem] md:mb-4 md:text-[0.7rem]">
          Act One — The Beginning
        </p>
        <h1 className="font-display text-[clamp(1.7rem,11vw,2.4rem)] leading-[0.94] text-ink sm:text-[clamp(2rem,6vw,4rem)] md:text-[clamp(2.1rem,7.4vw,5.6rem)] md:leading-[0.92]">
          <span className="block">Two Stories.</span>
          <span className="block italic text-foil">One Forever.</span>
        </h1>
      </motion.header>
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
    >
      {(progress) => <Title progress={progress} />}
    </ParallaxPinned>
  );
}
