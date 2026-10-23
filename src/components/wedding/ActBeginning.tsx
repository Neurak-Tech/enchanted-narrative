import { useMemo } from "react";
import { ParallaxPinned } from "./parallax/ParallaxPinned";
import { JourneyRoad } from "./parallax/JourneyRoad";
import { getJourneyLayers, getJourneyScene, journeyHeightClass } from "./parallax/journeyLayers";
import { useMediaQuery } from "./parallax/useMediaQuery";

function Title() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[42%] bg-gradient-to-b from-[#d7eef6]/90 via-[#d7eef6]/40 to-transparent md:h-[34%] md:from-[#d7eef6]/75 md:via-[#d7eef6]/25"
      />
      <header
        className="pointer-events-none absolute left-1/2 top-[10%] z-50 w-max max-w-[calc(100%-2.5rem)] -translate-x-1/2 text-left sm:top-[4%] md:top-[5%]"
      >
        <h1 className="font-display text-[clamp(2.1rem,9vw,4.25rem)] font-semibold leading-[0.96] text-[#241810]">
          <span className="block">A Journey</span>
          <span className="ml-20 block leading-[0.9] text-[#95271d]">to Remember</span>
        </h1>
        <p className="tracking-luxe mt-2 text-center text-[0.75rem] uppercase text-[#95271d] sm:text-xs">
Muskan & Prajwal      </p>
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
      inScene={(progress) => <JourneyRoad progress={progress} />}
    >
      <Title />
    </ParallaxPinned>
  );
}
