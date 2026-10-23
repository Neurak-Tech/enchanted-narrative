import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { PulsingHeart } from "./Motifs";
import { MILESTONES } from "./data";
import { cn } from "@/lib/utils";
import { ActSection } from "./ActSection";

function CoffeeWorld() {
  return (
    <div className="relative mx-auto h-44 w-52 sm:h-56 sm:w-60 md:h-64 md:w-64">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute bottom-8 sm:bottom-10"
          style={{ left: i ? "52%" : "12%" }}
        >
          <div className="relative h-14 w-12 rounded-b-[2rem] rounded-t-md bg-[#95271d] ring-2 ring-[#fffaf2] sm:h-16 sm:w-14">
            <div className="absolute -right-4 top-3 h-7 w-7 rounded-full ring-2 ring-[#fffaf2]" />
            <div className="absolute inset-x-2 top-2 h-2 rounded-full bg-[#f6d98a]/80" />
          </div>
          <div className="h-2 w-14 -translate-x-1 rounded-full bg-[#fffaf2] sm:w-16" />
          {[0, 1, 2].map((s) => (
            <span
              key={s}
              className="absolute bottom-14 left-5 text-rose sm:bottom-16 sm:left-6"
              style={{ animation: `steam-rise 3.4s ${s * 1 + i * 0.5}s ease-out infinite` }}
            >
              ♥
            </span>
          ))}
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#fffaf2]" />
    </div>
  );
}

