import { motion } from "motion/react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./Stack.css";

const FLY = [
  { x: 160, y: -48, rotate: 14 },
  { x: -150, y: 28, rotate: -16 },
  { x: 56, y: 130, rotate: 11 },
  { x: -72, y: -120, rotate: -18 },
  { x: 132, y: 72, rotate: 18 },
  { x: -48, y: 110, rotate: -9 },
  { x: 36, y: -140, rotate: 8 },
  { x: -140, y: -32, rotate: -12 },
] as const;

const OUT_S = 0.38;
const SETTLE_S = 0.32;
const EASE = [0.25, 0.9, 0.35, 1] as const;

type CardItem = { id: number; content: ReactNode; restRotate: number };
type Dir = (typeof FLY)[number];
type Flight = { id: number; dir: Dir; phase: "out" | "in" };

export type StackHandle = {
  next: () => Promise<boolean>;
  prev: () => Promise<boolean>;
  reset: (to: "first" | "last") => void;
  isBusy: () => boolean;
  frontIndex: () => number;
};

export type StackProps = {
  randomRotation?: boolean;
  cards: ReactNode[];
  onFrontChange?: (frontIndex: number) => void;
};

function buildStack(cards: ReactNode[], randomRotation: boolean): CardItem[] {
  return cards.map((content, index) => ({
    id: index + 1,
    content,
    restRotate: randomRotation ? ((index * 37) % 100) / 10 - 5 : 0,
  }));
}

/** Rotate so `cursor` (0-based card index) sits on top. Order is 1 → 2 → 3 … */
function stackAt(cards: ReactNode[], randomRotation: boolean, cursor: number): CardItem[] {
  const base = buildStack(cards, randomRotation);
  if (!base.length) return base;
  const stack = [...base].reverse();
  const turns = ((cursor % stack.length) + stack.length) % stack.length;
  for (let k = 0; k < turns; k++) {
    const top = stack.pop();
    if (top) stack.unshift(top);
  }
  return stack;
}

function stackedRotate(card: CardItem, index: number, length: number) {
  return (length - index - 1) * 4 + card.restRotate;
}

function stackedScale(index: number, length: number) {
  return 1 + index * 0.06 - length * 0.06;
}

function pickDir() {
  return FLY[Math.floor(Math.random() * FLY.length)]!;
}

function StackCard({
  card,
  index,
  stackLength,
  flight,
  onPhaseComplete,
}: {
  card: CardItem;
  index: number;
  stackLength: number;
  flight: Flight | null;
  onPhaseComplete?: (id: number, phase: Flight["phase"]) => void;
}) {
  const active = flight?.id === card.id;
  const leaving = active && flight.phase === "out";
  const settling = active && flight.phase === "in";
  const dir = active ? flight.dir : null;

  return (
    <motion.div className="rb-stack__layer" style={{ zIndex: leaving ? 30 : index }}>
      <motion.div
        className="rb-stack__card"
        animate={{
          x: leaving ? (dir?.x ?? 0) : 0,
          y: leaving ? (dir?.y ?? 0) : 0,
          rotateZ: stackedRotate(card, index, stackLength) + (leaving ? (dir?.rotate ?? 0) : 0),
          scale: leaving ? 1.04 : stackedScale(index, stackLength),
        }}
        initial={false}
        transition={{ duration: leaving ? OUT_S : SETTLE_S, ease: EASE }}
        onAnimationComplete={() => {
          if (!active) return;
          if (leaving || settling) onPhaseComplete?.(card.id, flight.phase);
        }}
      >
        {card.content}
      </motion.div>
    </motion.div>
  );
}

const Stack = forwardRef<StackHandle, StackProps>(function Stack(
  { randomRotation = true, cards, onFrontChange },
  ref,
) {
  const [stack, setStack] = useState<CardItem[]>(() => stackAt(cards, randomRotation, 0));
  const [flight, setFlight] = useState<Flight | null>(null);
  const stackRef = useRef(stack);
  const busyRef = useRef(false);
  const phaseWaitRef = useRef<((value: void) => void) | null>(null);
  const pendingPhaseRef = useRef<{ id: number; phase: Flight["phase"] } | null>(null);
  const liveRef = useRef(true);

  stackRef.current = stack;
  const cardCount = cards.length;

  useEffect(() => {
    setStack(stackAt(cards, randomRotation, 0));
    setFlight(null);
    busyRef.current = false;
  }, [cardCount, randomRotation, cards]);

  useEffect(() => {
    liveRef.current = true;
    return () => {
      liveRef.current = false;
      phaseWaitRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (flight?.phase === "out") return;
    const front = stack[stack.length - 1];
    if (front) onFrontChange?.(front.id - 1);
  }, [stack, flight, onFrontChange]);

  const waitPhase = (id: number, phase: Flight["phase"]) =>
    new Promise<void>((resolve) => {
      pendingPhaseRef.current = { id, phase };
      phaseWaitRef.current = resolve;
      window.setTimeout(() => {
        if (phaseWaitRef.current === resolve) {
          phaseWaitRef.current = null;
          pendingPhaseRef.current = null;
          resolve();
        }
      }, (phase === "out" ? OUT_S : SETTLE_S) * 1000 + 80);
    });

  const onPhaseComplete = (id: number, phase: Flight["phase"]) => {
    const pending = pendingPhaseRef.current;
    if (!pending || pending.id !== id || pending.phase !== phase) return;
    const resolve = phaseWaitRef.current;
    if (resolve) {
      phaseWaitRef.current = null;
      pendingPhaseRef.current = null;
      resolve();
    }
  };

  const send = async (forward: boolean) => {
    const current = stackRef.current;
    if (current.length < 2 || busyRef.current) return false;

    const front = current[current.length - 1];
    const back = current[0];
    if (!front || !back) return false;
    if (forward && front.id === cardCount) return false;
    if (!forward && front.id === 1) return false;

    busyRef.current = true;
    const dir = pickDir();
    const moving = forward ? front : back;

    setFlight({ id: moving.id, dir, phase: "out" });
    await waitPhase(moving.id, "out");
    if (!liveRef.current) return false;

    setStack((prev) => {
      const next = [...prev];
      const i = next.findIndex((c) => c.id === moving.id);
      if (i < 0) return prev;
      const card = next.splice(i, 1)[0];
      if (!card) return prev;
      if (forward) next.unshift(card);
      else next.push(card);
      return next;
    });

    setFlight({ id: moving.id, dir, phase: "in" });
    await waitPhase(moving.id, "in");
    if (!liveRef.current) return false;
    setFlight(null);
    busyRef.current = false;
    return true;
  };

  useImperativeHandle(ref, () => ({
    next: () => send(true),
    prev: () => send(false),
    reset: (to) => {
      phaseWaitRef.current = null;
      pendingPhaseRef.current = null;
      busyRef.current = false;
      setFlight(null);
      setStack(stackAt(cards, randomRotation, to === "first" ? 0 : Math.max(0, cardCount - 1)));
    },
    isBusy: () => busyRef.current,
    frontIndex: () => {
      const front = stackRef.current[stackRef.current.length - 1];
      return front ? front.id - 1 : 0;
    },
  }));

  if (!cardCount) return null;

  return (
    <div className="rb-stack">
      {stack.map((card, index) => (
        <StackCard
          key={card.id}
          card={card}
          index={index}
          stackLength={stack.length}
          flight={flight}
          onPhaseComplete={onPhaseComplete}
        />
      ))}
    </div>
  );
});

export default Stack;
