import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import { COUPLE } from "./data";
import { Bloom, HoverFloat, Petal, WaxSealBird } from "./Motifs";

const FOIL = {
  coverFrom: "#95271d",
  coverMid: "#e77b49",
  coverTo: "#60241e",
} as const;

/** Mobile-first circle size; bumps up a touch on wider screens. */
function useCircleSize() {
  const [size, setSize] = useState(92);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setSize(mq.matches ? 108 : 92);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return size;
}

function DateScratch({
  label,
  value,
  size,
  compact,
  onDone,
}: {
  label: string;
  value: string;
  size: number;
  compact?: boolean;
  onDone: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 sm:gap-3">
      <span className="text-[0.58rem] uppercase tracking-luxe text-muted-foreground sm:text-[0.62rem]">
        {label}
      </span>
      <ScratchToReveal
        width={size}
        height={size}
        brushSize={16}
        threshold={0.32}
        label="···"
        coverFrom={FOIL.coverFrom}
        coverMid={FOIL.coverMid}
        coverTo={FOIL.coverTo}
        onComplete={onDone}
        className="rounded-full border-black/55"
      >
        <motion.span
          initial={{ scale: 0.86, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`px-1 text-center font-display leading-none text-foil [text-shadow:0_1px_0_#ffffff,0_-1px_1px_#60241e] ${
            compact
              ? "text-[0.62rem] tracking-[0.08em] sm:text-[0.72rem]"
              : "text-[1.55rem] sm:text-[1.85rem]"
          }`}
        >
          {value}
        </motion.span>
      </ScratchToReveal>
    </div>
  );
}

function FlowerFall() {
  const pieces = Array.from({ length: 48 }, (_, i) => {
    const kind = i % 3;
    const left = `${(i * 17.3) % 100}%`;
    const delay = (i % 12) * 0.12 + Math.random() * 0.35;
    const dur = 3.2 + (i % 7) * 0.28;
    const rot = 180 + (i % 5) * 90;
    return { id: i, kind, left, delay, dur, rot };
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: -48, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0.85, 0],
            y: ["-6vh", "108vh"],
            x: [0, (p.id % 2 === 0 ? 1 : -1) * (18 + (p.id % 5) * 10)],
            rotate: p.rot,
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
          className="absolute top-0"
          style={{ left: p.left }}
        >
          {p.kind === 0 ? (
            <Petal fill="#e77b49" className="h-5 w-4 sm:h-6 sm:w-5" />
          ) : p.kind === 1 ? (
            <Bloom tone={p.id % 2 === 0 ? "gold" : "rose"} className="h-6 w-6 sm:h-7 sm:w-7" />
          ) : (
            <Petal fill="#b34a44" className="h-4 w-3 sm:h-5 sm:w-4" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function ActDate() {
  const size = useCircleSize();
  const [done, setDone] = useState<{ day?: boolean; month?: boolean; year?: boolean }>({});
  const all = !!(done.day && done.month && done.year);
  const [flowers, setFlowers] = useState(false);

  useEffect(() => {
    if (!all) return;
    setFlowers(true);
    const t = setTimeout(() => setFlowers(false), 5200);
    return () => clearTimeout(t);
  }, [all]);

  return (
    <section
      id="act-2"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#b34a44_0%,#ffffff_45%,#e77b49_100%)] px-5 py-24 sm:px-6 sm:py-28"
    >
      <HoverFloat className="left-3 top-14 text-ink sm:left-10 sm:top-24">
        <WaxSealBird />
      </HoverFloat>

      <p className="text-[0.7rem] uppercase tracking-luxe text-muted-foreground">
            Act Two — Unlock the Date
      </p>
      <h2 className="mt-5 max-w-xl text-center font-display text-[clamp(1.85rem,5vw,3.6rem)] leading-tight sm:mt-6">
        Scratch the foil. <span className="italic text-foil">Find the day.</span>
      </h2>

      <div className="mt-12 flex flex-nowrap items-start justify-center gap-4 sm:mt-16 sm:gap-8">
        <DateScratch
          label="Day"
          value={COUPLE.date.day}
          size={size}
          onDone={() => setDone((d) => ({ ...d, day: true }))}
        />
        <DateScratch
          label="Month"
          value={COUPLE.date.month}
          size={size}
          compact
          onDone={() => setDone((d) => ({ ...d, month: true }))}
        />
        <DateScratch
          label="Year"
          value={COUPLE.date.year}
          size={size}
          onDone={() => setDone((d) => ({ ...d, year: true }))}
        />
      </div>

      <AnimatePresence>
        {all && (
          <motion.div
            initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-14 text-center sm:mt-20"
          >
            <h3 className="font-display text-[clamp(1.75rem,6vw,5rem)] italic leading-none text-foil">
              The Day Our Forever Begins
            </h3>
            <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.4, 0.9, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
                  className="h-7 w-[3px] rounded-full bg-gold-deep/70 sm:h-8"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!all && (
        <p className="mt-12 animate-pulse text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground sm:mt-14 sm:text-xs">
          drag across each circle
        </p>
      )}

      {flowers && <FlowerFall />}
    </section>
  );
}
