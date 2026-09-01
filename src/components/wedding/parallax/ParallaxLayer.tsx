import { motion, useTransform, type MotionValue } from "motion/react";
import type { Keyframed, ParallaxLayerConfig } from "./types";

function useKeyed(progress: MotionValue<number>, keyed: Keyframed | undefined, fallback: Keyframed) {
  const times = keyed?.times ?? fallback.times;
  const values = keyed?.values ?? fallback.values;
  return useTransform(progress, times, values);
}

export function ParallaxLayer({
  layer,
  progress,
}: {
  layer: ParallaxLayerConfig;
  progress: MotionValue<number>;
}) {
  const x = useKeyed(progress, layer.x, { times: [0, 1], values: [0, 0] });
  const y = useKeyed(progress, layer.y, { times: [0, 1], values: [0, 0] });
  const scale = useKeyed(progress, layer.scale, { times: [0, 1], values: [1, 1] });
  const opacity = useKeyed(progress, layer.opacity, { times: [0, 1], values: [1, 1] });
  const rotate = useKeyed(progress, layer.rotate, { times: [0, 1], values: [0, 0] });

  return (
    <motion.img
      src={layer.src}
      alt={layer.alt}
      decoding={layer.fetchPriority === "high" ? "sync" : "async"}
      fetchPriority={layer.fetchPriority}
      draggable={false}
      style={{
        x: layer.x ? x : undefined,
        y: layer.y ? y : undefined,
        scale: layer.scale ? scale : undefined,
        opacity: layer.opacity ? opacity : 1,
        rotate: layer.rotate ? rotate : undefined,
        zIndex: layer.z,
      }}
      className={`pointer-events-none will-change-transform select-none ${layer.className}`}
    />
  );
}

export function ParallaxLayerStill({ layer }: { layer: ParallaxLayerConfig }) {
  return (
    <img
      src={layer.src}
      alt={layer.alt}
      decoding={layer.fetchPriority === "high" ? "sync" : "async"}
      fetchPriority={layer.fetchPriority}
      draggable={false}
      className={`pointer-events-none select-none ${layer.restClassName}`}
      style={{ zIndex: layer.z }}
    />
  );
}
