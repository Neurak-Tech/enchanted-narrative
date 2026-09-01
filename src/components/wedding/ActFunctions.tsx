import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { FUNCTIONS } from "./data";
import { HoverFloat, LotusKite } from "./Motifs";

const GOLD = "#e77b49";
const BRICK = "#95271d";
const ROSE = "#b34a44";

function IconHaldi() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-ink">
      <ellipse cx="22" cy="30" rx="14" ry="6" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 30c2-10 8-16 14-16s12 6 14 16" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="22" cy="18" r="3.2" fill={GOLD} />
      <path d="M16 14c2 3 4 4 6 4M28 14c-2 3-4 4-6 4" fill="none" stroke={ROSE} strokeWidth="1.2" />
      <path d="M22 10v4" stroke={BRICK} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconMehendi() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-ink">
      <path
        d="M22 6c-3 6-8 10-8 18 0 6 3.5 12 8 14 4.5-2 8-8 8-14 0-8-5-12-8-18z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M22 14c-2 4-3 8-2 14M18 20c3 1 5 1 8 0" fill="none" stroke={GOLD} strokeWidth="1.2" />
      <circle cx="22" cy="24" r="2" fill={ROSE} />
      <path d="M16 28c4 2 8 2 12 0" fill="none" stroke={BRICK} strokeWidth="1" />
    </svg>
  );
}

function IconSangeet() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-ink">
      <ellipse cx="14" cy="30" rx="7" ry="5" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <ellipse cx="30" cy="26" rx="6" ry="4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M21 30V12l16-4v18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M21 16l16-4" stroke={ROSE} strokeWidth="1.2" />
      <circle cx="14" cy="30" r="1.8" fill={BRICK} />
      <circle cx="30" cy="26" r="1.6" fill={GOLD} />
    </svg>
  );
}

function IconWedding() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-ink">
      <path d="M8 34 L22 10 L36 34" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 34h20" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="18" cy="24" r="5.5" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="26" cy="24" r="5.5" fill="none" stroke={ROSE} strokeWidth="1.4" />
      <path d="M22 10v4" stroke={BRICK} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconReception() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-ink">
      <path d="M16 12h12l2 8H14l2-8z" fill="none" stroke={GOLD} strokeWidth="1.4" />
      <path d="M18 20c0 8 2 12 4 14 2-2 4-6 4-14" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M14 36h16" stroke={ROSE} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M22 8v4M18 9l2 3M26 9l-2 3" stroke={BRICK} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="22" cy="28" r="1.6" fill={GOLD} />
    </svg>
  );
}

function IconBrunch() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="text-ink">
      <circle cx="22" cy="18" r="7" fill="none" stroke={GOLD} strokeWidth="1.5" />
      <path d="M22 6v3M22 27v3M10 18h3M31 18h3M13 9l2 2M31 9l-2 2M13 27l2-2M31 27l-2-2" stroke={ROSE} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 36c2-6 6-8 8-8s6 2 8 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M18 36h8" stroke={BRICK} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<(typeof FUNCTIONS)[number]["id"], ReactNode> = {
  haldi: <IconHaldi />,
  mehendi: <IconMehendi />,
  sangeet: <IconSangeet />,
  wedding: <IconWedding />,
  reception: <IconReception />,
  brunch: <IconBrunch />,
};

function FunctionCard({
  id,
  name,
  date,
  time,
  location,
  theme,
}: (typeof FUNCTIONS)[number]) {
  const [flipped, setFlipped] = useState(false);
  const icon = ICONS[id];

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `${name}: ${location}. ${theme}. Click to flip back.`
          : `${name}, ${date} at ${time}. Click for location and theme.`
      }
      className="group relative h-[11.5rem] w-full cursor-pointer perspective-[1200px] text-center sm:h-[14rem]"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front — transparent */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between bg-transparent p-2 sm:p-3"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="text-foil">{icon}</div>
          <div>
            <h3 className="font-display text-2xl leading-none text-ink sm:text-3xl">{name}</h3>
            <p className="mt-2 text-[0.7rem] leading-snug text-ink/65 sm:text-sm">{date}</p>
            <p className="mt-0.5 font-display text-lg text-foil sm:text-xl">{time}</p>
          </div>
          <p className="tracking-luxe text-[0.5rem] uppercase text-muted-foreground/70 sm:text-[0.55rem]">
            Tap for details
          </p>
        </div>

        {/* Back — transparent */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-between bg-transparent p-2 sm:p-3"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-foil">{icon}</div>
          <div className="space-y-3">
            <div>
              <p className="tracking-luxe text-[0.5rem] uppercase text-muted-foreground sm:text-[0.55rem]">
                Location
              </p>
              <p className="mt-1 font-display text-base leading-snug text-ink sm:text-xl">{location}</p>
            </div>
            <div>
              <p className="tracking-luxe text-[0.5rem] uppercase text-muted-foreground sm:text-[0.55rem]">
                Theme
              </p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-ink/70 sm:text-sm">{theme}</p>
            </div>
          </div>
          <p className="tracking-luxe text-[0.5rem] uppercase text-muted-foreground/70 sm:text-[0.55rem]">
            Tap to flip back
          </p>
        </div>
      </motion.div>
    </button>
  );
}

export default function ActFunctions() {
  return (
    <section
      style={{ background: "var(--gradient-dawn)" }}
      className="relative overflow-hidden px-4 py-28 sm:py-36"
    >
      <HoverFloat className="right-3 top-12 z-10 text-ink sm:right-10 sm:top-16">
        <LotusKite />
      </HoverFloat>

      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="tracking-luxe text-[0.6rem] uppercase text-muted-foreground sm:text-xs">
          Act Six — The Celebrations
        </p>
        <h2 className="font-display mt-3 text-4xl leading-tight text-ink sm:text-6xl">
          Wedding <span className="italic text-foil">Functions</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Six moments across three days. Flip a card for where to go and what to wear.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-10">
        {FUNCTIONS.map((fn) => (
          <FunctionCard key={fn.id} {...fn} />
        ))}
      </div>
    </section>
  );
}
