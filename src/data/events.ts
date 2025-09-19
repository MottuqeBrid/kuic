export type EventItem = {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  short_dec: string;
  image?: string;
  images?: string[];
  status?: string;
  thumb?: string;
};

export type RawEvent = Omit<EventItem, "image"> & {
  thumb?: string;
  images?: string[];
  status?: string;
};

export const RAW_EVENTS: RawEvent[] = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    category: "Technology",
    date: "2024-03-15",
    time: "09:00 AM - 05:00 PM",
    location: "KUIC Main Auditorium",
    short_dec:
      "A full-day summit featuring industry leaders, workshops, and startup pitches.",
    thumb: "/kuic.jpg",
    images: ["/kuic.jpg", "/kuic.jpg", "/kuic.jpg"],
    status: "upcoming",
  },
  {
    id: 2,
    title: "Quantum Computing Workshop",
    category: "Science",
    date: "2024-04-02",
    time: "10:00 AM - 03:00 PM",
    location: "KU Advanced Physics Lab",
    short_dec:
      "Hands-on sessions introducing quantum programming and algorithms.",
    thumb: "/kuic.jpg",
    images: ["/kuic.jpg", "/kuic.jpg"],
    status: "upcoming",
  },
  {
    id: 3,
    title: "Startup Launchpad",
    category: "Entrepreneurship",
    date: "2024-05-10",
    time: "11:00 AM - 04:00 PM",
    location: "KU Innovation Hub",
    short_dec: "Pitch practice, mentorship, and investor office hours.",
    thumb: "/kuic.jpg",
    images: ["/kuic.jpg"],
    status: "past",
  },
  {
    id: 4,
    title: "Ethics & Technology Debate",
    category: "Philosophy",
    date: "2024-06-20",
    time: "02:00 PM - 05:00 PM",
    location: "KU Lecture Hall",
    short_dec: "A debate on the ethical implications of emerging technologies.",
    thumb: "/kuic.jpg",
    images: ["/kuic.jpg", "/kuic.jpg"],
    status: "past",
  },
];

export const DEMO_EVENTS: EventItem[] = RAW_EVENTS.map((e) => ({
  id: e.id,
  title: e.title,
  category: e.category,
  date: e.date,
  time: e.time,
  location: e.location,
  short_dec: e.short_dec,
  image: e.thumb ?? "",
  images: e.images ?? [],
  status: e.status ?? undefined,
}));
