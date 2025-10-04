import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "motion/react";
import axiosInstance from "../../hooks/axiosInstance";

interface EventItem {
  _id: string;
  title: string;
  short_dec: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  status?: string;
}

const categories = [
  "All",
  "Science",
  "Technology",
  "Entrepreneurship",
  "Philosophy",
];

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchEvents = async () => {
    const res = await axiosInstance.get("/events/getEvents");
    setEvents(res?.data?.events || []);
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((e: EventItem) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.short_dec || "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category, events]);

  return (
    <section className="py-12 sm:py-16 bg-base-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Events & Programs
          </h2>
          <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">
            Join KUIC events across Science, Technology, Entrepreneurship, and
            Philosophy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((c) => (
              <motion.button
                key={c}
                onClick={() => setCategory(c)}
                whileTap={{ scale: 0.98 }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  category === c
                    ? "bg-primary text-white"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
                aria-pressed={category === c}
              >
                {c}
              </motion.button>
            ))}
          </div>

          <motion.div className="w-full sm:w-64">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-2 rounded-lg bg-base-200 border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Search events"
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ev, idx) => (
            <motion.article
              key={ev._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="bg-base-200 rounded-2xl overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-44 sm:h-48 md:h-40 lg:h-44">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.currentTarget as HTMLImageElement;
                    if (!t.dataset.failed) {
                      t.dataset.failed = "1";
                      t.src = "/kuic.jpg";
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-4 top-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                      {ev.category}
                    </span>
                    {ev.status && (
                      <span className="px-2 py-1 rounded-md bg-success/90 text-white text-xs font-medium">
                        {ev.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute left-4 bottom-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">
                    {ev.title}
                  </h3>
                  <p className="text-xs sm:text-sm">{ev.location}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-base-content/70 mb-3">
                    <span className="inline-flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      {formatDate(ev.date)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FaClock className="text-primary" />
                      {ev.time}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      {ev.location}
                    </span>
                  </div>

                  <p className="text-base-content/80 text-sm">{ev.short_dec}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/events/${ev._id}`}
                    className="inline-flex items-center gap-2 text-sm btn btn-outline"
                  >
                    View Details
                    <FaArrowRight />
                  </Link>
                  <span className="text-xs text-base-content/60">
                    {ev.category}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <p className="text-lg">
              No events found. Try a different filter or search term.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Events;
