import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { COUPLE, VENUES } from "./data";

function Lanterns() {
  const lanterns = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        delay: (i % 7) * 1.6,
        dur: 16 + (i % 5) * 3,
        size: 6 + (i % 4) * 3,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {lanterns.map((l) => (
        <span
          key={l.id}
          className="absolute bottom-0 rounded-full bg-gold/80 blur-[1px]"
          style={{
            left: `${l.left}%`,
            width: l.size,
            height: l.size * 1.4,
            boxShadow: "0 0 26px 6px color-mix(in oklab, var(--gold) 55%, transparent)",
            animation: `lantern-up ${l.dur}s linear ${l.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ActFinale() {
  const ref = useRef<HTMLElement>(null);
  const [star, setStar] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const glow = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], [60, 0]);

  const active = VENUES.find((v) => v.id === star) ?? null;

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-[var(--gradient-night)] px-4 py-28 sm:py-36"
    >
      <Lanterns />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="tracking-luxe text-[0.6rem] uppercase text-pearl/60 sm:text-xs">Act Six</p>
        <h2 className="font-display mt-3 text-4xl leading-tight text-foil sm:text-6xl">
          A Constellation of Places
        </h2>
        <p className="mt-4 text-sm text-pearl/70 sm:text-base">
          Touch a star to find where we&apos;ll be, how to get there, and where to rest.
        </p>
      </div>

      <motion.div
        style={{ y: lift }}
        className="relative mx-auto mt-14 aspect-[16/10] w-full max-w-4xl"
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 62" fill="none">
          {VENUES.slice(0, -1).map((v, i) => {
            const n = VENUES[i + 1]!;
            return (
              <motion.line
                key={v.id}
                x1={v.x}
                y1={(v.y * 62) / 100}
                x2={n.x}
                y2={(n.y * 62) / 100}
                stroke="color-mix(in oklab, var(--gold) 60%, transparent)"
                strokeWidth={0.18}
                strokeDasharray="1 1.4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, delay: 0.3 + i * 0.35 }}
              />
            );
          })}
        </svg>

        {VENUES.map((v, i) => (
          <button
            key={v.id}
            onClick={() => setStar((s) => (s === v.id ? null : v.id))}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${v.x}%`, top: `${v.y}%` }}
            aria-label={v.name}
          >
            <motion.span
              className="mx-auto block h-3 w-3 rounded-full bg-pearl shadow-[var(--shadow-glow)]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity }}
            />
            <span className="font-display mt-2 block whitespace-nowrap text-[0.7rem] text-pearl/80 sm:text-sm">
              {v.name}
            </span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-10 max-w-lg rounded-[1.5rem] border border-gold/40 bg-[color-mix(in_oklab,var(--night)_70%,transparent)] p-7 text-center backdrop-blur-xl"
          >
            <p className="tracking-luxe text-[0.6rem] uppercase text-gold">{active.role}</p>
            <h3 className="font-display mt-2 text-3xl text-pearl">{active.name}</h3>
            <p className="mt-3 text-sm italic text-pearl/70">{active.highlight}</p>
            <div className="mt-5 grid gap-3 text-left text-xs text-pearl/70 sm:grid-cols-2">
              <p>
                <span className="block text-gold">Getting there</span>
                {active.travel}
              </p>
              <p>
                <span className="block text-gold">Where to stay</span>
                {active.stay}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div style={{ opacity: glow }} className="relative mt-24 text-center">
        <p className="font-script text-5xl text-foil sm:text-7xl">{COUPLE.monogram}</p>
        <p className="tracking-luxe mt-6 text-[0.6rem] uppercase text-pearl/60 sm:text-xs">
          {COUPLE.date.day} {COUPLE.date.month} {COUPLE.date.year}
        </p>
        <p className="font-display mx-auto mt-8 max-w-md text-xl text-pearl/80 sm:text-2xl">
          &ldquo;Come for the vows. Stay for the dancing. Leave with a story.&rdquo;
        </p>
      </motion.div>
    </section>
  );
}
