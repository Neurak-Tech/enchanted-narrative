import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "motion/react";
import couple from "@/assets/couple-illustration.png";
import { COUPLE, COUPLE_PROFILE } from "./data";
import { cn } from "@/lib/utils";
import { ActSection } from "./ActSection";

const GROOM_CLIP = "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)";
const BRIDE_CLIP = "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)";

type Side = "bride" | "groom";

function floatingLines() {
  const groom = [COUPLE_PROFILE.groom.role, ...COUPLE_PROFILE.groom.traits];
  const bride = [COUPLE_PROFILE.bride.role, ...COUPLE_PROFILE.bride.traits];
  const count = Math.max(groom.length, bride.length);
  const items: { text: string; side: Side; key: string }[] = [];

  for (let i = 0; i < count; i++) {
    if (groom[i]) items.push({ text: groom[i]!, side: "groom", key: `g-${i}` });
    if (bride[i]) items.push({ text: bride[i]!, side: "bride", key: `b-${i}` });
  }

  return items;
}

/** Next line begins while the previous one is still on its way out. */
function overlappingRanges(start: number, count: number, end = 0.92) {
  const lead = 0.42;
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

function FloatingBubble({
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
  const opacity = useTransform(p, [start, start + span * 0.1, end - span * 0.18, end], [0, 1, 1, 0]);
  // Starts just under the portrait lip (clipped) and rises into the gap above it.
  const y = useTransform(p, [start, end], ["3.5vh", "-15vh"]);
  const scale = useTransform(p, [start, start + span * 0.35, end], [0.94, 1, 0.98]);

  return (
    <motion.p
      style={{ opacity, y, scale }}
      className={cn(
        "absolute top-full w-[min(42vw,11.5rem)] text-[clamp(0.95rem,3.5vw,1.15rem)] font-bold leading-snug text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)] sm:w-48",
        isGroom ? "left-[8%] text-left sm:left-[18%]" : "right-[8%] text-right sm:right-[18%]",
      )}
    >
      {text}
    </motion.p>
  );
}

function PersonLayer({
  side,
  p,
  enter,
}: {
  side: Side;
  p: MotionValue<number>;
  enter: readonly [number, number];
}) {
  const isGroom = side === "groom";
  const enterX = useTransform(p, enter, isGroom ? ["-65vw", "0vw"] : ["65vw", "0vw"]);
  const enterY = useTransform(p, enter, ["50vh", "0vh"]);
  const opacity = useTransform(p, [enter[0], enter[0] + 0.05], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        clipPath: isGroom ? GROOM_CLIP : BRIDE_CLIP,
        x: enterX,
        y: enterY,
        opacity,
      }}
    >
      <img
        src={couple}
        alt=""
        aria-hidden
        width={1536}
        height={1024}
        className="absolute bottom-0 left-1/2 h-[108%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom"
      />
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
  const opacity = useTransform(p, [showAt, showAt + 0.04], [0, 1]);
  const y = useTransform(p, [showAt, showAt + 0.06], [12, 0]);

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
  // Progress begins as the section rises into view (before sticky pin at start/start).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  const headerOpacity = useTransform(p, [0, 0.06], [0, 1]);
  const headerY = useTransform(p, [0, 0.08], [16, 0]);
  const ringScale = useTransform(p, [0, 0.07], [0.78, 1]);

  const groomEnter: readonly [number, number] = [0.06, 0.2];
  const brideEnter: readonly [number, number] = [0.1, 0.24];

  const lines = floatingLines();
  const lineRanges = overlappingRanges(0.26, lines.length);

  const scrollHintOpacity = useTransform(p, [0.9, 0.97], [0, 1]);

  return (
    <ActSection ref={ref} id="act-couple" tone="warm" className="h-[520vh]" scrollHint={false}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-transparent">

        <motion.header
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 px-4 text-center sm:top-6"
        >
          <WeddingRings scale={ringScale} opacity={headerOpacity} />
          <h2 className="mt-2 font-display text-[clamp(1.65rem,6vw,3.2rem)] leading-[0.96] sm:mt-3">
            Fun facts <span className="italic text-foil">about the couple.</span>
          </h2>
        </motion.header>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[calc(100dvh-min(58vh,28rem))] overflow-hidden sm:h-[calc(100dvh-min(62vh,32rem))]">
          {lines.map((item, i) => (
            <FloatingBubble
              key={item.key}
              text={item.text}
              p={p}
              range={lineRanges[i]!}
              side={item.side}
            />
          ))}
        </div>

        <PersonName side="groom" p={p} showAt={groomEnter[1]} />
        <PersonName side="bride" p={p} showAt={brideEnter[1]} />

        <div className="absolute inset-x-0 bottom-0 z-20 mx-auto h-[min(58vh,28rem)] w-full max-w-[min(100%,26rem)] sm:h-[min(62vh,32rem)] sm:max-w-md">
          <PersonLayer side="groom" p={p} enter={groomEnter} />
          <PersonLayer side="bride" p={p} enter={brideEnter} />
        </div>

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
