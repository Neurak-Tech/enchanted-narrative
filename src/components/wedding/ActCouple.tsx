import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";
import couplePhoto from "@/assets/couple-photo.jpg";
import { COUPLE, COUPLE_PROFILE } from "./data";
import { cn } from "@/lib/utils";
import { ActSection } from "./ActSection";

type Side = "bride" | "groom";

function floatingFacts() {
  const groom = COUPLE_PROFILE.groom.traits;
  const bride = COUPLE_PROFILE.bride.traits;
  const count = Math.max(groom.length, bride.length);
  const items: { text: string; side: Side; key: string }[] = [];

  for (let i = 0; i < count; i++) {
    if (groom[i]) items.push({ text: groom[i], side: "groom", key: `g-${i}` });
    if (bride[i]) items.push({ text: bride[i], side: "bride", key: `b-${i}` });
  }

  return items;
}

const FACTS = floatingFacts();
const FACTS_START = 0.32;
const FACTS_END = 0.74;
const PHOTO_LIFT: readonly [number, number] = [0.76, 0.84];
const TOGETHER_IN: readonly [number, number] = [0.86, 0.92];
/** Portrait reveal after title lands; timeline uses start-end scroll (pre-pin). */
const PHOTO_IN: readonly [number, number] = [0.1, 0.28];

/** Next line begins as the previous one is on its way out. */
function overlappingRanges(start: number, count: number, end: number) {
  const lead = 0.78;
  const span = end - start;
  const duration = span / (1 + (count - 1) * lead);
  return Array.from({ length: count }, (_, i) => {
    const a = start + i * duration * lead;
    return [a, a + duration] as const;
  });
}

function WeddingRings({ scale, opacity }: { scale: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ scale, opacity }}
      viewBox="0 0 120 64"
      className="mx-auto h-14 w-24 drop-shadow-sm sm:h-16 sm:w-28"
      aria-hidden
    >
      <circle cx="42" cy="36" r="18" fill="none" stroke="#f6d98a" strokeWidth="3.2" />
      <circle cx="78" cy="36" r="18" fill="none" stroke="#fffaf2" strokeWidth="2.6" />
      <path
        d="M56 28c2-6 8-10 14-8"
        fill="none"
        stroke="#ffe7a8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

function FloatingFact({
  text,
  p,
  range,
  side,
}: {
  text: string;
  p: MotionValue<number>;
  range: readonly [number, number];
  side: Side;
}) {
  const [start, end] = range;
  const isGroom = side === "groom";
  const span = end - start;
  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - ((2 - 2 * t) ** 2) / 2);
  const opacity = useTransform(p, [start, start + span * 0.18, end - span * 0.22, end], [0, 1, 1, 0], { ease: easeInOut });
  const y = useTransform(p, [start, start + span * 0.34, end], ["-6vh", "-15vh", "-18vh"], { ease: easeInOut });
  const scale = useTransform(p, [start, start + span * 0.34, end], [0.96, 1, 0.98], { ease: easeInOut });

  return (
    <motion.p
      style={{ opacity, y, scale }}
      className={cn(
        "absolute top-full w-[min(62vw,16rem)] text-[clamp(0.95rem,3.5vw,1.12rem)] font-bold leading-snug text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]",
        isGroom ? "left-[8%] text-left sm:left-[18%]" : "right-[8%] text-right sm:right-[18%]",
      )}
    >
      {text}
    </motion.p>
  );
}

