import { COUPLE } from "./data";

export default function ActEnd() {
  return (
    <section
      style={{ background: "var(--gradient-night)" }}
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 py-28 text-center sm:min-h-[80vh] sm:py-36"
    >
      <p className="tracking-luxe text-[0.6rem] uppercase text-pearl/55 sm:text-xs">The End — And The Beginning</p>
      <p className="font-script mt-8 text-6xl text-pearl sm:text-8xl">{COUPLE.monogram}</p>
      <p className="tracking-luxe mt-6 text-[0.6rem] uppercase text-gold sm:text-xs">
        {COUPLE.date.day} {COUPLE.date.month} {COUPLE.date.year}
      </p>
      <p className="font-display mx-auto mt-10 max-w-md text-xl text-pearl/80 sm:text-2xl">
        &ldquo;Come for the vows. Stay for the dancing. Leave with a story.&rdquo;
      </p>
      <p className="tracking-luxe mt-14 text-[0.55rem] uppercase text-pearl/40 sm:text-[0.6rem]">
        Hover or click anywhere for petals &amp; fireworks
      </p>
    </section>
  );
}
