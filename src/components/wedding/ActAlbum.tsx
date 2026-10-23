import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import couple from "@/assets/couple-illustration.png";
import { KEEPSAKES } from "./data";
import { PulsingHeart } from "./Motifs";
import { ActSection } from "./ActSection";
import Stack, { type StackHandle } from "./Stack";
import { onSmoothScroll, type SmoothScroll } from "@/lib/smooth-scroll";
function CoffeeScene() {
  return (
    <div className="relative h-full w-full bg-[#95271d]">
      <div className="absolute bottom-10 left-8 h-20 w-16 rounded-b-[2.2rem] rounded-t-md bg-[#95271d] ring-2 ring-[#fffaf2]" />
      <div className="absolute bottom-10 right-10 h-20 w-16 rounded-b-[2.2rem] rounded-t-md bg-[#95271d] ring-2 ring-[#fffaf2]" />
      <span className="absolute left-16 top-12 font-script text-4xl text-white">♥</span>
    </div>
  );
}

function CityScene() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#95271d]">
      <div className="absolute inset-x-4 bottom-8 flex items-end gap-1.5">
        {[42, 72, 38, 88, 54, 70].map((h, i) => (
          <div
            key={i}
            style={{ height: h }}
            className="w-7 rounded-t-sm bg-[#95271d] ring-1 ring-[#f6d98a]"
          />
        ))}
      </div>
      <div className="absolute right-6 top-8 h-10 w-10 rounded-full bg-gold/70 blur-[1px]" />
    </div>
  );
}

function RingScene() {
  return (
    <div className="relative grid h-full w-full place-items-center bg-[#95271d]">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <span
          key={a}
          className="absolute h-20 w-10 rounded-[100%] bg-[#f6d98a]/80"
          style={{ transformOrigin: "50% 100%", translate: "0 -40px", rotate: `${a}deg` }}
        />
      ))}
      <div className="relative z-10 h-16 w-16 rounded-full border-4 border-[#fffaf2] shadow-[var(--shadow-glow)]" />
    </div>
  );
}

