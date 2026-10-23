export const COUPLE = {
  groom: "Prajwal",
  bride: "Muskan",
  monogram: "M&P",
  date: { day: "25", month: "Nov", year: "2026" },
};

export const COUPLE_PROFILE = {
  bride: {
    role: "The one who makes it magic",
    traits: ["Laughs too loud", "Reads two books at once", "Said yes instantly", "Collects postcards"],
  },
  groom: {
    role: "The one who plans everything twice",
    traits: ["Makes terrible puns", "Can't cook rice", "Cried first", "Secretly a dancer"],
  },
} as const;

export const KEEPSAKES = [
  {
    year: "2019",
    title: "Filter coffee, still talking",
    caption: "The cups went cold. We did not.",
    scene: "coffee" as const,
  },
  {
    year: "2022",
    title: "Lisbon after midnight",
    caption: "Yellow trams. A rooftop promise.",
    scene: "city" as const,
  },
  {
    year: "2024",
    title: "Desert roses",
    caption: "She said yes before the sentence finished.",
    scene: "ring" as const,
  },
  {
    year: "2025",
    title: "One table",
    caption: "Polaroids, too much food, lights out late.",
    scene: "family" as const,
  },
  {
    year: "2026",
    title: "The walk",
    caption: "Two stories. One forever.",
    scene: "us" as const,
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
    name: "Sacred Vows",
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