function CouplePortrait({ p }: { p: MotionValue<number> }) {
  const reveal = useTransform(p, PHOTO_IN, [0, 1]);
  const opacity = useTransform(reveal, [0, 0.12], [0, 1]);
  const scale = useTransform(reveal, [0, 1], [1.12, 1]);
  // Opens from a window on their faces until the terrace is in frame.
  const clipPath = useTransform(reveal, (t) => {
    const ease = t < 0.5 ? 2 * t * t : 1 - ((2 - 2 * t) ** 2) / 2;
    const top = (1 - ease) * 30;
    const side = (1 - ease) * 8;
    const bottom = (1 - ease) * 36;
    const radius = 24 - ease * 8;
    return `inset(${top}% ${side}% ${bottom}% ${side}% round ${radius}px)`;
  });

  return (
    <motion.div
      className="group absolute bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-1/2 h-[92%] w-auto max-w-[96%] -translate-x-1/2 aspect-[681/1024]"
      style={{ opacity, clipPath }}
    >
      <div className="relative h-full w-full">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-8 rounded-[1.75rem] bg-[#f6d98a]/45 blur-3xl sm:-inset-10"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(246,217,138,0.38)_0%,rgba(246,217,138,0)_72%)]"
        />
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-2xl border border-[#f6d98a]/70 shadow-[0_0_28px_rgba(246,217,138,0.45),0_0_64px_rgba(246,217,138,0.22)]"
          whileHover={{ scale: 1.055 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={couplePhoto}
            alt={`${COUPLE.groom} and ${COUPLE.bride}`}
            width={681}
            height={1024}
            style={{ scale, transformOrigin: "center 46%" }}
            className="h-full w-full object-cover"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-[-10%] left-0 w-1/3 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-[#fff6d8]/70 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[280%] group-hover:opacity-100"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function PersonName({
  side,
  p,
  showAt,
}: {
  side: Side;
  p: MotionValue<number>;
  showAt: number;
}) {
  const isGroom = side === "groom";
  const name = isGroom ? COUPLE.groom : COUPLE.bride;
  const opacity = useTransform(p, [showAt, showAt + 0.03, PHOTO_LIFT[0], PHOTO_LIFT[0] + 0.04], [0, 1, 1, 0]);
  const y = useTransform(p, [showAt, showAt + 0.05], [12, 0]);

  return (
    <motion.p
      style={{ opacity, y }}
      className={cn(
        "absolute top-[17%] z-40 font-display text-[clamp(1.35rem,5vw,2rem)] leading-none text-[#fffaf2]",
        isGroom ? "left-[8%] sm:left-[14%]" : "right-[8%] sm:right-[14%]",
      )}
    >
      {name}
    </motion.p>
  );
}

export default function ActCouple() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 32, mass: 0.35 });

  /** Same timeline as facts/photo (`p`); stay visible through section end — no fade at lift. */
  const headerOpacity = useTransform(p, [0, 0.06, 1], [0, 1, 1], { clamp: true });
  const headerY = useTransform(p, [0, 0.08, 1], [14, 0, 0], { clamp: true });
  const ringScale = useTransform(p, [0, 0.07, 1], [0.82, 1, 1], { clamp: true });

  const groomEnter: readonly [number, number] = [0.1, 0.18];
  const brideEnter: readonly [number, number] = [0.12, 0.2];

  const ranges = overlappingRanges(FACTS_START, FACTS.length, FACTS_END);

  const photoY = useTransform(p, PHOTO_LIFT, ["0vh", "-26vh"]);
  const photoScale = useTransform(p, PHOTO_LIFT, [1, 0.86]);
  const togetherOpacity = useTransform(p, TOGETHER_IN, [0, 1]);
  const togetherY = useTransform(p, TOGETHER_IN, [18, 0]);
  const scrollHintOpacity = useTransform(p, [0.94, 0.99], [0, 1]);

  return (
    <ActSection
      ref={ref}
      id="act-couple"
      tone="warm"
      className="-mt-[clamp(3.5rem,11vh,7rem)] h-[380vh]"
      scrollHint={false}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-transparent">

        <motion.header
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 px-4 text-center sm:top-6"
        >
          <WeddingRings scale={ringScale} opacity={headerOpacity} />
          <h2 className="mt-2 font-display text-[clamp(1.65rem,6vw,3.2rem)] leading-[0.96] sm:mt-3">
            Fun facts <span className="italic text-foil">about us.</span>
          </h2>
        </motion.header>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[calc(100dvh-min(62vh,32rem))] overflow-hidden sm:h-[calc(100dvh-min(66vh,36rem))]">
          {FACTS.map((fact, i) => (
            <FloatingFact key={fact.key} text={fact.text} p={p} range={ranges[i]!} side={fact.side} />
          ))}
        </div>

        <PersonName side="groom" p={p} showAt={groomEnter[1]} />
        <PersonName side="bride" p={p} showAt={brideEnter[1]} />

        <motion.div
          style={{ y: photoY, scale: photoScale }}
          className="absolute inset-x-0 bottom-0 z-20 mx-auto h-[min(62vh,32rem)] w-full max-w-[min(100%,28rem)] sm:h-[min(66vh,36rem)] sm:max-w-lg"
        >
          <CouplePortrait p={p} />
        </motion.div>

        <motion.div
          style={{ opacity: togetherOpacity, y: togetherY }}
          className="absolute inset-x-0 bottom-[max(2.6rem,env(safe-area-inset-bottom))] z-30 px-6 text-center"
        >
          <p className="font-display text-[clamp(1.7rem,6vw,2.5rem)] leading-none text-foil drop-shadow-[0_1px_12px_rgba(246,217,138,0.35)]">
            {COUPLE_PROFILE.together.title}
          </p>
          <p className="mx-auto mt-3 max-w-[16rem] text-[clamp(1rem,3.6vw,1.15rem)] font-medium leading-snug text-white">
            {COUPLE_PROFILE.together.lead}
          </p>
          <p className="mx-auto mt-2 max-w-[22rem] text-[clamp(0.82rem,3.2vw,0.95rem)] leading-relaxed text-white/90">
            {COUPLE_PROFILE.together.line}
          </p>
        </motion.div>

        <motion.p
          style={{ opacity: scrollHintOpacity }}
          className="absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 text-center text-[0.58rem] uppercase tracking-[0.26em] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]"
        >
          Keep scrolling
        </motion.p>
      </div>
    </ActSection>
  );
}
