import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COUPLE } from "./data";

function ScratchPanel({
  label,
  value,
  onDone,
  done,
}: {
  label: string;
  value: string;
  onDone: () => void;
  done: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const finished = useRef(false);
  const [flakes, setFlakes] = useState<{ id: number; x: number; y: number }[]>([]);

  const paintFoil = useCallback(() => {
    const c = canvasRef.current;
    const wrap = wrapRef.current;
    if (!c || !wrap) return;
    const { width, height } = wrap.getBoundingClientRect();
    c.width = width;
    c.height = height;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#c9a44c");
    g.addColorStop(0.2, "#f4e3ae");
    g.addColorStop(0.42, "#b8892f");
    g.addColorStop(0.6, "#fbf1d2");
    g.addColorStop(0.8, "#c69b3f");
    g.addColorStop(1, "#e8cf92");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.18})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
    }
  }, []);

  useEffect(() => {
    paintFoil();
    const ro = new ResizeObserver(() => !finished.current && paintFoil());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [paintFoil]);

  const scratch = (clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c || finished.current) return;
    const r = c.getBoundingClientRect();
    const x = clientX - r.left;
    const y = clientY - r.top;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 34, 0, Math.PI * 2);
    ctx.fill();
    if (Math.random() > 0.55) {
      const id = Math.random();
      setFlakes((f) => [...f.slice(-14), { id, x, y }]);
      setTimeout(() => setFlakes((f) => f.filter((k) => k.id !== id)), 900);
    }
    if (Math.random() > 0.8) {
      const img = ctx.getImageData(0, 0, c.width, c.height).data;
      let clear = 0;
      for (let i = 3; i < img.length; i += 64) if (img[i] === 0) clear++;
      if (clear / (img.length / 64) > 0.45) {
        finished.current = true;
        ctx.clearRect(0, 0, c.width, c.height);
        onDone();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-[0.62rem] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <div
        ref={wrapRef}
        className="relative h-52 w-52 select-none overflow-hidden rounded-[1.75rem] border border-gold/50 bg-pearl shadow-[var(--shadow-soft)] sm:h-64 sm:w-64"
        onPointerDown={(e) => {
          drawing.current = true;
          (e.target as Element).setPointerCapture?.(e.pointerId);
          scratch(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => drawing.current && scratch(e.clientX, e.clientY)}
        onPointerUp={() => (drawing.current = false)}
        onPointerLeave={() => (drawing.current = false)}
        style={{ touchAction: "none", cursor: done ? "default" : "grab" }}
      >
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_30%,oklch(0.99_0.01_90),oklch(0.94_0.025_80))]">
          <motion.span
            animate={done ? { scale: [0.9, 1.06, 1], opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="px-3 text-center font-display text-[clamp(1.6rem,5vw,3.2rem)] leading-none text-foil [text-shadow:0_1px_0_oklch(1_0_0),0_-1px_1px_oklch(0.7_0.05_80)]"
          >
            {value}
          </motion.span>
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <AnimatePresence>
          {flakes.map((f) => (
            <motion.span
              key={f.id}
              initial={{ opacity: 1, x: f.x, y: f.y, scale: 1 }}
              animate={{ opacity: 0, y: f.y + 70, x: f.x + (Math.random() - 0.5) * 70, rotate: 200 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="pointer-events-none absolute left-0 top-0 h-1.5 w-1.5 rounded-[1px] bg-foil"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Eruption() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40">
      {Array.from({ length: 90 }).map((_, i) => {
        const kind = i % 3;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: "50vw", y: "55vh", scale: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: `${50 + (Math.random() - 0.5) * 120}vw`,
              y: `${20 + Math.random() * 90}vh`,
              scale: [0, 1, 0.9],
              rotate: Math.random() * 720,
            }}
            transition={{ duration: 2.4 + Math.random() * 2, delay: Math.random() * 0.6, ease: "easeOut" }}
            className={
              kind === 0
                ? "absolute h-2.5 w-1.5 bg-foil"
                : kind === 1
                  ? "absolute h-3 w-2 rounded-[100%_0_100%_0] bg-blush"
                  : "absolute h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_12px_var(--gold)]"
            }
          />
        );
      })}
    </div>
  );
}

export default function ActDate() {
  const [done, setDone] = useState<{ day?: boolean; month?: boolean; year?: boolean }>({});
  const all = !!(done.day && done.month && done.year);
  const [erupt, setErupt] = useState(false);

  useEffect(() => {
    if (!all) return;
    setErupt(true);
    const t = setTimeout(() => setErupt(false), 4200);
    return () => clearTimeout(t);
  }, [all]);

  return (
    <section
      id="act-2"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,oklch(0.94_0.045_25)_0%,oklch(0.97_0.018_80)_45%,oklch(0.93_0.03_75)_100%)] px-6 py-28"
    >
      <p className="text-[0.7rem] uppercase tracking-luxe text-muted-foreground">
        Act Two — Unlock the Date
      </p>
      <h2 className="mt-6 max-w-xl text-center font-display text-[clamp(2rem,5vw,3.6rem)] leading-tight">
        Scratch the gold. <span className="italic text-foil">Find the day.</span>
      </h2>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-14">
        <ScratchPanel
          label="Day"
          value={COUPLE.date.day}
          done={!!done.day}
          onDone={() => setDone((d) => ({ ...d, day: true }))}
        />
        <ScratchPanel
          label="Month"
          value={COUPLE.date.month}
          done={!!done.month}
          onDone={() => setDone((d) => ({ ...d, month: true }))}
        />
        <ScratchPanel
          label="Year"
          value={COUPLE.date.year}
          done={!!done.year}
          onDone={() => setDone((d) => ({ ...d, year: true }))}
        />
      </div>

      <AnimatePresence>
        {all && (
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 text-center"
          >
            <h3 className="font-display text-[clamp(2rem,6.5vw,5rem)] italic leading-none text-foil">
              The Day Our Forever Begins
            </h3>
            <div className="mt-6 flex items-center justify-center gap-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.4, 0.9, 0.3] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.12 }}
                  className="h-8 w-[3px] rounded-full bg-gold-deep/70"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!all && (
        <p className="mt-14 animate-pulse text-xs uppercase tracking-[0.3em] text-muted-foreground">
          drag across each panel
        </p>
      )}
      {erupt && <Eruption />}
    </section>
  );
}
