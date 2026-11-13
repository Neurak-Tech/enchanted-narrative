import { publicAsset } from "@/lib/site";

const DRUMROLL_SRC = publicAsset("music/drumroll.mp3");

let drumroll: HTMLAudioElement | null = null;
let needsGesture = false;

/** One-shot suspense roll while the curtain is waiting for tap (no loop). */
export function startCurtainDrumroll() {
  if (drumroll && !drumroll.paused) return;
  stopCurtainDrumroll();
  const audio = new Audio(DRUMROLL_SRC);
  audio.loop = false;
  audio.preload = "auto";
  audio.volume = 0.58;
  drumroll = audio;
  void audio.play().then(() => {
    needsGesture = false;
  }).catch(() => {
    needsGesture = true;
  });
}

/** Browsers often block autoplay — call from first pre-reveal pointerdown. */
export function startCurtainDrumrollFromGesture() {
  if (!needsGesture && drumroll && !drumroll.paused) return;
  startCurtainDrumroll();
}

export function stopCurtainDrumroll() {
  if (!drumroll) return;
  drumroll.pause();
  drumroll.removeAttribute("src");
  drumroll.load();
  drumroll = null;
}
