import { cn } from "@/lib/utils";

function seamGradient(from: string, to: string, dramatic?: boolean) {
  if (dramatic) {
    return `linear-gradient(180deg, ${from} 0%, color-mix(in srgb, ${from} 55%, ${to}) 22%, color-mix(in srgb, ${from} 18%, ${to}) 48%, color-mix(in srgb, ${from} 5%, ${to}) 74%, ${to} 100%)`;
  }
  return `linear-gradient(180deg, ${from} 0%, color-mix(in srgb, ${from} 72%, ${to}) 38%, color-mix(in srgb, ${from} 28%, ${to}) 72%, ${to} 100%)`;
}

/** Gradient strip between acts — content never sits on this, only solid section colors below. */
export function ActSeam({
  from,
  to,
  dramatic,
}: {
  from: string;
  to: string;
  /** Taller strip + stronger curve (e.g. blush → red finale). */
  dramatic?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("act-seam", dramatic && "act-seam--dramatic")}
      style={{ background: seamGradient(from, to, dramatic) }}
    />
  );
}
