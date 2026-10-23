import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ScrollChevron({
  className,
  label = "Scroll to continue",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)} aria-hidden>
      <motion.svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[#f6d98a]"
        animate={{ opacity: [0.45, 1, 0.45], y: [0, 5, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M7 10l5 5 5-5M7 15l5 5 5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Anchored to the bottom of an act section. */
export function ActScrollHint({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex justify-center",
        className,
      )}
    >
      <ScrollChevron />
    </div>
  );
}
