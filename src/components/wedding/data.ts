export const COUPLE = {
  groom: "Aarav",
  bride: "Meera",
  monogram: "A&M",
  date: { day: "25", month: "NOVEMBER", year: "2026" },
};

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

export const EVENTS = [
  {
    id: "haldi",
    name: "Haldi",
    time: "23 Nov · 10:00 AM",
    x: 24,
    y: 55,
    dress: "Marigold & ivory linens",
    desc: "Turmeric, drums and sunlight in the garden courtyard.",
    note: "Wear what you can happily ruin.",
  },
  {
    id: "mandap",
    name: "The Wedding",
    time: "25 Nov · 7:11 AM",
    x: 25,
    y: 24,
    dress: "Classic silks, soft gold",
    desc: "Seven vows beneath a jasmine mandap at first light.",
    note: "Please arrive by 6:40 AM.",
  },
  {
    id: "stage",
    name: "Sangeet Stage",
    time: "24 Nov · 8:00 PM",
    x: 51,
    y: 14,
    dress: "Midnight glamour",
    desc: "Choreography, chaos, and an unreasonable amount of confetti.",
    note: "Dance floor opens at 10.",
  },
  {
    id: "dining",
    name: "Dining Pavilion",
    time: "All days · 12:00 PM",
    x: 76,
    y: 30,
    dress: "Come hungry",
    desc: "Coastal thalis, wood-fired breads, and a dessert counter that never closes.",
    note: "Vegan & jain menus available.",
  },
  {
    id: "reception",
    name: "Reception",
    time: "25 Nov · 7:30 PM",
    x: 49,
    y: 52,
    dress: "Champagne black tie",
    desc: "Chandeliers, a string quartet, and the last dance of the night.",
    note: "Cocktails from 7:00 PM.",
  },
  {
    id: "photo",
    name: "Photo Booth",
    time: "Always open",
    x: 78,
    y: 55,
    dress: "Your best angle",
    desc: "Instant prints, silly props, and a wall we're filling with you.",
    note: "Leave one print for us.",
  },
  {
    id: "lounge",
    name: "Family Lounge",
    time: "Always open",
    x: 68,
    y: 72,
    dress: "Comfort first",
    desc: "Quiet corners, chai on tap, and somewhere for tired feet.",
    note: "Kids' corner inside.",
  },
] as const;

export const VENUES = [
  {
    id: "amara",
    name: "Amara Palace",
    role: "Wedding & Reception",
    x: 26,
    y: 34,
    travel: "18 min from Jaipur International",
    stay: "On-site heritage suites",
    highlight: "Courtyard of a thousand lamps",
  },
  {
    id: "haveli",
    name: "Chandni Haveli",
    role: "Haldi & Mehndi",
    x: 55,
    y: 22,
    travel: "9 min from Amara Palace",
    stay: "Boutique riads nearby",
    highlight: "Blue-tiled step well at dusk",
  },
  {
    id: "sanctuary",
    name: "Rose Sanctuary",
    role: "Sangeet",
    x: 72,
    y: 48,
    travel: "14 min shuttle, runs every 20 min",
    stay: "The Ivory House, 3 min walk",
    highlight: "Rooftop with desert horizon",
  },
  {
    id: "lake",
    name: "Moonwater Lake",
    role: "Farewell Brunch",
    x: 42,
    y: 66,
    travel: "25 min scenic drive",
    stay: "Lakeside tents",
    highlight: "Sunrise boats and silence",
  },
] as const;