function CityWorld() {
  const heights = [56, 96, 40, 120, 72, 48, 104];
  return (
    <div className="relative mx-auto h-44 w-full max-w-[16rem] overflow-hidden sm:h-56 sm:max-w-[18rem] md:h-64 md:max-w-[18rem]">
      <div className="absolute bottom-6 left-0 right-0 flex items-end justify-center gap-1.5 sm:bottom-8 sm:gap-2">
        {heights.map((h, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ height: h }}
            className="relative w-6 rounded-t-md bg-[#95271d] ring-2 ring-[#f6d98a] sm:w-8 md:w-9"
          >
            {Array.from({ length: Math.floor(h / 22) }).map((_, w) => (
              <span
                key={w}
                className="animate-sparkle absolute left-1.5 h-1.5 w-1.5 rounded-[2px] bg-gold sm:left-2 sm:h-2 sm:w-2"
                style={{ top: 8 + w * 18, animationDelay: `${(i + w) * 0.4}s` }}
              />
            ))}
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ x: ["-10%", "110%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-4 h-2.5 w-12 rounded-md bg-rose/80 sm:bottom-6 sm:h-3 sm:w-16"
      />
      <div className="absolute inset-x-0 bottom-4 h-[2px] bg-[#fffaf2] sm:bottom-6" />
    </div>
  );
}

function ProposalWorld() {
  return (
    <div className="relative mx-auto grid h-44 w-44 place-items-center sm:h-56 sm:w-56 md:h-64 md:w-64">
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <motion.span
          key={a}
          animate={{ rotate: [a, a + 8, a], scale: [1, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 0.2 }}
          className="absolute h-20 w-10 rounded-[100%] bg-[#f6d98a]/80 sm:h-24 sm:w-12"
          style={{ transformOrigin: "50% 100%", translate: "0 -40px", rotate: `${a}deg` }}
        />
      ))}
      <motion.div
        animate={{ y: [8, -18, 8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <div className="h-12 w-12 rounded-full border-4 border-[#fffaf2] shadow-[var(--shadow-glow)] sm:h-14 sm:w-14" />
        <div className="absolute -top-3 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-[#f6d98a] shadow-[0_0_18px_var(--gold)] ring-1 ring-[#fffaf2] sm:h-4 sm:w-4" />
      </motion.div>
    </div>
  );
}

function PolaroidWorld() {
  return (
    <div className="relative mx-auto h-44 w-56 sm:h-56 sm:w-64 md:h-64 md:w-72">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -12, 0], rotate: [-8 + i * 5, -4 + i * 5, -8 + i * 5] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
          style={{ left: `${i * 18}%`, top: (i % 2) * 44 }}
          className="absolute w-24 rounded-sm bg-[#95271d] p-1.5 pb-5 ring-1 ring-[#fffaf2] sm:w-28 sm:p-2 sm:pb-7 md:w-32"
        >
          <div
            className="h-20 w-full rounded-[2px] sm:h-24"
            style={{
              background:
                  i % 2
                  ? "linear-gradient(140deg, #ffe7a8, #f6d98a)"
                  : "linear-gradient(140deg, #fffaf2, #f6d98a)",
            }}
          />
          <span className="absolute bottom-1 left-2 font-script text-[0.65rem] text-muted-foreground sm:left-3 sm:text-xs">
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

/** Portrait ribbon — keeps curve proportions on narrow screens */
const RIBBON_MOBILE =
  "M-30 520 C 70 360, 110 640, 200 480 S 300 320, 420 540";
const RIBBON_MOBILE_INNER =
  "M-30 540 C 80 390, 120 660, 210 510 S 310 350, 420 560";

/** Landscape ribbon for tablet/desktop */
const RIBBON_DESKTOP =
  "M-50 520 C 200 300, 320 720, 560 470 S 900 260, 1250 520";
const RIBBON_DESKTOP_INNER =
  "M-50 540 C 220 340, 340 740, 580 500 S 920 300, 1250 560";

export default function ActJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Content tracks scroll with a light spring; ribbon is heavier so the draw feels deliberate
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });
  const ribbon = useSpring(scrollYProgress, { stiffness: 28, damping: 32, mass: 1.4 });
  const x = useTransform(p, [0, 1], ["4%", "-78%"]);
  // pathLength={1} → dash 1→0 spans the whole journey evenly (was 2400 on a ~665 mobile path)
  const dash = useTransform(ribbon, [0, 0.92], [1, 0]);
  const ribbonOpacity = useTransform(p, [0.8, 0.95], [1, 0]);

  return (
    <ActSection ref={ref} id="act-3" tone="warm-soft" className="h-[480vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-transparent">
        {/* Mobile ribbon: portrait viewBox + meet — no horizontal squash */}
        <motion.svg
          style={{ opacity: ribbonOpacity }}
          className="pointer-events-none absolute inset-0 h-full w-full md:hidden"
          viewBox="0 0 390 844"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="ribbon-m" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fffaf2" />
              <stop offset="50%" stopColor="#f6d98a" />
              <stop offset="100%" stopColor="#ffe7a8" />
            </linearGradient>
          </defs>
          <motion.path
            d={RIBBON_MOBILE}
            pathLength={1}
            fill="none"
            stroke="url(#ribbon-m)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="1"
            style={{ strokeDashoffset: dash }}
            opacity="0.5"
          />
          <motion.path
            d={RIBBON_MOBILE_INNER}
            pathLength={1}
            fill="none"
            stroke="url(#ribbon-m)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="1"
            style={{ strokeDashoffset: dash }}
          />
        </motion.svg>

        {/* Desktop ribbon: aspect-preserving slice */}
        <motion.svg
          style={{ opacity: ribbonOpacity }}
          className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="ribbon-d" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fffaf2" />
              <stop offset="50%" stopColor="#f6d98a" />
              <stop offset="100%" stopColor="#ffe7a8" />
            </linearGradient>
          </defs>
          <motion.path
            d={RIBBON_DESKTOP}
            pathLength={1}
            fill="none"
            stroke="url(#ribbon-d)"
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray="1"
            style={{ strokeDashoffset: dash }}
            opacity="0.55"
          />
          <motion.path
            d={RIBBON_DESKTOP_INNER}
            pathLength={1}
            fill="none"
            stroke="url(#ribbon-d)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="1"
            style={{ strokeDashoffset: dash }}
          />
        </motion.svg>

        <motion.div
          style={{ x }}
          className="relative flex h-full w-[380vw] items-center gap-[6vw] px-[6vw] sm:gap-[8vw] sm:px-[10vw]"
        >
          {MILESTONES.map((m, i) => {
            const World = WORLDS[m.key]!;
            // Even steps: animation top / text bottom. Odd: flip.
            const animOnTop = i % 2 === 0;

            return (
              <article
                key={m.key}
                className={cn(
                  "flex w-[86vw] shrink-0 flex-col items-center gap-5 sm:w-[72vw] sm:gap-7 md:w-[62vw] md:gap-10",
                  animOnTop ? "flex-col" : "flex-col-reverse",
                  // Desktop keeps side-by-side, still alternating which side the motif sits on
                  animOnTop ? "md:flex-row" : "md:flex-row-reverse",
                  i % 2 === 0 ? "md:-mt-[8vh]" : "md:mt-[10vh]",
                )}
              >
                <div className="relative z-10 flex w-full shrink-0 justify-center md:w-auto">
                  <World />
                </div>

                <div className="relative z-10 w-full max-w-md px-1 text-center md:max-w-sm md:px-0 md:text-left">
                  <span className="font-script text-sm tracking-[0.35em] text-gold-deep sm:tracking-[0.4em]">
                    {m.year}
                  </span>
                  <h3 className="mt-2 font-display text-[clamp(1.75rem,7vw,3rem)] leading-[1.15]">
                    {m.title}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[28ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:mt-4 sm:max-w-none sm:text-sm md:mx-0">
                    {m.memory}
                  </p>
                </div>
              </article>
            );
          })}
        </motion.div>

        <PulsingHeart className="left-[7%] top-[18%] z-30" delay={0.2} />
        <PulsingHeart className="right-[8%] top-[46%] z-30" delay={1.1} />
      </div>
    </ActSection>
  );
}
