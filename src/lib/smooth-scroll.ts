type ScrollToOptions = { immediate?: boolean; duration?: number };

export type SmoothScroll = {
  raf: (time: number) => void;
  destroy: () => void;
  stop?: () => void;
  start?: () => void;
  scroll?: number;
  scrollTo: (target: number, options?: ScrollToOptions) => void;
  on: (event: "scroll", cb: (state: { scroll: number; velocity: number; direction: number }) => void) => void;
  off: (event: "scroll", cb: (state: { scroll: number; velocity: number; direction: number }) => void) => void;
};

type Listener = (instance: SmoothScroll | null) => void;

let instance: SmoothScroll | null = null;
const listeners = new Set<Listener>();

export function setSmoothScroll(next: SmoothScroll | null) {
  instance = next;
  listeners.forEach((fn) => fn(instance));
}

export function getSmoothScroll() {
  return instance;
}

export function onSmoothScroll(fn: Listener) {
  listeners.add(fn);
  fn(instance);
  return () => listeners.delete(fn);
}
