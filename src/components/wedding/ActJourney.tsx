import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { MILESTONES } from "./data";

function CoffeeWorld() {
  return (
    <div className="relative h-64 w-64">
      {[0, 1].map((i) => (
        <div key={i} className="absolute bottom-10" style={{ left: i ? 118 : 30 }}>
          <div className="relative h-16 w-14 rounded-b-[2rem] rounded-t-md bg-pearl shadow-[var(--shadow-soft)] ring-1 ring-gold/50">
            <div className="absolute -right-4 top-3 h-7 w-7 rounded-full ring-2 ring-gold/60" />
            <div className="absolute inset-x-2 top-2 h-2 rounded-full bg-gold-deep/50" />
          </div>
          <div className="h-2 w-16 -translate-x-1 rounded-full bg-beige" />
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className="absolute bottom-16 left-6 text-rose"
              style={{ animation: `steam-rise 3.4s ${s * 1 + i * 0.5}s ease-out infinite` }}
            >
              ♥
            </span>
          ))}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gold/50" />
    </div>
  );
}

function CityWorld() {
  return (
    <div className="relative h-64 w-72 overflow-hidden">
      <div className="absolute bottom-8 left-0 right-0 flex items-end gap-2">
        {[70, 120, 48, 150, 92, 62, 130].map((h, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: h }}
            className="relative w-9 rounded-t-md bg-[linear-gradient(180deg,oklch(0.93_0.03_80),oklch(0.86_0.04_70))] ring-1 ring-gold/40"
          >
            {Array.from({ length: Math.floor(h / 22) }).map((_, w) => (
              <span
                key={w}
                className="animate-sparkle absolute left-2 h-2 w-2 rounded-[2px] bg-gold"
                style={{ top: 8 + w * 20, animationDelay: `${(i + w) * 0.4}s` }}
              />
            ))}
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ x: [-40, 300] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-6 h-3 w-16 rounded-md bg-rose/80"
      />
      <div className="absolute inset-x-0 bottom-6 h-[2px] bg-gold/60" />
    </div>
  );
}

function ProposalWorld() {
  return (
    <div className="relative grid h-64 w-64 place-items-center">
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <motion.span
          key={a}
          animate={{ rotate: [a, a + 8, a], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 0.2 }}
          className="absolute h-24 w-12 rounded-[100%] bg-blush/80"
          style={{ transformOrigin: "50% 100%", translate: "0 -48px", rotate: `${a}deg` }}
        />
      ))}
      <motion.div
        animate={{ y: [8, -18, 8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="h-14 w-14 rounded-full border-4 border-[oklch(0.82_0.11_85)] shadow-[var(--shadow-glow)]" />
        <div className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-pearl shadow-[0_0_18px_var(--gold)]" />
      </motion.div>
    </div>
  );
}

function PolaroidWorld() {
  return (
    <div className="relative h-64 w-72">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], rotate: [-8 + i * 5, -4 + i * 5, -8 + i * 5] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: i * 52, top: (i % 2) * 60 }}
          className="absolute w-32 rounded-sm bg-pearl p-2 pb-7 shadow-[var(--shadow-soft)]"
        >
          <div
            className="h-24 w-full rounded-[2px]"
            style={{
              background:
                i % 2
                  ? "linear-gradient(140deg, oklch(0.9 0.05 25), oklch(0.85 0.06 80))"
                  : "linear-gradient(140deg, oklch(0.88 0.04 80), oklch(0.82 0.05 140))",
            }}
          />
          <span className="absolute bottom-1 left-3 font-script text-xs text-muted-foreground">
            us, again
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const WORLDS: Record<string, () => React.ReactElement> = {
  meeting: CoffeeWorld,
  travel: CityWorld,
  proposal: ProposalWorld,
  family: PolaroidWorld,
};

export default function ActJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });
  const x = useTransform(p, [0, 1], ["2%", "-76%"]);
  const dash = useTransform(p, [0, 1], [2400, 0]);
  const birdX = useTransform(p, [0.82, 1], ["-10vw", "70vw"]);
  const birdY = useTransform(p, [0.82, 1], ["10vh", "-20vh"]);
  const birdOpacity = useTransform(p, [0.8, 0.9, 1], [0, 1, 1]);
  const ribbonOpacity = useTransform(p, [0.8, 0.95], [1, 0]);

  return (
    <section ref={ref} className="relative h-[420vh]" id="act-3">
      <div className="sticky top-0 h-screen overflow-hidden bg-[linear-gradient(160deg,oklch(0.97_0.015_80),oklch(0.93_0.03_45))]">
        <div className="absolute left-1/2 top-12 z-20 -translate-x-1/2 text-center">
          <p className="text-[0.7rem] uppercase tracking-luxe text-muted-foreground">
            Act Three — Our Journey
          </p>
        </div>

        <motion.svg
          style={{ opacity: ribbonOpacity }}
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbon" x1="0" x2="1">
              <stop offset="0%" stopColor="oklch(0.9 0.05 25)" />
              <stop offset="50%" stopColor="oklch(0.82 0.11 85)" />
              <stop offset="100%" stopColor="oklch(0.88 0.05 40)" />
            </linearGradient>
          </defs>
          <motion.path
            d="M-50 520 C 200 300, 320 720, 560 470 S 900 260, 1250 520"
            fill="none"
            stroke="url(#ribbon)"
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray="2400"
            style={{ strokeDashoffset: dash }}
            opacity="0.55"
          />
          <motion.path
            d="M-50 540 C 220 340, 340 740, 580 500 S 920 300, 1250 560"
            fill="none"
            stroke="url(#ribbon)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="2400"
            style={{ strokeDashoffset: dash }}
          />
        </motion.svg>

        <motion.div style={{ x }} className="relative flex h-full w-[380vw] items-center gap-[8vw] px-[10vw]">
          {MILESTONES.map((m, i) => {
            const World = WORLDS[m.key]!;
            return (
              <div
                key={m.key}
                className="flex w-[70vw] shrink-0 items-center gap-10 md:w-[62vw]"
                style={{ marginTop: i % 2 ? "12vh" : "-10vh" }}
              >
                <World />
                <div className="max-w-sm">
                  <span className="font-script text-sm tracking-[0.4em] text-gold-deep">{m.year}</span>
                  <h3 className="mt-2 font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight">
                    {m.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.memory}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          style={{ x: birdX, y: birdY, opacity: birdOpacity }}
          className="pointer-events-none absolute left-0 top-1/2 z-30"
        >
          <svg width="150" height="90" viewBox="0 0 150 90">
            <motion.path
              animate={{ d: ["M20 45 C50 5, 90 5, 130 40", "M20 45 C50 70, 90 70, 130 40"] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
              fill="none"
              stroke="oklch(0.45 0.03 60)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="58" y="42" width="40" height="26" rx="3" fill="oklch(0.98 0.01 90)" stroke="oklch(0.82 0.11 85)" />
            <path d="M58 42l20 15 20-15" fill="none" stroke="oklch(0.82 0.11 85)" strokeWidth="1.5" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
