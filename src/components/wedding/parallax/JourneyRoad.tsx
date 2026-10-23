import { motion, useTransform, type MotionValue } from "motion/react";

/** Ground lane behind both apartments (landscape z 0, road z 5, gates z 10+). */
export function JourneyRoad({ progress }: { progress: MotionValue<number> }) {
  const dashFar = useTransform(progress, [0, 1], ["0%", "-18%"]);
  const dashNear = useTransform(progress, [0, 1], ["0%", "-28%"]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
    <div
      className="absolute inset-x-0 bottom-0 z-[5] h-[22vh] w-full sm:h-[22vh] md:h-[20vh]"
    >
      <svg
        viewBox="0 0 400 110"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 100%)",
        }}
      >
        <defs>
          <linearGradient id="road-shoulder" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfe6c4" stopOpacity="0" />
            <stop offset="40%" stopColor="#7d9460" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4f6240" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="road-surface" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a5644" />
            <stop offset="18%" stopColor="#5c6a52" />
            <stop offset="50%" stopColor="#6d7c62" />
            <stop offset="82%" stopColor="#5c6a52" />
            <stop offset="100%" stopColor="#4a5644" />
          </linearGradient>
        </defs>
        <path d="M0 6 L400 6 L400 110 L0 110 Z" fill="url(#road-shoulder)" />
        <path d="M0 16 L400 16 L400 110 L0 110 Z" fill="url(#road-surface)" />
        <path d="M0 20 L400 20" fill="none" stroke="#fffaf2" strokeWidth="1.1" opacity="0.65" />
      </svg>

      <div className="absolute inset-x-0 bottom-[42%] h-px overflow-hidden opacity-80">
        <motion.div
          style={{ x: dashFar }}
          className="h-full w-[220%] bg-[repeating-linear-gradient(90deg,#fffaf2_0_7px,transparent_7px_20px)]"
        />
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-[2.5%] z-[26] h-[3px] overflow-hidden">
      <motion.div
        style={{ x: dashNear }}
        className="h-full w-[220%] bg-[repeating-linear-gradient(90deg,#fffaf2_0_14px,transparent_14px_36px)]"
      />
    </div>
    </div>
  );
}
