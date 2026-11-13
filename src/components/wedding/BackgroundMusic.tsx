import { useEffect, useState, type MouseEvent } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  applyBackgroundMusicPlayback,
  destroyBackgroundMusic,
  initBackgroundMusicState,
  isBackgroundMusicMuted,
  subscribeBackgroundMusic,
} from "@/lib/background-music";

export function BackgroundMusic({ visible = true }: { visible?: boolean }) {
  const [muted, setMuted] = useState(() => {
    initBackgroundMusicState();
    return isBackgroundMusicMuted();
  });

  useEffect(() => {
    return subscribeBackgroundMusic(() => {
      setMuted(isBackgroundMusicMuted());
    });
  }, []);

  useEffect(() => () => destroyBackgroundMusic(), []);

  const onToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    applyBackgroundMusicPlayback(!isBackgroundMusicMuted());
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Turn on background music" : "Turn off background music"}
      aria-pressed={!muted}
      className={cn(
        "pointer-events-auto fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-[220]",
        !visible && "pointer-events-none opacity-0",
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
