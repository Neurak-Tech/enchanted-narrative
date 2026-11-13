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

/** Scroll budget (vh); progress = vh / section height so each fact gets VH_PER_FACT of travel. */
const VH_PER_FACT = 92;
const INTRO_SCROLL_VH = 100;
const OUTRO_SCROLL_VH = 420;
const FACTS_SCROLL_VH = FACTS.length * VH_PER_FACT;
const SECTION_SCROLL_VH = INTRO_SCROLL_VH + FACTS_SCROLL_VH + OUTRO_SCROLL_VH;

function progressAt(vh: number) {
  return vh / SECTION_SCROLL_VH;
}

const FACTS_START = progressAt(INTRO_SCROLL_VH);
const FACTS_END = progressAt(INTRO_SCROLL_VH + FACTS_SCROLL_VH);
const PHOTO_LIFT: readonly [number, number] = [
  progressAt(INTRO_SCROLL_VH + FACTS_SCROLL_VH + 48),
  progressAt(INTRO_SCROLL_VH + FACTS_SCROLL_VH + 168),
];
const TOGETHER_IN: readonly [number, number] = [
  progressAt(INTRO_SCROLL_VH + FACTS_SCROLL_VH + 200),
  progressAt(INTRO_SCROLL_VH + FACTS_SCROLL_VH + 320),
];
/** Portrait reveal during intro, before facts. */
const PHOTO_IN: readonly [number, number] = [
  progressAt(INTRO_SCROLL_VH * 0.22),
  progressAt(INTRO_SCROLL_VH * 0.88),
];

/** One caption per scroll slot; fully fades out before the next slot starts. */
function sequentialFactRanges(start: number, count: number, end: number) {
  const slot = (end - start) / count;
  return Array.from({ length: count }, (_, i) => {
    const a = start + i * slot;
    return [a, a + slot] as const;
  });
}

function WeddingRings({ scale, opacity }: { scale: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ scale, opacity }}
      viewBox="0 0 120 64"
      className="mx-auto h-11 w-[4.75rem] drop-shadow-sm sm:h-16 sm:w-28 [@media(max-height:560px)]:h-9 [@media(max-height:560px)]:w-16"
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
  const opacity = useTransform(
    p,
    [start, start + span * 0.14, end - span * 0.14, end],
    [0, 1, 1, 0],
    { clamp: true, ease: easeInOut },
  );
  const y = useTransform(p, [start, start + span * 0.5, end], ["0.6vh", "-0.35vh", "-1vh"], { ease: easeInOut });
  const scale = useTransform(p, [start, start + span * 0.38, end], [0.97, 1, 0.99], { ease: easeInOut });

  return (
    <motion.p
      data-fun-fact=""
      style={{ opacity, y, scale }}
      className={cn(
        "absolute bottom-[10%] w-[min(46vw,16rem)] max-w-[calc(50%-0.75rem)] text-[clamp(0.8rem,2.6vw,1.08rem)] font-bold leading-snug text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)] max-md:bottom-1",
        isGroom ? "left-[4%] text-left sm:left-[10%]" : "right-[4%] text-right sm:right-[10%]",
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
        "absolute top-[8%] z-40 font-display text-[clamp(1.4rem,5.4vw,2.35rem)] leading-none text-[#fffaf2] max-md:top-1",
        isGroom ? "left-[4%] sm:left-[10%]" : "right-[4%] sm:right-[10%]",
      )}
    >
      {name}
    </motion.p>
  );
}

