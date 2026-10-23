import logoWhite from "@/assets/logo-white.png";
import { COUPLE } from "./data";
import { ActSection } from "./ActSection";
import { PulsingHeart } from "./Motifs";

export default function ActEnd() {
  return (
    <ActSection
      tone="night"
      scrollHint={false}
      className="flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-28 text-center sm:min-h-[80vh] sm:pb-24 sm:pt-36"
    >
      <img
        src={logoWhite}
        alt={`${COUPLE.bride} & ${COUPLE.groom}`}
        width={1200}
        height={1200}
        draggable={false}
        className="mx-auto w-[min(88vw,18rem)] max-w-md object-contain sm:w-[22rem]"
      />
      <p className="tracking-luxe mt-6 text-[0.6rem] uppercase text-gold sm:text-xs">
        24 & 25 Nov, 2026 | Barsana Hotel, Siliguri
      </p>
      <p className="font-display mx-auto mt-10 max-w-md text-xl text-pearl/80 sm:text-2xl">
     Come for the Shaadi, Stay for the fun!<br/>   We can't wait to celebrate with you
      
      </p>
      <p className="font-display mx-auto mt-10 max-w-md text-md text-pearl/80 sm:text-2xl italic">
      With Love,<br/>
      Lohia & Choudhary Family
      </p>

      <PulsingHeart
        className="bottom-10  z-10 sm:bottom-12 "
        delay={0.3}
      />
    </ActSection>
  );
}
