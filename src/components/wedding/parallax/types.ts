import type { MotionValue } from "motion/react";

export type Keyframed = {
  times: number[];
  values: Array<string | number>;
};

export type ParallaxLayerConfig = {
  id: string;
  src: string;
  alt: string;
  z: number;
  className: string;
  restClassName: string;
  fetchPriority?: "high" | "low" | "auto";
  x?: Keyframed;
  y?: Keyframed;
  scale?: Keyframed;
  opacity?: Keyframed;
  rotate?: Keyframed;
};

export type SceneMotion = {
  origin: string;
  scale: Keyframed;
  x?: Keyframed;
  y?: Keyframed;
};

export type ParallaxProgress = MotionValue<number>;
