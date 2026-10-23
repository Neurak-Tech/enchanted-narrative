import { useState } from "react";
import { motion } from "motion/react";
import drinksIcon from "@/assets/drinks.png";
import garlandIcon from "@/assets/garland.png";
import danceIcon from "@/assets/dance.png";
import varmalaIcon from "@/assets/wedding.png";
import hinduWeddingIcon from "@/assets/hindu-wedding.png";
import receptionIcon from "@/assets/wedding1.png";
import { FUNCTIONS } from "./data";
import { PulsingHeart } from "./Motifs";
import { ActSection } from "./ActSection";
import { cn } from "@/lib/utils";

const EVENT_ICONS: Record<(typeof FUNCTIONS)[number]["id"], string> = {
  haldi: varmalaIcon,
  mehendi: danceIcon,
  sangeet: garlandIcon,
  wedding: hinduWeddingIcon,
  reception: receptionIcon,
};

function FunctionEventIcon({ id }: { id: (typeof FUNCTIONS)[number]["id"] }) {
  const src = EVENT_ICONS[id];

  return (
    <span
      aria-hidden
      className="mx-auto block h-11 w-11 shrink-0 bg-[#f6d98a] [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center]"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
      }}
    />
  );
}

function FunctionCard({
  id,
  name,
  date,
  time,
  location,
  className,
}: (typeof FUNCTIONS)[number] & { className?: string }) {
  const [flipped, setFlipped] = useState(false);
  const icon = <FunctionEventIcon id={id} />;

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `${name}, ${date} at ${time}. Venue: ${location}. Click to flip back.`
          : `${name}. Click for the date, time, and venue.`
      }
      className={cn(
        "group relative h-[11.5rem] w-full cursor-pointer perspective-[1200px] text-center sm:h-[14rem]",
        className,
      )}
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
          <div>{icon}</div>
          <h3 className="font-display text-2xl leading-none text-ink sm:text-3xl">{name}</h3>
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
          <div>{icon}</div>
          <div className="space-y-3">
            <div>
              <p className="font-display text-lg leading-none text-foil sm:text-xl">{date}</p>
              <p className="mt-1 text-[0.7rem] leading-snug text-ink/80 sm:text-sm">{time}</p>
            </div>
            <div>
              <p className="tracking-luxe text-[0.5rem] uppercase text-muted-foreground sm:text-[0.55rem]">
                Venue
              </p>
              <p className="mt-1 font-display text-base leading-snug text-ink sm:text-xl">{location}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </button>
  );
}

export default function ActFunctions() {
  return (
    <ActSection tone="light-dusk" className="overflow-hidden px-4 pb-44 pt-28 sm:pb-56 sm:pt-36">
      <PulsingHeart className="right-6 top-14 z-10 sm:right-12 sm:top-16" />

      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <h2 className="font-display text-4xl leading-tight text-ink sm:text-6xl">
          Wedding <span className="italic text-foil">Itinerary</span>
        </h2>
        <p className="tracking-luxe mt-2 text-[0.75rem] uppercase text-muted-foreground/70 sm:text-[0.55rem]">
        Two Days, Unlimited Fun
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-10">
        {FUNCTIONS.map((fn) => (
          <FunctionCard
            key={fn.id}
            {...fn}
            className={
              fn.id === "reception"
                ? "col-span-2 justify-self-center w-[calc((100%-0.75rem)/2)] sm:col-span-1 sm:w-full sm:justify-self-auto"
                : undefined
            }
          />
        ))}
      </div>
    </ActSection>
  );
}
