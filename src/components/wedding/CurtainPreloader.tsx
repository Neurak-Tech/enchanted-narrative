import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { COUPLE } from "./data";

const OPEN_MS = 1.65;

/** Gathered velvet: wavy center seam + deep scalloped hem. */
const CURTAIN_SHAPE =
  "M 0 0 L 0.99 0 C 0.9 0.1 0.82 0.2 0.94 0.32 C 0.84 0.44 0.9 0.54 0.97 0.66 C 0.88 0.76 0.94 0.84 1 0.93 C 0.9 0.97 0.8 0.9 0.7 0.96 C 0.6 1 0.5 0.9 0.4 0.96 C 0.3 1 0.2 0.9 0.1 0.96 C 0.04 1 0 0.95 0 0.93 Z";

const OPEN_EASE = [0.7, 0, 0.18, 1] as const;

function CurtainHalf({ side, open, sway }: { side: "left" | "right"; open: boolean; sway: boolean }) {
  const isLeft = side === "left";
  const clipId = isLeft ? "curtain-clip-left" : "curtain-clip-right";

  return (
    <motion.div
      className="fixed top-0 z-[201] h-[104%] w-[56vw] max-w-[56vw]"
      style={{
        left: isLeft ? "-1vw" : undefined,
        right: isLeft ? undefined : "-1vw",
        clipPath: `url(#${clipId})`,
        transformOrigin: isLeft ? "0% 0%" : "100% 0%",
      }}
      initial={false}
      animate={
        open
          ? { x: isLeft ? "-118%" : "118%", rotate: isLeft ? -7 : 7 }
          : sway
            ? {
                x: [0, isLeft ? "-1.1%" : "1.1%", 0],
                rotate: [0, isLeft ? 0.7 : -0.7, 0],
              }
            : { x: 0, rotate: 0 }
      }
      transition={
        open
          ? { duration: OPEN_MS, delay: isLeft ? 0 : 0.08, ease: OPEN_EASE }
          : { duration: 6.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <div className={`curtain-panel relative h-full w-full ${isLeft ? "curtain-panel--left" : "curtain-panel--right"}`}>
        <div aria-hidden className="curtain-panel__sheen" />
        <div
          aria-hidden
          className={`curtain-panel__braid absolute top-0 h-full w-[0.7rem] ${isLeft ? "right-0" : "left-0"}`}
        />
        <div aria-hidden className="curtain-panel__swag absolute inset-x-0 bottom-0 h-[22%]" />
        <div aria-hidden className="curtain-fringe absolute inset-x-[6%] bottom-[1.5%] h-4" />
      </div>
    </motion.div>
  );
}

function CenterSeal({ pressed, onReveal }: { pressed: boolean; onReveal: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[205] flex flex-col items-center justify-center"
      initial={false}
      animate={{ opacity: pressed ? 0 : 1, scale: pressed ? 1.06 : 1 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative">
        <motion.span
          aria-hidden
          className="curtain-seal__halo pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={pressed ? { scale: 1.8, opacity: 0 } : { scale: [1, 1.08, 1], opacity: [0.45, 0.75, 0.45] }}
          transition={
            pressed
              ? { duration: 0.45, ease: "easeOut" }
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.button
          type="button"
          onClick={onReveal}
          disabled={pressed}
          aria-label="Tap the seal to reveal the wedding story"
          className="curtain-seal relative flex h-[clamp(8rem,30vw,11rem)] w-[clamp(8rem,30vw,11rem)] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d98a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#3d100c]"
          animate={pressed ? { scale: 0.86, rotate: -8 } : { scale: [1, 1.025, 1] }}
          transition={
            pressed
              ? { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
          whileTap={{ scale: 0.94 }}
        >
          <span aria-hidden className="curtain-seal__orbit absolute inset-[-7%] rounded-full" />
          <span aria-hidden className="curtain-seal__ring absolute inset-0 rounded-full" />
          <span aria-hidden className="curtain-seal__wax absolute inset-[11%] rounded-full" />
          <span className="relative z-10 flex flex-col items-center">
            <span className="font-script text-[clamp(2.1rem,8vw,3.1rem)] leading-none text-[#5c1812]">
              {COUPLE.monogram}
            </span>
          </span>
        </motion.button>
      </div>

      <p className="font-display mt-6 text-[clamp(1.15rem,3.4vw,1.6rem)] leading-none text-[#fffaf2]">
        {COUPLE.bride} <span className="italic text-[#f6d98a]">&</span> {COUPLE.groom}
      </p>
      <motion.p
        className="tracking-luxe mt-3 text-[0.55rem] uppercase text-[#fffaf2]/88 sm:text-[0.62rem]"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        Tap to reveal
      </motion.p>
    </motion.div>
  );
}

export function CurtainPreloader({ onComplete }: { onComplete?: () => void }) {
  const reduceMotion = useReducedMotion();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const finishedRef = useRef(false);

  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [sealPressed, setSealPressed] = useState(false);

  const completeOnce = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    document.documentElement.style.overflow = "";
    setActive(false);
    onCompleteRef.current?.();
  };

  useLayoutEffect(() => {
    if (reduceMotion) {
      completeOnce();
      return;
    }
    setActive(true);
    document.documentElement.style.overflow = "hidden";
  }, [reduceMotion]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(completeOnce, OPEN_MS * 1000 + 160);
    return () => window.clearTimeout(timer);
  }, [open]);

  const reveal = () => {
    if (open || sealPressed) return;
    setSealPressed(true);
    window.setTimeout(() => setOpen(true), 280);
  };

  if (!active) return null;

  return (
    <div className="curtain-stage fixed inset-0 z-[200] select-none" role="presentation">
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id="curtain-clip-left" clipPathUnits="objectBoundingBox">
            <path d={CURTAIN_SHAPE} />
          </clipPath>
          <clipPath id="curtain-clip-right" clipPathUnits="objectBoundingBox">
            <path transform="scale(-1, 1) translate(-1, 0)" d={CURTAIN_SHAPE} />
          </clipPath>
          <clipPath id="curtain-valance-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0 0 H 1 V 0.55 C 0.96 0.62 0.92 0.52 0.88 0.6 C 0.84 0.68 0.8 0.54 0.76 0.62 C 0.72 0.7 0.68 0.54 0.64 0.62 C 0.6 0.7 0.56 0.54 0.52 0.62 C 0.48 0.7 0.44 0.54 0.4 0.62 C 0.36 0.7 0.32 0.54 0.28 0.62 C 0.24 0.7 0.2 0.54 0.16 0.62 C 0.12 0.7 0.08 0.54 0.04 0.62 C 0.02 0.66 0 0.6 0 0.55 Z" />
          </clipPath>
        </defs>
      </svg>

      <motion.div
        aria-hidden
        className="curtain-stage__glow pointer-events-none absolute inset-0"
        initial={false}
        animate={{ opacity: open ? 1 : 0.55, scale: open ? 1.15 : 1 }}
        transition={{ duration: OPEN_MS * 0.85, ease: OPEN_EASE }}
      />

      <motion.div
        className="curtain-valance fixed inset-x-0 top-0 z-[204] h-[min(16vh,8.5rem)]"
        style={{ clipPath: "url(#curtain-valance-clip)" }}
        initial={false}
        animate={{ y: open ? "-120%" : 0 }}
        transition={{ duration: OPEN_MS * 0.82, ease: OPEN_EASE }}
      >
        <div aria-hidden className="curtain-rod" />
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-y-[8%] left-1/2 z-[202] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#f6d98a] to-transparent"
        initial={false}
        animate={{ opacity: open ? 0 : 0.85, scaleY: open ? 0.4 : 1 }}
        transition={{ duration: 0.35 }}
      />

      {!open && <CenterSeal pressed={sealPressed} onReveal={reveal} />}

      <CurtainHalf side="left" open={open} sway={!open && !sealPressed} />
      <CurtainHalf side="right" open={open} sway={!open && !sealPressed} />
    </div>
  );
}
