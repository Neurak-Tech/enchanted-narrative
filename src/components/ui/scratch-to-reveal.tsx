"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface ScratchToRevealProps {
  children: ReactNode;
  /** Width of the scratch area, in pixels. */
  width?: number;
  /** Height of the scratch area, in pixels. */
  height?: number;
  /** Radius of the scratching brush, in pixels. */
  brushSize?: number;
  /** Fraction (0–1) that must be cleared before the rest falls away. */
  threshold?: number;
  /** Foil gradient, from top-left to bottom-right. */
  coverFrom?: string;
  coverTo?: string;
  /** Mid highlight for a richer metallic foil. */
  coverMid?: string;
  /** Prompt printed on the foil. Scratched away with everything else. */
  label?: string;
  /** Fired once, when the threshold is crossed. */
  onComplete?: () => void;
  className?: string;
}

/** Sample every 16th pixel: precise to well under a percent, 16× cheaper. */
const SAMPLE_STRIDE = 16;

/**
 * Scratch card: drag the foil away to reveal content. Once enough is cleared,
 * the rest fades off on its own.
 */
export function ScratchToReveal({
  children,
  width = 300,
  height = 200,
  brushSize = 22,
  threshold = 0.55,
  coverFrom = "#95271d",
  coverTo = "#60241e",
  coverMid = "#e77b49",
  label = "Scratch here",
  onComplete,
  className = "",
}: ScratchToRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const moveCount = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const finish = useCallback(() => {
    setRevealed((already) => {
      if (!already) onCompleteRef.current?.();
      return true;
    });
  }, []);

  const getContext = () =>
    canvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return;

    context.globalCompositeOperation = "source-over";

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, coverFrom);
    gradient.addColorStop(0.22, coverMid);
    gradient.addColorStop(0.48, coverTo);
    gradient.addColorStop(0.72, coverMid);
    gradient.addColorStop(1, coverFrom);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // Speckle for foil glitter
    for (let i = 0; i < Math.floor((width * height) / 28); i++) {
      context.fillStyle = `rgba(255,255,255,${Math.random() * 0.22})`;
      context.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }

    context.strokeStyle = "rgba(255, 255, 255, 0.1)";
    context.lineWidth = 4;
    for (let x = -height; x < width; x += 14) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x + height, height);
      context.stroke();
    }

    if (label) {
      context.fillStyle = "rgba(255, 255, 255, 0.88)";
      context.font =
        "600 11px Jost, ui-sans-serif, system-ui, -apple-system, sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(label, width / 2, height / 2);
    }
  }, [width, height, coverFrom, coverTo, coverMid, label]);

  const clearedFraction = () => {
    const canvas = canvasRef.current;
    const context = getContext();
    if (!canvas || !context) return 0;

    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;
    let total = 0;

    for (let i = 3; i < data.length; i += 4 * SAMPLE_STRIDE) {
      total++;
      if ((data[i] ?? 0) < 128) cleared++;
    }

    return total === 0 ? 0 : cleared / total;
  };

  const scratch = (x: number, y: number) => {
    const context = getContext();
    if (!context) return;

    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize * 2;
    context.strokeStyle = "#000";
    context.fillStyle = "#000";

    const from = lastPoint.current ?? { x, y };
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(x, y);
    context.stroke();

    context.beginPath();
    context.arc(x, y, brushSize, 0, Math.PI * 2);
    context.fill();

    lastPoint.current = { x, y };
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (revealed) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPoint.current = null;

    const bounds = event.currentTarget.getBoundingClientRect();
    scratch(event.clientX - bounds.left, event.clientY - bounds.top);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (revealed || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    scratch(event.clientX - bounds.left, event.clientY - bounds.top);

    if (++moveCount.current % 8 === 0 && clearedFraction() >= threshold) {
      finish();
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    lastPoint.current = null;
    if (!revealed && clearedFraction() >= threshold) finish();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    finish();
  };

  return (
    <div
      style={{ width, height }}
      className={cn(
        "relative isolate overflow-hidden rounded-xl border border-gold/50 bg-pearl shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>

      <motion.canvas
        ref={canvasRef}
        role="button"
        tabIndex={revealed ? -1 : 0}
        aria-label={revealed ? "Revealed" : "Scratch to reveal"}
        aria-pressed={revealed}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{ width, height, touchAction: "none" }}
        animate={{ opacity: revealed ? 0 : 1, scale: revealed ? 1.06 : 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: "easeOut" }
        }
        className={cn(
          "absolute inset-0 rounded-[inherit]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          revealed ? "pointer-events-none" : "cursor-crosshair",
        )}
      />
    </div>
  );
}

export default ScratchToReveal;
