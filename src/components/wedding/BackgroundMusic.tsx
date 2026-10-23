import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { publicAsset } from "@/lib/site";
import { cn } from "@/lib/utils";

const TRACK_SRC = publicAsset("music/nachde-ne-saare.mp3");
const VOLUME = 0.38;
const MUTED_KEY = "wedding-music-muted";

function readMutedPreference() {
  try {
    return localStorage.getItem(MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

function persistMutedPreference(muted: boolean) {
  try {
    localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
  } catch {
    /* private mode */
  }
}

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(readMutedPreference);

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.volume = VOLUME;
    audio.preload = "auto";
    audioRef.current = audio;

    const playIfAllowed = () => {
      if (readMutedPreference()) return;
      void audio.play().catch(() => {});
    };

    playIfAllowed();

    const unlock = () => playIfAllowed();
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true, passive: true });
    document.addEventListener("keydown", unlock, { once: true });

    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("keydown", unlock);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    persistMutedPreference(muted);
    if (muted) {
      audio.pause();
    } else {
      void audio.play().catch(() => {});
    }
  }, [muted]);

  return (
    <button
      type="button"
      onClick={() => setMuted((m) => !m)}
      aria-label={muted ? "Turn on background music" : "Turn off background music"}
      aria-pressed={!muted}
      className={cn(
        "fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-[100]",
        "flex h-10 w-10 items-center justify-center rounded-full",
        "border border-[#f6d98a]/35 bg-[#95271d]/85 text-[#f6d98a] shadow-md backdrop-blur-sm",
        "transition-colors hover:border-[#f6d98a]/60 hover:bg-[#95271d]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d98a]/70",
      )}
    >
      {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
    </button>
  );
}
