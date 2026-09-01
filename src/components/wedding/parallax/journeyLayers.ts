import landscape from "@/assets/parallax/landscape.webp";
import car from "@/assets/parallax/car.png";
import siddhiVatika from "@/assets/parallax/siddhi-vatika.png";
import hundredPearls from "@/assets/parallax/hundred-pearls.png";
import type { ParallaxLayerConfig, SceneMotion } from "./types";

/**
 * 0.00–0.10  apartment 1
 * 0.10–0.24  car arrives at apt 1
 * 0.24–0.34  hold at apt 1
 * 0.34–0.42  apartment 1 slides out
 * 0.42–0.68  OPEN ROAD: hills + car only (~3–4s of pin)
 * 0.68–0.78  apartment 2 slides in; car approaches its gate
 * 0.78–0.88  hold at apartment 2
 * 0.88–1.00  camera-behind zoom + sink
 */
export const journeyHeightClass = "h-[1280svh] md:h-[1600vh]";

export function getJourneyScene(isDesktop: boolean): SceneMotion {
  if (isDesktop) {
    return {
      origin: "50% 78%",
      scale: { times: [0, 0.88, 0.96, 1], values: [1, 1, 1.2, 1.32] },
      x: { times: [0, 0.88, 1], values: ["0vw", "0vw", "0vw"] },
      y: { times: [0, 0.88, 1], values: ["0vh", "0vh", "4vh"] },
    };
  }

  return {
    origin: "50% 82%",
    scale: { times: [0, 0.88, 0.96, 1], values: [1, 1, 1.08, 1.12] },
    x: { times: [0, 0.88, 1], values: ["0vw", "0vw", "0vw"] },
    y: { times: [0, 0.88, 1], values: ["0vh", "0vh", "2vh"] },
  };
}

export function getJourneyLayers(isDesktop: boolean): ParallaxLayerConfig[] {
  const gate1 = isDesktop ? "18vw" : "8vw";
  const road = isDesktop ? "38vw" : "32vw";
  const gate2 = isDesktop ? "10vw" : "4vw";
  const bounce = isDesktop ? 0.5 : 0.38;
  const idle = isDesktop ? 0.18 : 0.14;

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
        times: [0, 0.34, 0.42, 0.68, 0.88, 1],
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
        times: [0, 0.34, 0.42],
        values: isDesktop ? ["0vw", "0vw", "-180vw"] : ["0vw", "0vw", "-200vw"],
      },
      opacity: {
        times: [0, 0.34, 0.42],
        values: [1, 1, 0],
      },
    },
    {
      id: "hundred-pearls",
      src: hundredPearls,
      alt: "100 Pearls apartment building",
      z: 20,
      className:
        "absolute bottom-0 left-0 h-[78vh] w-full max-w-none object-cover object-bottom sm:h-[82vh] md:h-[92vh]",
      restClassName:
        "absolute bottom-0 left-0 h-[70vh] w-full object-cover object-bottom md:h-[85vh]",
      x: {
        times: [0, 0.68, 0.78, 1],
        values: ["100vw", "100vw", "0vw", "0vw"],
      },
      opacity: {
        times: [0, 0.68, 0.76, 1],
        values: [0, 0, 1, 1],
      },
    },
    {
      id: "car",
      src: car,
      alt: "Vintage car with the couple driving through the countryside",
      z: 30,
      className:
        "absolute bottom-[1.5%] left-0 h-auto w-[88vw] max-w-[26rem] origin-[50%_40%] object-contain sm:w-[70vw] md:bottom-0 md:h-[62vh] md:w-auto md:max-w-none lg:h-[70vh]",
      restClassName:
        "absolute bottom-[2%] left-[8%] h-auto w-[78vw] object-contain md:bottom-0 md:h-[56vh] md:w-auto",
      x: {
        times: [0, 0.1, 0.24, 0.34, 0.42, 0.68, 0.78, 0.88, 1],
        values: isDesktop
          ? ["-72vw", "-72vw", gate1, gate1, "24vw", road, gate2, gate2, gate2]
          : ["-90vw", "-85vw", gate1, gate1, "18vw", road, gate2, gate2, gate2],
      },
      y: {
        times: [
          0, 0.1, 0.16, 0.22, 0.28, 0.34, 0.4, 0.46, 0.5, 0.54, 0.58, 0.62, 0.66, 0.68, 0.74, 0.78, 0.88, 0.94, 1,
        ],
        values: [
          "0vh",
          "0vh",
          `-${bounce}vh`,
          `${bounce * 0.7}vh`,
          `-${bounce * 0.8}vh`,
          `${idle}vh`,
          `-${idle}vh`,
          `${bounce * 0.5}vh`,
          `-${bounce}vh`,
          `${bounce * 0.8}vh`,
          `-${bounce * 0.7}vh`,
          `${bounce * 0.6}vh`,
          `-${bounce * 0.5}vh`,
          `${idle}vh`,
          `-${idle}vh`,
          "0vh",
          "0vh",
          isDesktop ? "28vh" : "24vh",
          isDesktop ? "48vh" : "42vh",
        ],
      },
      rotate: {
        times: [0, 0.1, 0.18, 0.28, 0.34, 0.46, 0.54, 0.62, 0.68, 0.78, 0.88, 1],
        values: [0, 0, 0.4, -0.35, 0.15, 0.2, 0.5, -0.4, 0.45, 0, 0, 0],
      },
      scale: {
        times: [0, 0.88, 0.94, 0.98, 1],
        values: isDesktop ? [1, 1, 2.15, 2.9, 3.3] : [1, 1, 1.9, 2.6, 3],
      },
      opacity: {
        times: [0, 0.92, 0.97, 1],
        values: [1, 1, 0.45, 0],
      },
    },
  ];
}
