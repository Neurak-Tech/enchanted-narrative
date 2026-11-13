import { publicAsset } from "@/lib/site";

const TRACK_SRC = publicAsset("music/nachde-ne-saare.mp3");
const VOLUME = 0.38;
const MUTED_KEY = "wedding-music-muted";

let audio: HTMLAudioElement | null = null;
let muted = false;
const listeners = new Set<() => void>();

export function readBackgroundMusicMuted() {
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

function persistMuted(value: boolean) {
  try {
    localStorage.setItem(MUTED_KEY, value ? "1" : "0");
  } catch {
    /* private mode */
  }
}

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeBackgroundMusic(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isBackgroundMusicMuted() {
  return muted;
}

function ensureAudio() {
  if (!audio) {
    audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = "auto";
  }
  return audio;
}

export function applyBackgroundMusicPlayback(nextMuted: boolean) {
  muted = nextMuted;
  persistMuted(nextMuted);
  const track = ensureAudio();
  track.volume = VOLUME;
  if (nextMuted) {
    track.pause();
  } else {
    track.muted = false;
    void track.play().catch(() => {});
  }
  notify();
}

/** Call synchronously from the curtain tap — satisfies autoplay policies. */
export function startBackgroundMusicFromUserGesture() {
  if (readBackgroundMusicMuted()) {
    muted = true;
    notify();
    return;
  }
  applyBackgroundMusicPlayback(false);
}

export function initBackgroundMusicState() {
  muted = readBackgroundMusicMuted();
}

export function destroyBackgroundMusic() {
  if (!audio) return;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  audio = null;
}
