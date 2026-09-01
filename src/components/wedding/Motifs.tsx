import type { ReactNode } from "react";
import { motion, type MotionValue } from "motion/react";

const INK = "currentColor";
const GOLD = "#e77b49";
const PEARL = "#ffffff";
const ROSE = "#b34a44";

function BeatWings({
  up,
  down,
  duration = 0.65,
}: {
  up: string;
  down: string;
  duration?: number;
}) {
  return (
    <motion.path
      animate={{ d: [up, down] }}
      transition={{ duration, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      fill="none"
      stroke={INK}
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  );
}

/** The original journey courier: an envelope with wings. */
export function EnvelopeBird({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="150" height="90" viewBox="0 0 150 90" aria-hidden>
      <BeatWings up="M20 45 C50 5, 90 5, 130 40" down="M20 45 C50 70, 90 70, 130 40" />
      <rect x="58" y="42" width="40" height="26" rx="3" fill={PEARL} stroke={GOLD} />
      <path d="M58 42l20 15 20-15" fill="none" stroke={GOLD} strokeWidth="1.5" />
    </svg>
  );
}

/** Two rings carried on a single pair of wings. */
export function RingCourier({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="148" height="92" viewBox="0 0 148 92" aria-hidden>
      <BeatWings up="M16 50 C50 10, 98 8, 132 48" down="M16 50 C50 82, 98 84, 132 48" duration={0.72} />
      <circle cx="68" cy="54" r="13" fill="none" stroke={GOLD} strokeWidth="2.4" />
      <circle cx="82" cy="54" r="13" fill="none" stroke={INK} strokeWidth="2.2" />
    </svg>
  );
}

/** A lotus that kites through the opening sky. */
export function LotusKite({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="140" height="96" viewBox="0 0 140 96" aria-hidden>
      <BeatWings up="M18 58 C52 18, 88 16, 122 54" down="M18 58 C52 88, 88 90, 122 54" duration={0.8} />
      <path
        d="M70 38c-8 10-10 20-2 28 8-8 18-8 26 0 8-8 6-18-2-28-8 6-16 6-22 0z"
        fill={PEARL}
        stroke={GOLD}
        strokeWidth="1.4"
      />
      <path d="M70 48c4 6 10 8 16 8" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="78" cy="52" r="3" fill={GOLD} />
    </svg>
  );
}

/** A wax-seal letter for the date reveal. */
export function WaxSealBird({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="146" height="90" viewBox="0 0 146 90" aria-hidden>
      <BeatWings up="M18 48 C48 8, 96 8, 128 46" down="M18 48 C48 76, 96 78, 128 46" />
      <rect x="56" y="40" width="36" height="28" rx="2.5" fill={PEARL} stroke={GOLD} />
      <circle cx="74" cy="56" r="8" fill={ROSE} stroke={GOLD} strokeWidth="1.2" />
      <path d="M74 52v8M70 56h8" stroke={PEARL} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/** A compass that maps the wedding grounds. */
export function CompassSwallow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="150" height="94" viewBox="0 0 150 94" aria-hidden>
      <BeatWings up="M20 50 C54 12, 96 10, 130 48" down="M20 50 C54 82, 96 84, 130 48" duration={0.7} />
      <circle cx="75" cy="54" r="16" fill={PEARL} stroke={GOLD} strokeWidth="1.6" />
      <path d="M75 42 L79 54 L75 66 L71 54 Z" fill={GOLD} />
      <path d="M63 54h24M75 42v24" stroke={INK} strokeWidth="0.8" opacity="0.45" />
    </svg>
  );
}

/** A night moth carrying a star. */
export function StarMoth({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="152" height="92" viewBox="0 0 152 92" aria-hidden>
      <BeatWings up="M18 48 C50 6, 100 6, 134 46" down="M18 48 C50 80, 100 82, 134 46" duration={0.55} />
      <path
        d="M76 36 l4.2 10.4 11.2.6-8.6 7.4 2.8 10.8L76 59.4 66.4 65.2l2.8-10.8-8.6-7.4 11.2-.6z"
        fill={PEARL}
        stroke={GOLD}
        strokeWidth="1.2"
      />
    </svg>
  );
}

/** A diya lamp drifting like a moth. */
export function DiyaMoth({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="144" height="92" viewBox="0 0 144 92" aria-hidden>
      <BeatWings up="M16 54 C48 16, 94 14, 126 52" down="M16 54 C48 84, 94 86, 126 52" duration={0.85} />
      <path
        d="M52 62c4 10 36 10 40 0-6-6-12-8-20-8s-14 2-20 8z"
        fill={PEARL}
        stroke={GOLD}
        strokeWidth="1.4"
      />
      <motion.ellipse
        cx="72"
        cy="50"
        rx="5"
        ry="9"
        fill={GOLD}
        animate={{ opacity: [0.55, 1, 0.55], scaleY: [0.85, 1.1, 0.85] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
    </svg>
  );
}

/** A single petal for fall / burst animations. */
export function Petal({
  className = "",
  fill = "#e77b49",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg className={className} width="18" height="24" viewBox="0 0 18 24" aria-hidden>
      <path
        d="M9 1C5.5 6 2 10.5 2 15.5c0 4 3.1 7 7 7s7-3 7-7C16 10.5 12.5 6 9 1z"
        fill={fill}
      />
      <path
        d="M9 4c-.4 4-.6 8-.4 12"
        fill="none"
        stroke="#95271d"
        strokeWidth="0.8"
        opacity="0.55"
      />
    </svg>
  );
}

/** Small five-petal bloom used in celebration falls. */
export function Bloom({
  className = "",
  tone = "blush",
}: {
  className?: string;
  tone?: "blush" | "gold" | "rose";
}) {
  const fills = {
    blush: "#e77b49",
    gold: "#b34a44",
    rose: "#95271d",
  } as const;
  const fill = fills[tone];
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="14"
          cy="9"
          rx="4.2"
          ry="7"
          transform={`rotate(${a} 14 14)`}
          fill={fill}
          opacity="0.92"
        />
      ))}
      <circle cx="14" cy="14" r="3.2" fill="#60241e" />
    </svg>
  );
}

export function HoverFloat({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className ?? ""}`}
      animate={{ y: [0, -12, 0], rotate: [-5, 4, -5] }}
      transition={{ duration: 7.5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Flight({
  children,
  x,
  y,
  opacity,
  className,
}: {
  children: ReactNode;
  x: MotionValue<string>;
  y: MotionValue<string>;
  opacity: MotionValue<number>;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      style={{ x, y, opacity }}
      className={`pointer-events-none absolute z-30 ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
