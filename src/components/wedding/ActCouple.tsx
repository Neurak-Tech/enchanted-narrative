import { useRef, type ReactNode, type ComponentProps } from "react";
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

const SECTION_BG =
  "radial-gradient(ellipse at 50% 8%, #ffffff 0%, #e8a090 42%, #b34a44 100%)";

const GROOM_CLIP = "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)";
const BRIDE_CLIP = "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)";

type Side = "bride" | "groom";

function alternatingTraits() {
  const groom = COUPLE_PROFILE.groom.traits;
  const bride = COUPLE_PROFILE.bride.traits;
  const count = Math.max(groom.length, bride.length);
  const items: { text: string; side: Side; key: string }[] = [];

  for (let i = 0; i < count; i++) {
    if (groom[i]) items.push({ text: groom[i]!, side: "groom", key: `g-${i}` });
    if (bride[i]) items.push({ text: bride[i]!, side: "bride", key: `b-${i}` });
  }

  return items;
}

function traitRanges(start: number, count: number, step = 0.085) {
  return Array.from({ length: count }, (_, i) => [start + i * step, start + (i + 1) * step] as const);
}

function WeddingRings({ scale, opacity }: { scale: MotionValue<number>; opacity: MotionValue<number> }) {
  return (
    <motion.svg
      style={{ scale, opacity }}
      viewBox="0 0 120 64"
      className="mx-auto h-14 w-24 drop-shadow-sm sm:h-16 sm:w-28"
      aria-hidden
    >
      <circle cx="42" cy="36" r="18" fill="none" stroke="#e77b49" strokeWidth="3.2" />
      <circle cx="78" cy="36" r="18" fill="none" stroke="#000000" strokeWidth="2.6" />
      <path
        d="M56 28c2-6 8-10 14-8"
        fill="none"
        stroke="#e77b49"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

function ThoughtBubble({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: ComponentProps<typeof motion.div>["style"];
}) {
  return (
    <motion.div
      style={style}
      className={cn(
        "rounded-[1.1rem] bg-white px-3.5 py-2.5 text-ink shadow-[0_10px_32px_-10px_rgba(0,0,0,0.45)] ring-1 ring-black/15 sm:px-4 sm:py-3",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

function GapThought({
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
  const mid = (start + end) / 2;
  const opacity = useTransform(
    p,
    [start, start + (mid - start) * 0.35, end - (end - mid) * 0.35, end],
    [0, 1, 1, 0],
  );
  const y = useTransform(p, [start, mid, end], [12, 0, -8]);
  const scale = useTransform(p, [start, mid, end], [0.94, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={cn(
        "absolute top-[42%] w-[min(44vw,11.5rem)] -translate-y-1/2 sm:top-[40%] sm:w-48",
        isGroom ? "left-1 sm:left-3" : "right-1 sm:right-3",
      )}
    >
      <ThoughtBubble>
        <p className="font-script text-[clamp(0.95rem,3.5vw,1.15rem)] leading-snug tracking-[0.05em]">
          {text}
        </p>
      </ThoughtBubble>
    </motion.div>
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

function PersonBubble({
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
  const role = isGroom ? COUPLE_PROFILE.groom.role : COUPLE_PROFILE.bride.role;
  const opacity = useTransform(p, [showAt, showAt + 0.04], [0, 1]);
  const y = useTransform(p, [showAt, showAt + 0.06], [12, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className={cn(
        "absolute top-0 w-[min(44vw,10.5rem)] sm:w-44",
        isGroom ? "left-1 sm:left-3" : "right-1 sm:right-3",
      )}
    >
      <ThoughtBubble>
        <p className="font-script text-[0.7rem] tracking-[0.22em] sm:text-xs">{name.toUpperCase()}</p>
        <p className="mt-1 text-[0.55rem] uppercase leading-snug tracking-[0.14em] text-muted-foreground sm:text-[0.6rem]">
          {role}
        </p>
      </ThoughtBubble>
    </motion.div>
  );
}

export default function ActCouple() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  const headerOpacity = useTransform(p, [0, 0.06], [0, 1]);
  const headerY = useTransform(p, [0, 0.08], [16, 0]);
  const ringScale = useTransform(p, [0, 0.07], [0.78, 1]);

  const groomEnter: readonly [number, number] = [0.06, 0.2];
  const brideEnter: readonly [number, number] = [0.1, 0.24];

  const alternating = alternatingTraits();
  const traitScrollRanges = traitRanges(0.22, alternating.length);

  const scrollHintOpacity = useTransform(p, [0.9, 0.97], [0, 1]);

  return (
    <section
      ref={ref}
      id="act-couple"
      className="relative h-[520vh]"
      style={{ background: SECTION_BG }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="absolute inset-0" style={{ background: SECTION_BG }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,transparent_35%,#00000012_100%)]" />

        <motion.header
          style={{ opacity: headerOpacity, y: headerY }}
          className="absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-50 px-4 text-center sm:top-6"
        >
          <WeddingRings scale={ringScale} opacity={headerOpacity} />
          <p className="mt-2 text-[0.62rem] uppercase tracking-luxe text-muted-foreground sm:mt-3 sm:text-[0.7rem]">
            Act Three — Meet the Couple
          </p>
          <h2 className="mt-2 font-display text-[clamp(1.65rem,6vw,3.2rem)] leading-[0.96] sm:mt-3">
            Two people, <span className="italic text-foil">one very long inside joke.</span>
          </h2>
        </motion.header>

        {/* bubble lane — higher up, closer to heading */}
        <div className="pointer-events-none absolute inset-x-0 top-[19%] z-40 h-[26%] sm:top-[18%] sm:h-[27%]">
          <PersonBubble side="groom" p={p} showAt={groomEnter[1]} />
          <PersonBubble side="bride" p={p} showAt={brideEnter[1]} />

          {alternating.map((item, i) => (
            <GapThought
              key={item.key}
              text={item.text}
              p={p}
              range={traitScrollRanges[i]!}
              side={item.side}
            />
          ))}
        </div>

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
    </section>
  );
}
