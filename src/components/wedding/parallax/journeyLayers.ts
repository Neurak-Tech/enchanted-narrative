import landscape from "@/assets/parallax/landscape.webp";
import car from "@/assets/parallax/car.png";
import siddhiVatika from "@/assets/parallax/siddhi-vatika.png";
import hundredPearls from "@/assets/parallax/hundred-pearls.png";
import type { ParallaxLayerConfig, SceneMotion } from "./types";

const easeOut = (t: number) => 1 - (1 - t) ** 2;
const linear = (t: number) => t;

/**
 * Story fills the pin. The last ~1 viewport is the natural handoff into section 2,
 * so there is no blank hold and no color wash.
 */
const APT1_HOLD_END = 0.4;
const APT1_OUT_END = 0.5;
const APT2_IN_END = 0.6;
const CAR_ARRIVE = 0.58;
const CAR_LANE = 0.64;

export const journeyHeightClass = "h-[460svh] md:h-[500vh]";

/** Camera stays put. Section 2 arrives by the pin releasing, not by a second slide. */
export function getJourneyScene(_isDesktop: boolean): SceneMotion {
  return {
    origin: "50% 70%",
    scale: { times: [0, 1], values: [1, 1] },
    x: { times: [0, 1], values: ["0vw", "0vw"] },
    y: { times: [0, 1], values: ["0vh", "0vh"] },
  };
}

const CAR_CLASS =
  "absolute bottom-[5.5%] left-0 h-auto w-[78vw] max-w-[22rem] origin-bottom object-contain sm:bottom-[6%] sm:w-[68vw] md:bottom-[7%] md:h-[52vh] md:w-auto md:max-w-none lg:h-[58vh]";

function getCarLayer(isDesktop: boolean): ParallaxLayerConfig {
  const bounce = isDesktop ? 0.42 : 0.36;
  const laneX = isDesktop ? "10vw" : "4vw";
  const approachX = isDesktop ? "4vw" : "-1vw";
  const yTimes = [0, 0.18, 0.36, 0.5, CAR_LANE, 1];
  const yValues = ["0vh", `-${bounce}vh`, `${bounce * 0.5}vh`, `-${bounce * 0.28}vh`, "0vh", "0vh"];

  return {
    id: "car",
    src: car,
    alt: "Muskan and Prajwal on the road",
    z: 30,
    className: CAR_CLASS,
    x: {
      times: [0, CAR_ARRIVE, CAR_LANE, 1],
      values: isDesktop ? ["-58vw", approachX, laneX, laneX] : ["-52vw", approachX, laneX, laneX],
      ease: [linear, easeOut, linear],
    },
    y: { times: yTimes, values: yValues },
  };
}

export function getJourneyLayers(isDesktop: boolean): ParallaxLayerConfig[] {
  return [
    {
      id: "landscape",
      src: landscape,
      alt: "Watercolor countryside of rolling hills and a meadow",
      z: 0,
      fetchPriority: "high",
      className:
        "absolute inset-0 h-full w-[120%] max-w-none object-cover object-[center_92%] md:h-[118%] md:w-[130%] md:object-[center_70%]",
      restClassName: "absolute inset-0 h-full w-full object-cover object-[center_88%] md:object-[center_70%]",
      x: {
        times: [0, APT1_HOLD_END, APT1_OUT_END, APT2_IN_END, 1],
        values: isDesktop
          ? ["0vw", "0vw", "-4vw", "-14vw", "-14vw"]
          : ["0vw", "0vw", "-3vw", "-10vw", "-10vw"],
      },
    },
    {
      id: "siddhi-vatika",
      src: siddhiVatika,
      alt: "Siddhi Vatika apartment gate",
      z: 10,
      className:
        "absolute bottom-[13%] left-[-92vw] h-auto w-[290vw] max-w-none object-contain object-bottom sm:bottom-[11%] md:bottom-[5%] md:left-[-32vw] md:w-[188vw]",
      restClassName:
        "absolute bottom-[12%] left-[-24vw] h-auto w-[160vw] object-contain object-bottom md:bottom-[5%] md:w-[100vw]",
      x: {
        times: [0, APT1_HOLD_END, APT1_OUT_END],
        values: isDesktop ? ["0vw", "0vw", "-220vw"] : ["0vw", "0vw", "-250vw"],
      },
    },
    {
      id: "hundred-pearls",
      src: hundredPearls,
      alt: "100 Pearls apartment building",
      z: 20,
      className:
        "absolute bottom-0 right-[-12vw] h-auto w-[248vw] max-w-none origin-bottom-right object-contain object-right object-bottom sm:w-[226vw] md:right-[-9vw] md:w-[178vw]",
      restClassName:
        "absolute bottom-0 right-[-12vw] h-auto w-[230vw] max-w-none origin-bottom-right object-contain object-right object-bottom md:right-[-9vw] md:w-[160vw]",
      x: {
        times: [0, APT1_OUT_END, 0.56, APT2_IN_END, 1],
        values: ["280vw", "280vw", "18vw", "0vw", "0vw"],
        ease: [linear, linear, easeOut, linear],
      },
      y: {
        times: [0, 1],
        values: [isDesktop ? "-48px" : "-108px", isDesktop ? "-48px" : "-108px"],
      },
    },
    getCarLayer(isDesktop),
  ];
}
