import { type ReactNode, useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { ParallaxLayer, ParallaxLayerStill } from "./ParallaxLayer";
import type { ParallaxLayerConfig, SceneMotion } from "./types";

export function ParallaxPinned({
  id,
  layers,
  children,
  heightClass = "h-[300vh]",
  className,
  scene,
}: {
  id?: string;
  layers: ParallaxLayerConfig[];
  children?: ReactNode | ((progress: MotionValue<number>) => ReactNode);
  heightClass?: string;
  className?: string;
  scene?: SceneMotion;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 38,
    damping: 34,
    mass: 0.85,
  });

  const sceneScale = useTransform(
    progress,
    scene?.scale.times ?? [0, 1],
    scene?.scale.values ?? [1, 1],
  );
  const sceneX = useTransform(progress, scene?.x?.times ?? [0, 1], scene?.x?.values ?? [0, 0]);
  const sceneY = useTransform(progress, scene?.y?.times ?? [0, 1], scene?.y?.values ?? [0, 0]);

  const overlay = typeof children === "function" ? children(progress) : children;

  if (reduce) {
    return (
      <section id={id} className={cn("relative h-dvh overflow-hidden bg-[#cfe6c4]", className)}>
        {layers.map((layer) => (
          <ParallaxLayerStill key={layer.id} layer={layer} />
        ))}
        {typeof children === "function" ? children(progress) : children}
      </section>
    );
  }

  return (
    <section ref={ref} id={id} className={cn("relative", heightClass, className)}>
      <div className="sticky top-0 h-dvh overflow-hidden bg-[#cfe6c4]">
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            transformOrigin: scene?.origin ?? "50% 70%",
            scale: scene ? sceneScale : 1,
            x: scene?.x ? sceneX : 0,
            y: scene?.y ? sceneY : 0,
          }}
        >
          {layers.map((layer) => (
            <ParallaxLayer key={layer.id} layer={layer} progress={progress} />
          ))}
        </motion.div>
        {overlay}
      </div>
    </section>
  );
}
