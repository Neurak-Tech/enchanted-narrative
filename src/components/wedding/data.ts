export const COUPLE = {
  groom: "Prajwal",
  bride: "Muskan",
  monogram: "M&P",
  date: { day: "25", month: "NOVEMBER", year: "2026" },
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

export const MILESTONES = [
  {
    key: "meeting",
    year: "2019",
    title: "First Meeting",
    memory:
      "A rainy Tuesday, one shared table, two cups of filter coffee that went cold while we kept talking.",
  },
  {
    key: "travel",
    year: "2022",
    title: "The City That Kept Us",
    memory:
      "Lisbon at midnight. Yellow trams, warm pastel walls, and a promise made on a rooftop.",
  },
  {
    key: "proposal",
    year: "2024",
    title: "The Question",
    memory:
      "A ring hidden inside a bouquet of desert roses. She said yes before the sentence finished.",
  },
  {
    key: "family",
    year: "2025",
    title: "Two Families, One Table",
    memory:
      "Polaroids everywhere, too much food, and laughter that didn't stop until the lights went out.",
  },
] as const;

export const FUNCTIONS = [
  {
    id: "haldi",
    name: "Haldi",
    date: "23 November 2026",
    time: "10:00 AM",
    location: "Chandni Haveli · Garden Courtyard",
    theme: "Marigold & turmeric — wear what you can happily ruin",
  },
  {
    id: "mehendi",
    name: "Mehendi",
    date: "23 November 2026",
    time: "4:00 PM",
    location: "Chandni Haveli · Blue Step Well",
    theme: "Henna, music, and soft peach florals at dusk",
  },
  {
    id: "sangeet",
    name: "Sangeet",
    date: "24 November 2026",
    time: "8:00 PM",
    location: "Rose Sanctuary · Rooftop Stage",
    theme: "Midnight glamour, choreography, and confetti",
  },
  {
    id: "wedding",
    name: "Wedding",
    date: "25 November 2026",
    time: "7:11 AM",
    location: "Amara Palace · Jasmine Mandap",
    theme: "Classic silks, soft gold, seven vows at first light",
  },
  {
    id: "reception",
    name: "Reception",
    date: "25 November 2026",
    time: "7:30 PM",
    location: "Amara Palace · Grand Pavilion",
    theme: "Champagne black tie, chandeliers, last dance",
  },
  {
    id: "brunch",
    name: "Farewell Brunch",
    date: "26 November 2026",
    time: "11:00 AM",
    location: "Moonwater Lake · Lakeside Lawn",
    theme: "Linen whites, sunrise boats, unhurried goodbyes",
  },
] as const;
