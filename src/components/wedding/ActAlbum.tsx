import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { KEEPSAKES } from "./data";
import { PulsingHeart } from "./Motifs";
import { ActSection } from "./ActSection";
import Stack, { type StackHandle } from "./Stack";
import { publicAsset } from "@/lib/site";

export default function ActAlbum() {
  const ref = useRef<HTMLElement>(null);
  const stackRef = useRef<StackHandle>(null);
  const [front, setFront] = useState(0);
  const onFrontChange = useCallback((index: number) => setFront(index), []);

  const lastIdx = KEEPSAKES.length - 1;

  const cards = useMemo(
    () =>
      KEEPSAKES.map((item) => (
          <article key={item.title} className="flex h-full w-full flex-col bg-[#95271d] ring-1 ring-[#fffaf2]/80">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <img
                src={publicAsset(item.image)}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            </div>
          </article>
      )),
    [],
  );

  const current = KEEPSAKES[front] ?? KEEPSAKES[0]!;
  const atStart = front === 0;
  const atEnd = front === lastIdx;

  const onTap = () => {
    const stack = stackRef.current;
    if (!stack || stack.isBusy() || atEnd) return;
    void stack.next();
  };

  return (
    <ActSection ref={ref} id="act-album" tone="light" className="h-screen">
      <div className="relative flex h-screen flex-col bg-transparent">
        <PulsingHeart className="left-[8%] top-[16%] z-10 hidden sm:block" delay={0.4} />

        <div className="relative z-10 px-6 pr-16 pt-5 text-center sm:pr-6 sm:pt-8">
          <h2 className="font-display text-[clamp(2rem,5vw,3.6rem)] leading-[0.95]">
            A little bit of us,{" "}
            <span className="italic text-foil">a whole lot of love</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-2 flex w-full max-w-5xl flex-1 flex-col items-center justify-start px-6 pb-8 sm:mt-4 sm:justify-center sm:pb-16 md:flex-row md:items-center md:gap-16">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onTap}
              disabled={atEnd}
              aria-label={atEnd ? current.caption : "Tap for the next photo"}
              className="h-[min(58vh,22rem)] w-[min(78vw,17.5rem)] appearance-none overflow-visible border-0 bg-transparent p-0 disabled:cursor-default disabled:opacity-100 sm:h-[24rem] sm:w-[18.5rem]"
            >
              <Stack ref={stackRef} randomRotation cards={cards} onFrontChange={onFrontChange} />
            </button>
            {!atEnd && (
              <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted-foreground"
              >
                Tap
              </motion.p>
            )}
          </div>

          <div className="mt-4 max-w-sm text-center md:mt-0 md:text-left">
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
