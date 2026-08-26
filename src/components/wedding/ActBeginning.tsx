import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "motion/react";
import couple from "@/assets/couple-illustration.png";
import { COUPLE } from "./data";

const GROOM_LINE = "I practised this walk for a year.";
const BRIDE_LINE = "He still steps on my dupatta.";

function Sky({ p }: { p: any }) {
  const cloudA = useTransform(p, [0, 1], ["-12%", "22%"]);
  const cloudB = useTransform(p, [0, 1], ["18%", "-16%"]);
  const birds = useTransform(p, [0.2, 1], ["-10%", "70%"]);
  const birdY = useTransform(p, [0.2, 1], ["0%", "-40%"]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.svg
        style={{ x: cloudA }}
        className="absolute left-[6%] top-[12%] w-64 opacity-60"
        viewBox="0 0 200 70"
      >
        <path
          d="M15 55c-9 0-15-6-15-14S7 27 16 28c2-14 14-22 27-19 7-13 26-13 34 0 12-4 24 4 24 16 10-2 19 5 19 15 0 9-7 15-16 15z"
          fill="oklch(0.99 0.005 95)"
        />
      </motion.svg>
      <motion.svg
        style={{ x: cloudB }}
        className="absolute right-[8%] top-[22%] w-44 opacity-45"
        viewBox="0 0 200 70"
      >
        <path
          d="M15 55c-9 0-15-6-15-14S7 27 16 28c2-14 14-22 27-19 7-13 26-13 34 0 12-4 24 4 24 16 10-2 19 5 19 15 0 9-7 15-16 15z"
          fill="oklch(0.97 0.02 40)"
        />
      </motion.svg>
      <motion.div style={{ x: birds, y: birdY }} className="absolute left-0 top-[16%]">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            className="animate-drift absolute"
            style={{ left: i * 46, top: i * 22, animationDelay: `${i * 0.6}s` }}
            width="34"
            height="14"
            viewBox="0 0 34 14"
          >
            <path
              d="M1 9C6 2 11 2 17 8c6-6 11-6 16 1"
              fill="none"
              stroke="oklch(0.45 0.03 60)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </motion.div>
    </div>
  );
}

