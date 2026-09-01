import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Petal = {
  id: number;
  x: number;
  delay: number;
  dur: number;
  size: number;
  hue: string;
};

type Spark = {
  id: number;
  angle: number;
  dist: number;
  size: number;
  color: string;
  delay: number;
};

type Firework = {
  id: number;
  x: number;
  y: number;
  sparks: Spark[];
};

let seed = 0;

const SPARK_COLORS = ["#e77b49", "#b34a44", "#ffffff", "#95271d", "#ff9a6a"];

function makeFirework(x: number, y: number): Firework {
  const count = 10 + Math.floor(Math.random() * 8);
  return {
    id: seed++,
    x,
    y,
    sparks: Array.from({ length: count }, (_, i) => ({
      id: seed++,
      angle: (i / count) * Math.PI * 2 + Math.random() * 0.35,
      dist: 40 + Math.random() * 70,
      size: 2 + Math.random() * 3.5,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]!,
      delay: Math.random() * 0.12,
    })),
  };
}

function randomPoint() {
  return {
    x: 40 + Math.random() * (window.innerWidth - 80),
    y: 60 + Math.random() * (window.innerHeight * 0.7),
  };
}

export default function SurpriseLayer() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [hint, setHint] = useState(true);
  const hoverCooldown = useRef(0);

  const spawnCelebration = (originX: number, originY: number, intensity: "soft" | "full") => {
    const petalCount = intensity === "full" ? 8 : 4;
    const burst: Petal[] = Array.from({ length: petalCount }, () => ({
      id: seed++,
      x: originX + (Math.random() - 0.5) * 160,
      delay: Math.random() * 0.3,
      dur: 2.4 + Math.random() * 1.6,
      size: 8 + Math.random() * 12,
      hue: Math.random() > 0.5 ? "var(--blush)" : "var(--gold)",
    }));
    setPetals((p) => [...p.slice(-40), ...burst]);

    const fwCount = intensity === "full" ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2);
    const next: Firework[] = Array.from({ length: fwCount }, (_, i) => {
      const pt = randomPoint();
      const near = i === 0;
      return makeFirework(
        near ? originX + (Math.random() - 0.5) * 100 : pt.x,
        near ? Math.max(40, originY - 30 - Math.random() * 100) : pt.y,
      );
    });
    setFireworks((f) => [...f.slice(-6), ...next]);
    setHint(false);
  };

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      spawnCelebration(e.clientX, e.clientY, "full");
    };

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - hoverCooldown.current < 1400) return;
      hoverCooldown.current = now;
      spawnCelebration(e.clientX, e.clientY, "soft");
    };

    window.addEventListener("click", onClick);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {petals.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.9, y: -40, x: p.x, rotate: 0 }}
            animate={{ opacity: 0, y: window.innerHeight + 60, rotate: 420 }}
            transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
            onAnimationComplete={() => setPetals((list) => list.filter((q) => q.id !== p.id))}
            className="absolute left-0 top-0 rounded-[60%_40%_55%_45%]"
            style={{ width: p.size, height: p.size * 0.7, background: p.hue }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {fireworks.map((fw) => (
          <motion.div
            key={fw.id}
            className="absolute left-0 top-0"
            style={{ x: fw.x, y: fw.y }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            onAnimationComplete={() => setFireworks((list) => list.filter((q) => q.id !== fw.id))}
          >
            <motion.span
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-pearl"
              initial={{ width: 4, height: 4, opacity: 1 }}
              animate={{ width: 28, height: 28, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              style={{ boxShadow: "0 0 24px 6px color-mix(in srgb, var(--peach) 70%, transparent)" }}
            />
            {fw.sparks.map((s) => (
              <motion.span
                key={s.id}
                className="absolute rounded-full"
                style={{
                  width: s.size,
                  height: s.size,
                  background: s.color,
                  boxShadow: `0 0 8px 1px ${s.color}`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(s.angle) * s.dist,
                  y: Math.sin(s.angle) * s.dist,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 0.85, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {hint && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="tracking-luxe absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[0.55rem] uppercase text-muted-foreground sm:text-[0.65rem] md:block"
          >
            Hover or click for petals &amp; fireworks
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
