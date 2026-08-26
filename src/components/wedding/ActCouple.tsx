import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import groomImg from "@/assets/groom.png";
import brideImg from "@/assets/bride.png";
import { COUPLE } from "./data";

type Person = {
  name: string;
  role: string;
  img: string;
  facts: string[];
  reel: string;
  reelCaption: string;
};

const PEOPLE: Person[] = [
  {
    name: COUPLE.groom,
    role: "The one who plans everything twice",
    img: groomImg,
    facts: ["Makes terrible puns", "Can't cook rice", "Cried first", "Secretly a dancer"],
    reel: "linear-gradient(130deg, oklch(0.93 0.03 85), oklch(0.82 0.06 60), oklch(0.9 0.04 30))",
    reelCaption: "Aarav, mid-baraat, absolutely gone",
  },
  {
    name: COUPLE.bride,
    role: "The one who makes it magic",
    img: brideImg,
    facts: ["Laughs too loud", "Reads two books at once", "Said yes instantly", "Collects postcards"],
    reel: "linear-gradient(130deg, oklch(0.94 0.035 25), oklch(0.86 0.06 20), oklch(0.92 0.05 80))",
    reelCaption: "Meera, laughing at nothing, as usual",
  },
];

function Portrait({ p, flip }: { p: Person; flip?: boolean }) {
  const [open, setOpen] = useState(false);
  const [fact, setFact] = useState<string | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 140, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 140, damping: 14 });

  return (
    <div className="relative" style={{ perspective: 1400 }}>
      <motion.div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        onClick={() => setOpen((o) => !o)}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        className="group relative h-[30rem] w-[19rem] cursor-pointer rounded-[1.5rem] border border-gold/50 bg-[linear-gradient(160deg,oklch(0.99_0.006_95),oklch(0.94_0.025_80))] p-3 shadow-[var(--shadow-soft)] sm:h-[34rem] sm:w-[22rem]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[1rem] bg-[radial-gradient(circle_at_50%_20%,oklch(0.97_0.02_60),oklch(0.9_0.035_35))]">
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="reel"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <motion.div
                  animate={{ scale: [1.05, 1.18], x: [0, -10], y: [0, -14] }}
                  transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute inset-0"
                  style={{ background: p.reel }}
                />
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={768}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-luminosity"
                />
                <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent_0_3px,oklch(0_0_0/0.05)_3px_4px)]" />
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear" }}
                  onAnimationComplete={() => setOpen(false)}
                  className="absolute bottom-0 left-0 h-[3px] bg-foil"
                />
                <p className="absolute bottom-6 left-5 right-5 font-display text-lg italic text-[oklch(0.99_0.005_90)] drop-shadow">
                  {p.reelCaption}
                </p>
              </motion.div>
            ) : (
              <motion.img
                key="still"
                src={p.img}
                alt={`Portrait of ${p.name}`}
                loading="lazy"
                width={768}
                height={1024}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ transform: "translateZ(50px)" }}
                className={`absolute inset-x-0 bottom-0 mx-auto h-[112%] w-auto max-w-none object-contain transition-transform duration-700 group-hover:scale-[1.06] ${flip ? "-scale-x-100 group-hover:-scale-x-[1.06]" : ""}`}
              />
            )}
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 rounded-[1rem] shadow-[inset_0_0_60px_oklch(0.85_0.06_70/0.5)]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 -bottom-0.5 flex justify-center">
          <span className="rounded-full bg-pearl px-4 py-1 font-script text-sm tracking-[0.3em] text-gold-deep ring-1 ring-gold/50">
            {p.name.toUpperCase()}
          </span>
        </div>
      </motion.div>

      {/* orbiting facts */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {p.facts.map((f, i) => {
          const angle = (i / p.facts.length) * Math.PI * 2;
          return (
            <motion.button
              key={f}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              onClick={() => setFact(fact === f ? null : f)}
              style={{
                left: `calc(50% + ${Math.cos(angle) * 230}px)`,
                top: `calc(50% + ${Math.sin(angle) * 210}px)`,
              }}
              className="pointer-events-auto absolute -translate-x-1/2 whitespace-nowrap rounded-full glass-panel px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold-deep"
            >
              {f}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {fact && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-14 left-1/2 w-64 -translate-x-1/2 text-center font-script text-lg text-rose"
          >
            “{fact}” — allegedly.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ActCouple() {
  return (
    <section
      id="act-4"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.97_0.02_60),oklch(0.92_0.035_35))] px-6 py-32"
    >
      {/* lanterns */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-8 w-6 rounded-[45%] bg-[radial-gradient(circle_at_50%_35%,oklch(0.95_0.09_85),oklch(0.8_0.11_60))] opacity-70 blur-[0.4px] shadow-[var(--shadow-glow)]"
            style={{
              left: `${(i * 8.4 + 4) % 96}%`,
              animation: `lantern-up ${22 + (i % 6) * 4}s ${i * 1.6}s linear infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        <p className="text-[0.7rem] uppercase tracking-luxe text-muted-foreground">
          Act Four — Meet the Couple
        </p>
        <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.6rem)]">
          Two people, <span className="italic text-foil">one very long inside joke.</span>
        </h2>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          hover to lift · click to play
        </p>
      </div>

      <div className="relative mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-center gap-24">
        {PEOPLE.map((p, i) => (
          <Portrait key={p.name} p={p} flip={i === 1} />
        ))}
      </div>

      <div className="relative mx-auto mt-32 max-w-md text-center">
        <motion.div
          initial={{ rotateY: 0 }}
          whileInView={{ rotateY: [0, 180, 360] }}
          viewport={{ once: true }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto h-28 w-44 rounded-md border border-gold/60 bg-pearl shadow-[var(--shadow-soft)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="h-full w-full bg-[linear-gradient(180deg,transparent_49%,oklch(0.82_0.11_85/0.4)_50%)]" />
        </motion.div>
        <p className="mt-5 font-script text-sm tracking-[0.35em] text-gold-deep">
          YOU'RE INVITED
        </p>
      </div>
    </section>
  );
}