function Flowers({ p }: { p: any }) {
  const grow = useTransform(p, [0.1, 0.75], [0, 1]);
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh]">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div
          key={i}
          style={{ scaleY: grow, opacity: grow, left: `${(i * 6.3 + 2) % 98}%` }}
          className="absolute bottom-0 origin-bottom"
        >
          <svg width="60" height="180" viewBox="0 0 60 180">
            <path
              d={`M30 180 C ${18 + (i % 5) * 5} 130, ${42 - (i % 4) * 6} 90, 30 ${40 + (i % 6) * 10}`}
              stroke="oklch(0.6 0.06 145)"
              strokeWidth="2"
              fill="none"
            />
            <g
              className="animate-drift"
              style={{ animationDelay: `${i * 0.35}s`, transformOrigin: "30px 46px" }}
            >
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <ellipse
                  key={a}
                  cx="30"
                  cy={30 + (i % 6) * 10}
                  rx="7"
                  ry="12"
                  transform={`rotate(${a} 30 ${40 + (i % 6) * 10})`}
                  fill={i % 3 === 0 ? "oklch(0.9 0.05 25)" : "oklch(0.93 0.05 85)"}
                  opacity="0.9"
                />
              ))}
              <circle
                cx="30"
                cy={40 + (i % 6) * 10}
                r="5"
                fill="oklch(0.82 0.11 85)"
              />
            </g>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default function ActBeginning() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  const saturate = useTransform(p, [0.05, 0.55], [0, 1]);
  const filter = useTransform(
    saturate,
    (v) => `saturate(${v}) contrast(${1.6 - v * 0.6}) brightness(${1.2 - v * 0.2})`,
  );
  const sketchOpacity = useTransform(p, [0.05, 0.5], [1, 0]);
  const scale = useTransform(p, [0, 1], [1.12, 0.94]);
  const titleOpacity = useTransform(p, [0.62, 0.8], [0, 1]);
  const titleY = useTransform(p, [0.62, 0.85], [60, 0]);
  const petalOpacity = useTransform(p, [0.85, 1], [0, 1]);

  const [hover, setHover] = useState<"groom" | "bride" | null>(null);
  const [seen, setSeen] = useState<{ groom?: boolean; bride?: boolean }>({});
  const bothSeen = seen.groom && seen.bride;

  const touch = (who: "groom" | "bride") => {
    setHover(who);
    setSeen((s) => ({ ...s, [who]: true }));
  };

  return (
    <section ref={ref} className="relative h-[320vh]" id="act-1">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: bothSeen
              ? "linear-gradient(180deg, oklch(0.98 0.02 80) 0%, oklch(0.94 0.045 25) 100%)"
              : "var(--gradient-dawn)",
            transition: "background 1.2s var(--ease-silk)",
          }}
        />
        <Sky p={p} />
        <Flowers p={p} />

        <div className="relative z-10 flex h-full items-end justify-center">
          <motion.div style={{ scale }} className="relative h-[86vh] w-full max-w-5xl">
            <motion.img
              src={couple}
              alt={`Illustrated portrait of ${COUPLE.groom} and ${COUPLE.bride}`}
              width={1536}
              height={1024}
              style={{ filter }}
              className="absolute inset-0 h-full w-full object-contain object-bottom"
            />
            <motion.img
              src={couple}
              alt=""
              aria-hidden
              width={1536}
              height={1024}
              style={{ opacity: sketchOpacity }}
              className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-multiply [filter:grayscale(1)_contrast(2.6)_brightness(1.25)]"
            />

            {/* hover zones */}
            <button
              aria-label={`About ${COUPLE.groom}`}
              onMouseEnter={() => touch("groom")}
              onMouseLeave={() => setHover(null)}
              onClick={() => touch("groom")}
              className="absolute bottom-[6%] left-[22%] h-[62%] w-[26%] cursor-pointer"
            />
            <button
              aria-label={`About ${COUPLE.bride}`}
              onMouseEnter={() => touch("bride")}
              onMouseLeave={() => setHover(null)}
              onClick={() => touch("bride")}
              className="absolute bottom-[6%] right-[22%] h-[62%] w-[26%] cursor-pointer"
            />

            <motion.div
              animate={{ rotate: hover === "groom" ? 1.6 : 0, x: hover === "groom" ? 6 : 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              className="pointer-events-none absolute inset-0"
            />

            <AnimatePresence>
              {hover && (
                <motion.div
                  key={hover}
                  initial={{ opacity: 0, y: 18, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className={`pointer-events-none absolute top-[12%] ${hover === "groom" ? "left-[10%]" : "right-[10%]"} max-w-[15rem] rounded-[2rem] rounded-bl-sm glass-panel px-6 py-4 font-display text-lg italic`}
                >
                  “{hover === "groom" ? GROOM_LINE : BRIDE_LINE}”
                </motion.div>
              )}
            </AnimatePresence>

            {/* jewelry sparkle when bride hovered */}
            <AnimatePresence>
              {hover === "bride" &&
                [0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.25 }}
                    style={{ right: `${28 + i * 3}%`, bottom: `${44 + (i % 2) * 8}%` }}
                    className="pointer-events-none absolute h-2 w-2 rounded-full bg-gold shadow-[0_0_16px_var(--gold)]"
                  />
                ))}
            </AnimatePresence>

            {/* easter egg: heart bridge */}
            <AnimatePresence>
              {bothSeen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pointer-events-none absolute bottom-[40%] left-1/2 -translate-x-1/2"
                >
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: -120, y: 0, opacity: 0 }}
                      animate={{ x: [-120, 0, 120], y: [0, -40 - i * 3, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 3.4, repeat: Infinity, delay: i * 0.34 }}
                      className="absolute text-rose"
                    >
                      ♥
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 top-[18%] z-20 text-center"
        >
          <p className="mb-6 text-[0.7rem] uppercase tracking-luxe text-muted-foreground">
            Act One — The Beginning
          </p>
          <h1 className="font-display text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.9]">
            <span className="block">Two Stories.</span>
            <span className="block text-foil italic">One Forever.</span>
          </h1>
        </motion.div>

        <motion.div
          style={{ opacity: petalOpacity }}
          className="pointer-events-none absolute inset-0 z-30"
        >
          {Array.from({ length: 26 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: ["-10vh", "110vh"], rotate: [0, 360], x: [0, i % 2 ? 40 : -40] }}
              transition={{ duration: 7 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: "linear" }}
              style={{ left: `${(i * 3.9) % 100}%` }}
              className="absolute h-3 w-2 rounded-[100%_0_100%_0] bg-blush"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
