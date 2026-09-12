import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ActTone =
  | "meadow"
  | "light"
  | "warm"
  | "warm-soft"
  | "light-dusk"
  | "night";

export const SEAM = {
  meadow: "var(--seam-meadow)",
  blush: "var(--seam-blush)",
  coral: "var(--seam-coral)",
  peach: "var(--seam-peach)",
  terra: "var(--seam-terra)",
  dust: "var(--seam-dust)",
  cream: "var(--seam-cream)",
  peachWash: "var(--seam-peach-wash)",
  ending: "var(--seam-ending)",
} as const;

export const BODY: Record<ActTone, string> = {
  meadow: SEAM.meadow,
  light: SEAM.blush,
  warm: SEAM.coral,
  "warm-soft": SEAM.peachWash,
  "light-dusk": SEAM.blush,
  night: SEAM.ending,
};

export const ActSection = forwardRef<
  HTMLElement,
  {
    id?: string;
    tone: ActTone;
    className?: string;
    style?: CSSProperties;
    children: ReactNode;
  }
>(function ActSection({ id, tone, className, style, children }, ref) {
  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative", className)}
      style={{ backgroundColor: BODY[tone], ...style }}
    >
      {children}
    </section>
  );
});
