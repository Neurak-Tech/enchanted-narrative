import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import worldImg from "@/assets/wedding-world.png";
import { EVENTS } from "./data";

export default function ActWorld() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.04, 0.94]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const y = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  const current = EVENTS.find((e) => e.id === active) ?? null;

  return (
    <section
      ref={ref}
      style={{ background: "var(--gradient-dawn)" }}
      className="relative overflow-hidden px-4 py-28 sm:py-36"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="tracking-luxe text-[0.6rem] uppercase text-muted-foreground sm:text-xs">
          Act Five
        </p>
        <h2 className="font-display mt-3 text-4xl leading-tight text-foil sm:text-6xl">
          The Wedding World
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Wander the grounds. Every glowing lantern hides a moment of the celebration.
        </p>
      </div>

      <motion.div
        style={{ scale, rotate, y }}
        className="relative mx-auto aspect-[4/3] w-full max-w-5xl"
      >
        <img
          src={worldImg}
          alt="Illustrated isometric map of the wedding venue grounds"
          className="h-full w-full rounded-[2rem] object-cover shadow-[var(--shadow-soft)]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gold/40" />

        {EVENTS.map((e, i) => (
          <button
            key={e.id}
            onClick={() => setActive((a) => (a === e.id ? null : e.id))}
            aria-label={e.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${e.x}%`, top: `${e.y}%` }}
          >
            <span className="relative flex h-6 w-6 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full bg-gold/50"
                animate={{ scale: [1, 2.1, 1], opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.28 }}
              />
              <span className="relative h-2.5 w-2.5 rounded-full bg-foil shadow-[var(--shadow-glow)]" />
            </span>
            <span className="font-display mt-1 block whitespace-nowrap text-[0.65rem] tracking-wide text-ink/80 sm:text-xs">
              {e.name}
            </span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel mx-auto mt-10 max-w-xl rounded-[1.5rem] p-6 text-center sm:p-8"
          >
            <p className="tracking-luxe text-[0.6rem] uppercase text-muted-foreground">
              {current.time}
            </p>
            <h3 className="font-display mt-2 text-3xl text-ink sm:text-4xl">{current.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{current.desc}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-[0.7rem]">
              <span className="rounded-full border border-gold/50 px-3 py-1 text-ink/80">
                {current.dress}
              </span>
              <span className="rounded-full bg-accent/60 px-3 py-1 text-accent-foreground">
                {current.note}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
