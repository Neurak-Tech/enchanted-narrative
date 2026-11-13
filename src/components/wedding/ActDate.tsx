import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScratchToReveal } from "@/components/ui/scratch-to-reveal";
import { COUPLE } from "./data";
import { ActSection } from "./ActSection";
import { cn } from "@/lib/utils";

const WEDDING_AT = new Date(
  Number(COUPLE.date.year),
  10,
  Number(COUPLE.date.day),
  0,
  0,
  0,
  0,
);

type CountdownParts = { days: number; hours: number; minutes: number };

function getCountdown(target: Date): CountdownParts {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
  };
}

function useCountdown(target: Date, active: boolean) {
  const [parts, setParts] = useState<CountdownParts>(() => getCountdown(target));

  useEffect(() => {
    if (!active) return;
    const tick = () => setParts(getCountdown(target));
    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, [target, active]);

  return parts;
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[4.25rem] flex-col items-center sm:min-w-[5rem]">
      <span className="font-sans text-[clamp(2rem,9vw,3.25rem)] font-medium leading-none tabular-nums text-ink">
        {value}
      </span>
      <span className="mt-1.5 text-[0.58rem] uppercase tracking-[0.32em] text-muted-foreground sm:text-[0.62rem]">
        {label}
      </span>
    </div>
  );
}

function CountdownDisplay({ parts }: { parts: CountdownParts }) {
  return (
    <h2
      className="flex items-start justify-center gap-3 sm:gap-6"
      aria-live="polite"
      aria-label={`Countdown to ${COUPLE.date.day} ${COUPLE.date.month} ${COUPLE.date.year}`}
    >
      <CountUnit value={parts.days} label="Days" />
      <span
        aria-hidden
        className="mt-2 font-sans text-2xl font-light leading-none text-gold-deep/80 sm:mt-3 sm:text-3xl"
      >
        :
      </span>
      <CountUnit value={parts.hours} label="Hours" />
      <span
        aria-hidden
        className="mt-2 font-sans text-2xl font-light leading-none text-gold-deep/80 sm:mt-3 sm:text-3xl"
      >
        :
      </span>
      <CountUnit value={parts.minutes} label="Minutes" />
    </h2>
  );
}

const FOIL = {
  coverFrom: "#a67c2d",
  coverMid: "#fff1b8",
  coverTo: "#e0b03a",
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
  onDone,
}: {
  label: string;
  value: string;
  size: number;
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
        className="rounded-full border-[#f0d078] bg-[#95271d]"
      >
        <motion.span
          initial={{ scale: 0.86, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="px-1 text-center font-display text-[1.55rem] leading-none text-foil [text-shadow:0_1px_8px_rgba(0,0,0,0.35)] sm:text-[1.85rem]"
        >
          {value}
        </motion.span>
      </ScratchToReveal>
    </div>
  );
}

const CONFETTI_COLORS = ["#f6d98a", "#fffaf2", "#e0b03a", "#fff1b8", "#ffffff"];

/** canvas-confetti: free physics-based burst. No sound. */
function burstConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    const shared = {
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      zIndex: 80,
      ticks: 280,
      gravity: 1,
      decay: 0.92,
      scalar: 1,
    };
    void confetti({
      ...shared,
      particleCount: 110,
      spread: 78,
      startVelocity: 46,
      origin: { y: 0.55 },
    });
    void confetti({
      ...shared,
      particleCount: 48,
      angle: 60,
      spread: 58,
      origin: { x: 0, y: 0.68 },
    });
    void confetti({
      ...shared,
      particleCount: 48,
      angle: 120,
      spread: 58,
      origin: { x: 1, y: 0.68 },
    });
  });
}

export default function ActDate() {
  const size = useCircleSize();
  const [done, setDone] = useState<{ day?: boolean; month?: boolean; year?: boolean }>({});
  const all = !!(done.day && done.month && done.year);
  const countdown = useCountdown(WEDDING_AT, all);

  const mark = (key: "day" | "month" | "year") => {
    setDone((d) => {
      const next = { ...d, [key]: true };
      const finished = !!(next.day && next.month && next.year);
      const already = !!(d.day && d.month && d.year);
      if (finished && !already) queueMicrotask(burstConfetti);
      return next;
    });
  };

  return (
    <ActSection
      id="act-2"
      tone="light"
      className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6"
    >
      {!all && (
        <h2 className="max-w-xl text-center font-display text-[clamp(1.85rem,5vw,3.6rem)] leading-tight">
          Scratch to reveal
        </h2>
      )}

      <div
        className={cn(
          "flex flex-nowrap items-start justify-center gap-4 sm:gap-8",
          all ? "mt-0" : "mt-6 sm:mt-8",
        )}
      >
        <DateScratch
          label="Day"
          value={COUPLE.date.day}
          size={size}
          onDone={() => mark("day")}
        />
        <DateScratch
          label="Month"
          value={COUPLE.date.month}
          size={size}
          onDone={() => mark("month")}
        />
        <DateScratch
          label="Year"
          value={COUPLE.date.year}
          size={size}
          onDone={() => mark("year")}
        />
      </div>

      <AnimatePresence>
        {all && (
          <motion.div
            initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-center sm:mt-8"
          >
            <h3 className="font-display text-[clamp(1.75rem,6vw,5rem)] italic leading-none text-foil">
              The Day Our Forever Begins
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-6 max-w-xl sm:mt-8"
            >
              <CountdownDisplay parts={countdown} />
            </motion.div>
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
        <p className="mt-6 animate-pulse text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground sm:mt-8 sm:text-xs">
          drag across each circle
        </p>
      )}

    </ActSection>
  );
}
