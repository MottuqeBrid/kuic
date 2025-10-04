import { motion } from "motion/react";
import { Link } from "react-router";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaArrowRight,
  FaTicketAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaStar,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosInstance from "../../hooks/axiosInstance";

// Utility function to convert 24-hour time to 12-hour format
const formatTime12Hour = (time24: string): string => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const minute = minutes || "00";

  if (hour === 0) {
    return `12:${minute} AM`;
  } else if (hour < 12) {
    return `${hour}:${minute} AM`;
  } else if (hour === 12) {
    return `12:${minute} PM`;
  } else {
    return `${hour - 12}:${minute} PM`;
  }
};

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image: string;
  category: string;
  short_dec: string;
  status: string;
  maxAttendees: number;
  currentAttendees: number;
  price: string;
  registrationDeadline: string;
  organizer: string;
  shortDescription: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  tags: string[];
  guests: [{ name: string; title: string }] | null;
  agenda: [];
  regLink: string;
  isPinned: boolean;
}
const UpcomingEvent = () => {
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);

  const fetchEvent = async () => {
    const data = await axiosInstance.get("/events/getEvents?isPinned=true");
    setUpcomingEvent(data?.data?.events[0] || null);
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    const s = status ?? "upcoming";
    switch (s) {
      case "upcoming":
        return "text-primary bg-primary/10";
      case "ongoing":
        return "text-success bg-success/10";
      case "completed":
        return "text-neutral bg-neutral/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const getStatusText = (status?: string) => {
    const s = status ?? "upcoming";
    switch (s) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Ongoing";
      case "completed":
        return "Completed";
      default:
        return "Upcoming";
    }
  };

  return (
    <div className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Upcoming <span className="text-primary">Events</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Join our exciting events and connect with the tech community
          </p>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          {/* Event Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={upcomingEvent?.image}
              alt={upcomingEvent?.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  upcomingEvent?.status
                )}`}
              >
                {getStatusText(upcomingEvent?.status)}
              </span>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                {upcomingEvent?.category}
              </span>
            </div>
          </div>

          {/* Event Content */}
          <div className="p-6">
            {/* Event Title & Date */}
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300">
                {upcomingEvent?.title}
              </h3>
              <div className="flex items-center gap-2 text-base-content/70">
                <FaCalendarAlt className="text-primary" />
                <span className="font-medium">
                  {formatDate(upcomingEvent?.date)}
                </span>
              </div>
            </div>

            {/* Event Description */}
            <p className="text-base-content/80 mb-4 line-clamp-3">
              {upcomingEvent?.shortDescription}
            </p>

            {/* Event Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <FaClock className="text-primary w-5 h-5" />
                <span className="text-base-content/70">
                  {formatTime12Hour(upcomingEvent?.time || "")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary w-5 h-5" />
                <span className="text-base-content/70">
                  {upcomingEvent?.location}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaUsers className="text-primary w-5 h-5" />
                <span className="text-base-content/70">
                  {upcomingEvent?.currentAttendees}/
                  {upcomingEvent?.maxAttendees} attendees
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaTicketAlt className="text-primary w-5 h-5" />
                <span className="text-base-content/70">
                  {upcomingEvent?.price}
                </span>
              </div>
            </div>

            {/* Guest Speakers */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-base-content mb-3 flex items-center gap-2">
                <FaStar className="text-warning" />
                Guest Speakers
              </h4>
              <div className="flex flex-wrap gap-2">
                {(upcomingEvent?.guests ?? [])
                  .slice(0, 3)
                  .map((guest, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-base-100 rounded-lg p-2"
                    >
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <FaUser className="text-primary text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-base-content">
                          {guest.name}
                        </p>
                        <p className="text-xs text-base-content/70">
                          {guest.title}
                        </p>
                      </div>
                    </div>
                  ))}
                {(upcomingEvent?.guests ?? []).length > 3 && (
                  <div className="flex items-center gap-2 bg-base-100 rounded-lg p-2">
                    <span className="text-sm text-base-content/70">
                      +{(upcomingEvent?.guests?.length ?? 0) - 3} more
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {(upcomingEvent?.tags ?? []).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/events/${upcomingEvent?._id}`}
                  className="flex-1 btn btn-primary gap-2"
                >
                  View Details
                  <FaArrowRight />
                </Link>
              </motion.div>
              {upcomingEvent?.regLink && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    target="_blank"
                    to={upcomingEvent?.regLink}
                    className="flex-1 btn btn-outline gap-2"
                  >
                    <FaTicketAlt />
                    Register
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="flex items-center justify-between text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" />
                  <span>{upcomingEvent?.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-primary" />
                  <span>{upcomingEvent?.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/events" className="btn btn-outline btn-lg gap-2">
              View All Events
              <FaArrowRight />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
