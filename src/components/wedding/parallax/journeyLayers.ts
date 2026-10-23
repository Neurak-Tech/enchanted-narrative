import landscape from "@/assets/parallax/landscape.webp";
import car from "@/assets/parallax/car.png";
import siddhiVatika from "@/assets/parallax/siddhi-vatika.png";
import hundredPearls from "@/assets/parallax/hundred-pearls.png";
import type { ParallaxLayerConfig, SceneMotion } from "./types";

const easeIn = (t: number) => t * t * t;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const linear = (t: number) => t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Scroll progress landmarks (Act 1) — buildings only; car does not pause. */
const APT1_HOLD_END = 0.34;
const APT1_OUT_END = 0.4;
const APT2_IN_END = 0.47;
const FINALE_START = 0.55;

export const journeyHeightClass = "h-[1100svh] md:h-[1300vh]";

export function getJourneyScene(isDesktop: boolean): SceneMotion {
  const zoomMid = FINALE_START + 0.1;
  const zoomEnd = FINALE_START + 0.22;

  if (isDesktop) {
    return {
      origin: "100% 100%",
      scale: {
        times: [0, FINALE_START, zoomMid, zoomEnd, 1],
        values: [1, 1, 1.35, 1.55, 1.62],
      },
      x: { times: [0, 1], values: ["0vw", "0vw"] },
      y: { times: [0, 1], values: ["0vh", "0vh"] },
    };
  }

  return {
    origin: "100% 100%",
    scale: {
      times: [0, FINALE_START, zoomMid, zoomEnd, 1],
      values: [1, 1, 1.22, 1.38, 1.42],
    },
    x: { times: [0, 1], values: ["0vw", "0vw"] },
    y: { times: [0, 1], values: ["0vh", "0vh"] },
  };
}

const CAR_CLASS =
  "absolute bottom-[5.5%] left-0 h-auto w-[78vw] max-w-[22rem] origin-bottom object-contain sm:bottom-[6%] sm:w-[68vw] md:bottom-[7%] md:h-[52vh] md:w-auto md:max-w-none lg:h-[58vh]";

function getCarLayer(isDesktop: boolean): ParallaxLayerConfig {
  const bounce = isDesktop ? 0.42 : 0.36;
  const yTimes = [0, 0.12, 0.24, 0.36, 0.48, FINALE_START, FINALE_START + 0.12, FINALE_START + 0.26, 1];
  const yValues = [
    "0vh",
    `-${bounce}vh`,
    `${bounce * 0.55}vh`,
    `-${bounce * 0.4}vh`,
    `${bounce * 0.25}vh`,
    "0vh",
    isDesktop ? "18vh" : "16vh",
    isDesktop ? "52vh" : "46vh",
    isDesktop ? "86vh" : "78vh",
  ];

  return {
    id: "car",
    src: car,
    alt: "Muskan and Prajwal on the road",
    z: 30,
    className: CAR_CLASS,
    x: {
      times: [0, 0.28, 0.42, 0.52, FINALE_START, 1],
      values: isDesktop
        ? ["-58vw", "22vw", "14vw", "10vw", "10vw", "10vw"]
        : ["-52vw", "10vw", "6vw", "4vw", "4vw", "4vw"],
      ease: [easeOut, easeInOut, easeInOut, linear, linear],
    },
    y: { times: yTimes, values: yValues },
    rotate: {
      times: yTimes,
      values: [0, 0.35, -0.22, 0.28, -0.15, 0, 0, 0.35, -0.2],
    },
    scale: {
      times: [0, FINALE_START, FINALE_START + 0.12, FINALE_START + 0.26, 1],
      values: isDesktop ? [1, 1, 1.85, 2.9, 3.6] : [1, 1, 1.7, 2.7, 3.4],
    },
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
        times: [0, APT1_HOLD_END, APT1_OUT_END, APT2_IN_END, FINALE_START, 1],
        values: isDesktop
          ? ["0vw", "0vw", "-4vw", "-14vw", "-16vw", "-18vw"]
          : ["0vw", "0vw", "-3vw", "-10vw", "-12vw", "-14vw"],
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
        times: [0, APT1_OUT_END, APT2_IN_END, 1],
        values: ["280vw", "280vw", "0vw", "0vw"],
        ease: [linear, easeOut, linear],
      },
      y: {
        times: [0, 1],
        values: [isDesktop ? "-48px" : "-108px", isDesktop ? "-48px" : "-108px"],
      },
    },
    getCarLayer(isDesktop),
  ];
}
