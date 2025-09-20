import React from "react";
import { useParams, Link } from "react-router";
import { DEMO_EVENTS } from "../../data/events";
import type { EventItem } from "../../data/events";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";

const SingleEvent: React.FC = () => {
  const { id } = useParams();
  const eventId = Number(id);
  const ev = DEMO_EVENTS.find((e: EventItem) => e.id === eventId);

  if (!ev) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <p className="mt-4">The requested event does not exist.</p>
        <Link to="/events" className="btn btn-outline mt-6 inline-block">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 mb-6 text-sm"
          >
            <FaArrowLeft /> Back
          </Link>

          <h1 className="text-3xl font-bold mb-2">{ev.title}</h1>
          <p className="text-base-content/70 mb-4">
            {ev.location} • {ev.time}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={ev.image}
                alt={ev.title}
                className="w-full rounded-lg shadow"
              />
              {ev.images && ev.images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {ev.images.map((src: string, i: number) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${ev.title} ${i + 1}`}
                      className="w-20 h-14 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-sm text-base-content/80">{ev.short_dec}</p>

              <div className="mt-6">
                <h3 className="text-sm font-medium">When</h3>
                <p className="text-sm">
                  {ev.date} • {ev.time}
                </p>

                <h3 className="text-sm font-medium mt-4">Where</h3>
                <p className="text-sm">{ev.location}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SingleEvent;
