import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import waxSeal from "@/assets/wax-seal.png";
import { startBackgroundMusicFromUserGesture } from "@/lib/background-music";
import {
  startCurtainDrumroll,
  startCurtainDrumrollFromGesture,
  stopCurtainDrumroll,
} from "@/lib/curtain-drumroll";

const OPEN_MS = 1.55;

/** Same point count so the free edge eases into one smooth sweep. */
const LEFT_CLIP = {
  closed:
    "polygon(0% 0%, 100% 0%, 100% 14%, 100% 28%, 100% 42%, 100% 56%, 100% 70%, 100% 84%, 100% 100%, 0% 100%)",
  gathered:
    "polygon(0% 0%, 88% 0%, 80% 14%, 70% 28%, 62% 42%, 56% 56%, 52% 70%, 48% 84%, 46% 100%, 0% 100%)",
  gone:
    "polygon(0% 0%, 0% 0%, 0% 14%, 0% 28%, 0% 42%, 0% 56%, 0% 70%, 0% 84%, 0% 100%, 0% 100%)",
};

const RIGHT_CLIP = {
  closed:
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 84%, 0% 70%, 0% 56%, 0% 42%, 0% 28%, 0% 14%)",
  gathered:
    "polygon(12% 0%, 100% 0%, 100% 100%, 54% 100%, 52% 84%, 48% 70%, 44% 56%, 38% 42%, 30% 28%, 18% 14%)",
  gone:
    "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 84%, 100% 70%, 100% 56%, 100% 42%, 100% 28%, 100% 14%)",
};

function CurtainHalf({ side, open }: { side: "left" | "right"; open: boolean }) {
  const isLeft = side === "left";
  const clip = isLeft ? LEFT_CLIP : RIGHT_CLIP;
  const openEase = [0.42, 0.02, 0.18, 1] as const;

  return (
    <motion.div
      className={`pointer-events-none fixed top-0 z-[201] h-full w-[54vw] ${isLeft ? "left-0" : "right-0"}`}
      initial={false}
      animate={
        open
          ? { x: isLeft ? ["0vw", "-4vw", "-18vw", "-120vw"] : ["0vw", "4vw", "18vw", "120vw"] }
          : { x: "0vw" }
      }
      transition={open ? { duration: OPEN_MS, times: [0, 0.22, 0.46, 1], ease: openEase } : { duration: 0.2 }}
    >
      <motion.div
        aria-hidden
        className="curtain-panel__rail absolute top-0 right-0 left-0"
        style={{ transformOrigin: isLeft ? "0% 50%" : "100% 50%" }}
        initial={false}
        animate={open ? { scaleX: [1, 0.82, 0.62, 0] } : { scaleX: 1 }}
        transition={open ? { duration: OPEN_MS, times: [0, 0.22, 0.46, 1], ease: openEase } : { duration: 0.2 }}
      />
      <motion.div
        className="curtain-panel absolute inset-x-0 bottom-0 top-[11px]"
        initial={false}
        animate={open ? { clipPath: [clip.closed, clip.gathered, clip.gathered, clip.gone] } : { clipPath: clip.closed }}
        transition={open ? { duration: OPEN_MS, times: [0, 0.22, 0.46, 1], ease: openEase } : { duration: 0.2 }}
      />
    </motion.div>
  );
}

function CenterSeal({ pressed }: { pressed: boolean }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[205] flex flex-col items-center justify-center"
      initial={false}
      animate={{ opacity: pressed ? 0 : 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src={waxSeal}
        alt=""
        draggable={false}
        className="h-[clamp(11rem,42vw,16rem)] w-[clamp(11rem,42vw,16rem)] scale-[1.08] rounded-full object-cover shadow-[0_3px_0_rgba(90,30,40,0.28),0_10px_16px_rgba(40,8,12,0.22)]"
      />
      <p className="tracking-luxe mt-5 text-[0.55rem] uppercase text-[#fffaf2]/88 sm:text-[0.62rem]">
        Tap to reveal
      </p>
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
    stopCurtainDrumroll();
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
    if (!active) return;
    startCurtainDrumroll();

    const unlock = () => {
      startCurtainDrumrollFromGesture();
    };
    window.addEventListener("pointermove", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointermove", unlock);
      stopCurtainDrumroll();
      document.documentElement.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(completeOnce, OPEN_MS * 1000 + 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  const reveal = () => {
    if (open || sealPressed) return;
    setSealPressed(true);
    setOpen(true);
    stopCurtainDrumroll();
    startBackgroundMusicFromUserGesture();
  };

  if (!active) return null;

  return (
    <button
      type="button"
      className={`curtain-stage fixed inset-0 z-[200] cursor-pointer select-none appearance-none border-0 bg-transparent p-0 ${open ? "pointer-events-none" : ""}`}
      onClick={reveal}
      aria-label="Tap anywhere to reveal the wedding story"
    >
      {!open && <CenterSeal pressed={sealPressed} />}

      <motion.div
        aria-hidden
        className="curtain-floor-shadow pointer-events-none fixed inset-x-[8%] bottom-[2%] z-[200] h-8"
        initial={false}
        animate={{ opacity: open ? 0 : 0.85, scaleX: open ? 0.4 : 1 }}
        transition={{ duration: OPEN_MS * 0.7, ease: [0.45, 0.02, 0.2, 1] }}
      />

      <CurtainHalf side="left" open={open} />
      <CurtainHalf side="right" open={open} />
    </button>
  );
}