function FamilyScene() {
  return (
    <div className="relative h-full w-full bg-[#95271d]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute w-24 rounded-[2px] bg-[#95271d] p-1.5 pb-6 ring-1 ring-[#fffaf2]"
          style={{
            left: 28 + i * 38,
            top: 36 + (i % 2) * 28,
            transform: `rotate(${-10 + i * 8}deg)`,
          }}
        >
          <div
            className="h-16 w-full"
            style={{
              background:
                i === 1
                  ? "linear-gradient(140deg, #ffe7a8, #f6d98a)"
                  : "linear-gradient(140deg, #fffaf2, #f6d98a)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function UsScene() {
  return (
    <div className="relative h-full w-full bg-[#95271d]">
      <img
        src={couple}
        alt=""
        className="absolute inset-x-0 bottom-0 mx-auto h-[108%] w-auto max-w-none object-contain"
      />
    </div>
  );
}

const SCENES = {
  coffee: CoffeeScene,
  city: CityScene,
  ring: RingScene,
  family: FamilyScene,
  us: UsScene,
};

export default function ActAlbum() {
  const ref = useRef<HTMLElement>(null);
  const stackRef = useRef<StackHandle>(null);
  const [front, setFront] = useState(0);
  const onFrontChange = useCallback((index: number) => setFront(index), []);

  const lockedRef = useRef(false);
  const lockAtRef = useRef(0);
  const lastScrollRef = useRef(0);
  const releasingRef = useRef<"up" | "down" | null>(null);
  const touchYRef = useRef<number | null>(null);
  const lastIdx = KEEPSAKES.length - 1;

  const cards = useMemo(
    () =>
      KEEPSAKES.map((item) => {
        const Scene = SCENES[item.scene];
        return (
          <article key={item.year} className="flex h-full w-full flex-col bg-[#95271d] ring-1 ring-[#fffaf2]/80">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <Scene />
            </div>
            <footer className="px-4 pb-4 pt-3">
              <p className="font-script text-[0.7rem] tracking-[0.35em] text-gold-deep">{item.year}</p>
              <h3 className="mt-1 font-display text-xl leading-tight text-ink">{item.title}</h3>
            </footer>
          </article>
        );
      }),
    [],
  );

  const pinY = () => ref.current?.offsetTop ?? 0;

  const lock = (from: "first" | "last", lenis: SmoothScroll) => {
    lockedRef.current = true;
    lockAtRef.current = Date.now();
    stackRef.current?.reset(from);
    lenis.stop?.();
    lenis.scrollTo(pinY(), { immediate: true });
  };

  const unlock = (dir: "up" | "down", lenis: SmoothScroll) => {
    lockedRef.current = false;
    releasingRef.current = dir;
    lenis.start?.();
    const y = pinY();
    const leave = dir === "down" ? y + window.innerHeight : Math.max(0, y - 48);
    lenis.scrollTo(leave, { duration: 0.75 });
  };

  useEffect(() => {
    let lenis: SmoothScroll | null = null;

    const onScroll = (state: { scroll: number; direction: number }) => {
      const el = ref.current;
      if (!el) return;
      const start = el.offsetTop;
      const y = state.scroll;
      const prev = lastScrollRef.current;
      lastScrollRef.current = y;

      if (releasingRef.current === "down") {
        if (y > start + 24) releasingRef.current = null;
        return;
      }
      if (releasingRef.current === "up") {
        if (y < start - 16) releasingRef.current = null;
        return;
      }

      if (lockedRef.current) {
        if (Math.abs(y - start) > 1) lenis?.scrollTo(start, { immediate: true });
        return;
      }

      if (prev < start && y >= start) {
        lock("first", lenis!);
        return;
      }
      if (prev > start && y <= start) {
        lock("last", lenis!);
      }
    };

    const turn = (dir: 1 | -1) => {
      const scroller = lenis;
      const stack = stackRef.current;
      if (!scroller || !stack || stack.isBusy()) return;
      if (Date.now() - lockAtRef.current < 120) return;
      if (dir > 0) {
        if (stack.frontIndex() >= lastIdx) unlock("down", scroller);
        else void stack.next();
      } else if (stack.frontIndex() <= 0) {
        unlock("up", scroller);
      } else {
        void stack.prev();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current || !lenis) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 6) turn(1);
      else if (e.deltaY < -6) turn(-1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!lockedRef.current || !lenis) return;
      const startY = touchYRef.current;
      touchYRef.current = null;
      if (startY == null) return;
      const y = e.changedTouches[0]?.clientY;
      if (y == null) return;
      const dy = startY - y;
      if (Math.abs(dy) < 36) return;
      turn(dy > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!lockedRef.current || !lenis) return;
      const down = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ";
      const up = e.key === "ArrowUp" || e.key === "PageUp";
      if (!down && !up) return;
      e.preventDefault();
      turn(down ? 1 : -1);
    };

    const unsub = onSmoothScroll((instance) => {
      if (lenis) lenis.off("scroll", onScroll);
      lenis = instance;
      if (lenis) {
        lastScrollRef.current = typeof lenis.scroll === "number" ? lenis.scroll : window.scrollY;
        lenis.on("scroll", onScroll);
      }
    });

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", onTouchEnd, { capture: true });
    window.addEventListener("keydown", onKey);

    return () => {
      unsub();
      lenis?.off("scroll", onScroll);
      if (lockedRef.current) lenis?.start?.();
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("touchend", onTouchEnd, { capture: true });
      window.removeEventListener("keydown", onKey);
    };
  }, [lastIdx]);

  const current = KEEPSAKES[front] ?? KEEPSAKES[0]!;
  const atStart = front === 0;
  const atEnd = front === lastIdx;

  return (
    <ActSection ref={ref} id="act-album" tone="light" className="h-screen">
      <div className="relative flex h-screen flex-col bg-transparent">
        <PulsingHeart className="left-[8%] top-[16%] z-10 hidden sm:block" delay={0.4} />

        <div className="relative z-10 px-6 pt-10 text-center sm:pt-14">
          <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.95]">
            Our life in{" "}
            <span className="italic text-foil">little frames</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-6 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-16 md:flex-row md:items-center md:gap-16">
          <div className="h-[min(58vh,22rem)] w-[min(78vw,17.5rem)] overflow-visible sm:h-[24rem] sm:w-[18.5rem]">
            <Stack ref={stackRef} randomRotation cards={cards} onFrontChange={onFrontChange} />
          </div>

          <div className="mt-10 max-w-sm text-center md:mt-0 md:text-left">
            <motion.p
              key={current.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.9, 0.35, 1] }}
              className="font-script text-2xl leading-snug text-gold-deep"
            >
              {current.caption}
            </motion.p>
            {!atStart && !atEnd && (
              <p className="mt-5 text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
                {front + 1} of {KEEPSAKES.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </ActSection>
  );
}
