export const COUPLE = {
  groom: "Prajwal",
  bride: "Muskan",
  monogram: "M&P",
  date: { day: "25", month: "Nov", year: "2026" },
};

export const COUPLE_PROFILE = {
  bride: {
    traits: [
      "Professional overthinker.",
      "Shopping is her cardio.",
      "Sends Prajwal reels throughout the day — commentary optional, reaction mandatory.",
      "Says “I’m ready” — which generally means 20 minutes more.",
      "Has a reference picture for absolutely everything.",
      "Can turn a 2-minute update into a full-blown story — complete with context, backstory and supporting evidence.",
    ],
  },
  groom: {
    traits: [
      "Has “almost” mastered the art of listening to Muskan’s daily debriefs.",
      "Has a remarkable talent for starting a series and never finishing it.",
      "Can turn almost any conversation into gyaan.",
      "Thinks every argument can be won with logic.",
      "Will say he’s “not hungry” and then eat half of Muskan’s food.",
      "Believes every problem can be solved with the timeless philosophy of “let’s see.”",
      "Can sleep anywhere and anytime.",
    ],
  },
  together: {
    title: "Together?",
    lead: "Somehow, it works.",
    line: "We’re still figuring out whether that’s because we’re perfectly compatible…. or because after 10 years, we’ve simply become very good at negotiating.",
  },
} as const;

/** Stack index 0 = top card; index 4 = bottom. Years 2024–2026 with a few repeats. */
export const KEEPSAKES = [
  {
    year: "2026",
    title: "Happily ever after",
    caption: "Two stories, one forever",
    image: "images/cards/meadow.jpg",
  },
  {
    year: "2026",
    title: "The Families find out",
    caption: "The easiest yes, every single day",
    image: "images/cards/party.jpg",
  },
  {
    year: "2025",
    title: "The Proposal",
    caption: "Two peas in a pod",
    image: "images/cards/embrace.jpg",
  },
  {
    year: "2025",
    title: "Dilwali Diwali",
    caption: "Just two people, a million memories",
    image: "images/cards/night.jpg",
  },
  {
    year: "2024",
    title: "The walk",
    caption: "From stolen glances to forever plans",
    image: "images/cards/rooftop.jpg",
  },
] as const;

export const FUNCTIONS = [
  {
    id: "haldi",
    name: "Halki si Haldi",
    date: "23 Nov",
    time: "11 AM onwards",
    location: "Poolside",
  },
  {
    id: "mehendi",
    name: "Shaam Shandaar",
    date: "23 Nov",
    time: "6 PM onwards",
    location: "Barsana Lawn",
    theme: "Henna, music, and soft peach florals at dusk",
  },
  {
    id: "sangeet",
    name: "Varmala",
    date: "25 Nov",
    time: "2 PM",
    location: "Barsana Lawn",
  },
  {
    id: "wedding",
    name: "Shaadi",
    date: "25 Nov",
    time: "4 PM onwards",
    location: "Barsana Banquet",
  },
  {
    id: "reception",
    name: "The Reception",
    date: "25 Nov",
    time: "7 PM onwards",
    location: "Barsana Lawn",
  }
] as const;
