import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type Petal = {
  id: number;
  x: number;
  delay: number;
  dur: number;
  size: number;
  hue: string;
};

type Firework = {
  id: number;
  x: number;
  y: number;
};

let seed = 0;

const FIREWORK_SIZE = 280;
const FIREWORK_SRC = `${import.meta.env.BASE_URL}animations/fireworks.lottie`;

function FireworkBurst({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) {
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    onCompleteRef.current();
  };

  useEffect(() => {
    const fallback = window.setTimeout(finish, 2400);
    return () => window.clearTimeout(fallback);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: x - FIREWORK_SIZE / 2,
        top: y - FIREWORK_SIZE / 2,
        width: FIREWORK_SIZE,
        height: FIREWORK_SIZE,
      }}
    >
      <DotLottieReact
        src={FIREWORK_SRC}
        autoplay
        loop={false}
        dotLottieRefCallback={(dotLottie) => {
          if (!dotLottie) return;
          dotLottie.addEventListener("complete", finish);
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
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
      return {
        id: seed++,
        x: near ? originX + (Math.random() - 0.5) * 100 : pt.x,
        y: near ? Math.max(40, originY - 30 - Math.random() * 100) : pt.y,
      };
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

      {fireworks.map((fw) => (
        <FireworkBurst
          key={fw.id}
          x={fw.x}
          y={fw.y}
          onComplete={() => setFireworks((list) => list.filter((q) => q.id !== fw.id))}
        />
      ))}

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
