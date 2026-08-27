import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Petal = { id: number; x: number; delay: number; dur: number; size: number; hue: string };

let seed = 0;

export default function SurpriseLayer() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const burst: Petal[] = Array.from({ length: 8 }, () => ({
        id: seed++,
        x: e.clientX + (Math.random() - 0.5) * 160,
        delay: Math.random() * 0.3,
        dur: 2.4 + Math.random() * 1.6,
        size: 8 + Math.random() * 12,
        hue: Math.random() > 0.5 ? "var(--blush)" : "var(--gold)",
      }));
      setPetals((p) => [...p.slice(-40), ...burst]);
      setHint(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
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
        {hint && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="tracking-luxe absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.55rem] uppercase text-muted-foreground sm:text-[0.65rem]"
          >
            Click anywhere for petals
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