export default function ActCouple() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 88, damping: 30, mass: 0.45 });

  /** Same timeline as facts/photo (`p`); stay visible through section end — no fade at lift. */
  const headerOpacity = useTransform(
    p,
    [0, progressAt(INTRO_SCROLL_VH * 0.45), 1],
    [0, 1, 1],
    { clamp: true },
  );
  const headerY = useTransform(p, [0, progressAt(INTRO_SCROLL_VH * 0.55), 1], [14, 0, 0], { clamp: true });
  const ringScale = useTransform(p, [0, progressAt(INTRO_SCROLL_VH * 0.5), 1], [0.82, 1, 1], { clamp: true });

  const groomEnter: readonly [number, number] = [
    progressAt(INTRO_SCROLL_VH * 0.35),
    progressAt(INTRO_SCROLL_VH * 0.62),
  ];
  const brideEnter: readonly [number, number] = [
    progressAt(INTRO_SCROLL_VH * 0.42),
    progressAt(INTRO_SCROLL_VH * 0.7),
  ];

  const ranges = sequentialFactRanges(FACTS_START, FACTS.length, FACTS_END);

  const photoY = useTransform(p, PHOTO_LIFT, ["0vh", "-26vh"]);
  const photoScale = useTransform(p, PHOTO_LIFT, [1, 0.86]);
  const togetherOpacity = useTransform(p, TOGETHER_IN, [0, 1]);
  const togetherY = useTransform(p, TOGETHER_IN, [18, 0]);
  const scrollHintOpacity = useTransform(
    p,
    [progressAt(SECTION_SCROLL_VH - 48), progressAt(SECTION_SCROLL_VH - 12)],
    [0, 1],
    { clamp: true },
  );

  return (
    <ActSection
      ref={ref}
      id="act-couple"
      tone="warm"
      className="-mt-[clamp(3.5rem,11vh,7rem)]"
      style={{ height: `${SECTION_SCROLL_VH}vh` }}
      scrollHint={false}
    >
      <div className="sticky top-0 grid h-[100dvh] grid-rows-[auto_minmax(6.75rem,1fr)_minmax(0,min(50dvh,30rem))] overflow-hidden bg-transparent max-md:grid-rows-[auto_minmax(4.5rem,18dvh)_minmax(0,1fr)] [@media(max-height:740px)]:grid-rows-[auto_minmax(6.5rem,1fr)_minmax(0,min(46dvh,22rem))] [@media(max-height:560px)]:grid-rows-[auto_minmax(5.5rem,1fr)_minmax(0,min(40dvh,16rem))] [@media(orientation:landscape)_and_(max-height:520px)]:grid-rows-[auto_minmax(4.25rem,1fr)_minmax(0,min(44dvh,12.5rem))] max-md:[@media(max-height:740px)]:grid-rows-[auto_minmax(4.25rem,16dvh)_minmax(0,1fr)] max-md:[@media(max-height:560px)]:grid-rows-[auto_minmax(3.75rem,14dvh)_minmax(0,1fr)]">

        <motion.header
          style={{ opacity: headerOpacity, y: headerY }}
          className="relative z-50 px-4 pb-1 pt-[max(0.4rem,env(safe-area-inset-top))] text-center sm:pt-5"
        >
          <WeddingRings scale={ringScale} opacity={headerOpacity} />
          <h2 className="mt-1 font-display text-[clamp(1.35rem,5vw,3.2rem)] leading-[0.96] sm:mt-3 [@media(max-height:560px)]:text-[clamp(1.2rem,6vh,1.7rem)]">
            Fun facts <span className="italic text-foil">about us.</span>
          </h2>
        </motion.header>

        <div className="pointer-events-none relative z-30 min-h-0 overflow-hidden">
          {FACTS.map((fact, i) => (
            <FloatingFact key={fact.key} text={fact.text} p={p} range={ranges[i]!} side={fact.side} />
          ))}
          <PersonName side="groom" p={p} showAt={groomEnter[1]} />
          <PersonName side="bride" p={p} showAt={brideEnter[1]} />
        </div>

        <motion.div
          style={{ y: photoY, scale: photoScale }}
          className="relative z-20 mx-auto mb-[max(0.35rem,env(safe-area-inset-bottom))] h-full w-full max-w-[min(94%,26rem)] sm:max-w-lg"
        >
          <CouplePortrait p={p} />
        </motion.div>

        <motion.div
          style={{ opacity: togetherOpacity, y: togetherY }}
          className="absolute inset-x-0 bottom-0 z-30 px-6 pb-[max(0.85rem,env(safe-area-inset-bottom))] text-center [@media(max-height:520px)]:pb-[max(0.45rem,env(safe-area-inset-bottom))]"
        >
          <p className="font-display text-[clamp(1.7rem,6vw,2.5rem)] leading-none text-foil drop-shadow-[0_1px_12px_rgba(246,217,138,0.35)] [@media(max-height:520px)]:text-[1.45rem]">
            {COUPLE_PROFILE.together.title}
          </p>
          <p className="mx-auto mt-3 max-w-[16rem] text-[clamp(1rem,3.6vw,1.15rem)] font-medium leading-snug text-white [@media(max-height:520px)]:mt-1.5 [@media(max-height:520px)]:text-[0.95rem]">
            {COUPLE_PROFILE.together.lead}
          </p>
          <p className="mx-auto mt-2 max-w-[22rem] text-[clamp(0.82rem,3.2vw,0.95rem)] leading-snug text-white/90 [@media(max-height:520px)]:mt-1 [@media(max-height:520px)]:max-w-[34rem]">
            {COUPLE_PROFILE.together.line}
          </p>
          <motion.p
            style={{ opacity: scrollHintOpacity }}
            className="mt-5 text-[0.62rem] uppercase leading-none tracking-[0.26em] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] [@media(max-height:520px)]:mt-2.5"
          >
            Keep scrolling
          </motion.p>
        </motion.div>
      </div>
    </ActSection>
  );
}
