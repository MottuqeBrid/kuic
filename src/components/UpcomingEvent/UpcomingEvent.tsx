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
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarPlus,
} from "react-icons/fa";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  thumb: string;
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
  guests: { name: string; title: string }[] | null;
  agenda: [];
  regLink: string;
  isPinned: boolean;
}
const UpcomingEvent = () => {
  const [upcomingEvent, setUpcomingEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await axiosInstance.get("/events/getEvents?isPinned=true");
      console.log(data?.data?.events);
      setUpcomingEvent(data?.data?.events[0] || null);
    } catch (err) {
      console.error("Error fetching upcoming event:", err);
      setError("Failed to load upcoming event. Showing demo data.");
      // Demo event with registration deadline for testing
      setUpcomingEvent({
        _id: "demo-event-1",
        title: "AI & Machine Learning Symposium 2025",
        description: "Join us for an exciting exploration of AI and ML trends.",
        location: "KUIC Innovation Hub, Kathmandu University",
        date: "2025-11-15",
        time: "09:00",
        thumb:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
        category: "Technology",
        short_dec: "Explore the future of AI and ML with industry experts",
        status: "upcoming",
        maxAttendees: 200,
        currentAttendees: 85,
        price: "Free",
        registrationDeadline: "2025-11-10", // Set deadline to test functionality
        organizer: "KUIC Tech Committee",
        shortDescription:
          "Explore the future of AI and ML with industry experts in this comprehensive symposium.",
        contactEmail: "tech@kuic.edu.np",
        contactPhone: "+977-1-234-5678",
        website: "https://kuic.edu.np/events",
        tags: ["AI", "Machine Learning", "Technology"],
        guests: [
          { name: "Dr. Sarah Johnson", title: "AI Research Director" },
          { name: "Prof. Raj Sharma", title: "ML Expert" },
        ],
        agenda: [],
        regLink: "https://forms.google.com/ai-ml-symposium",
        isPinned: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const formatDate = useCallback((dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  const getStatusColor = useCallback((status?: string): string => {
    const s = status ?? "upcoming";
    switch (s) {
      case "upcoming":
        return "text-primary bg-primary/10 border-primary/20";
      case "ongoing":
        return "text-success bg-success/10 border-success/20";
      case "completed":
        return "text-neutral bg-neutral/10 border-neutral/20";
      default:
        return "text-primary bg-primary/10 border-primary/20";
    }
  }, []);

  const getStatusText = useCallback((status?: string): string => {
    const s = status ?? "upcoming";
    switch (s) {
      case "upcoming":
        return "Upcoming";
      case "ongoing":
        return "Live Now";
      case "completed":
        return "Completed";
      default:
        return "Upcoming";
    }
  }, []);

  // Check if registration is still open based on deadline
  const isRegistrationOpen = useCallback(
    (registrationDeadline?: string): boolean => {
      if (!registrationDeadline) return true; // If no deadline set, registration is open
      try {
        const deadline = new Date(registrationDeadline);
        const now = new Date();
        return now <= deadline;
      } catch {
        return true; // If invalid date, assume registration is open
      }
    },
    []
  );

  const attendancePercentage = useMemo(() => {
    if (!upcomingEvent) return 0;
    return (
      ((upcomingEvent.currentAttendees || 0) /
        (upcomingEvent.maxAttendees || 1)) *
      100
    );
  }, [upcomingEvent]);

  // Loading state
  if (loading) {
    return (
      <div className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
            <p className="text-lg text-base-content/70">
              Loading upcoming events...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!upcomingEvent && !loading) {
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

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCalendarPlus className="text-4xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-base-content mb-4">
                No Upcoming Events
              </h3>
              <p className="text-base-content/70 mb-8">
                We're currently planning exciting new events. Check back soon or
                explore our past events to see what we're all about!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/events" className="btn btn-primary gap-2">
                  View All Events
                  <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
          <h2
            className="text-4xl md:text-5xl font-bold text-base-content mb-4"
            id="upcoming-events-heading"
            role="heading"
            aria-level={2}
          >
            Upcoming <span className="text-primary">Events</span>
          </h2>
          <p
            className="text-lg text-base-content/70 max-w-2xl mx-auto"
            aria-describedby="upcoming-events-heading"
          >
            Join our exciting events and connect with the tech community
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-warning mb-8"
          >
            <FaExclamationTriangle />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Enhanced Event Card */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-base-200 to-base-300 rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:-translate-y-1 lg:hover:-translate-y-2 focus-within:ring-4 focus-within:ring-primary/20"
          whileHover={{ scale: [1, 1.01, 1.02] }}
          role="article"
          aria-labelledby="event-title"
          aria-describedby="event-description"
        >
          {/* Event Image with Enhanced Overlay */}
          <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
            <motion.img
              src={upcomingEvent?.thumb}
              alt={upcomingEvent?.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Enhanced Status Badge */}
            <motion.div
              className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={`px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 rounded-full text-xs sm:text-sm font-bold backdrop-blur-md border border-white/20 shadow-lg ${getStatusColor(
                  upcomingEvent?.status
                )}`}
              >
                {getStatusText(upcomingEvent?.status)}
              </span>
            </motion.div>

            {/* Enhanced Category Badge */}
            <motion.div
              className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-white/25 backdrop-blur-md text-white rounded-full text-xs sm:text-sm font-bold border border-white/20 shadow-lg">
                {upcomingEvent?.category}
              </span>
            </motion.div>

            {/* Event Title Overlay */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 lg:bottom-6 lg:left-6 lg:right-6">
              <motion.h3
                id="event-title"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg leading-tight"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {upcomingEvent?.title}
              </motion.h3>
              <motion.div
                className="flex items-center gap-2 sm:gap-3 text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <FaCalendarAlt className="text-primary text-sm sm:text-base" />
                <span className="font-medium text-sm sm:text-base lg:text-lg drop-shadow">
                  {formatDate(upcomingEvent?.date)}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Event Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Event Description */}
            <motion.p
              id="event-description"
              className="text-base-content/80 mb-8 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {upcomingEvent?.shortDescription}
            </motion.p>

            {/* Enhanced Event Details Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaClock className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60 font-medium">
                    Time
                  </p>
                  <p className="text-base-content font-semibold">
                    {formatTime12Hour(upcomingEvent?.time || "")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaMapMarkerAlt className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60 font-medium">
                    Location
                  </p>
                  <p className="text-base-content font-semibold">
                    {upcomingEvent?.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaUsers className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60 font-medium">
                    Attendees
                  </p>
                  <p className="text-base-content font-semibold">
                    {upcomingEvent?.currentAttendees}/
                    {upcomingEvent?.maxAttendees}
                  </p>
                  <div className="w-24 bg-base-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${attendancePercentage}%` }}
                      role="progressbar"
                      aria-valuenow={attendancePercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${attendancePercentage.toFixed(
                        0
                      )}% of seats filled`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaTicketAlt className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-base-content/60 font-medium">
                    Price
                  </p>
                  <p className="text-base-content font-semibold text-lg">
                    {upcomingEvent?.price}
                  </p>
                </div>
              </div>

              {/* Registration Deadline */}
              {upcomingEvent?.registrationDeadline && (
                <div
                  className={`flex items-center gap-4 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${
                    isRegistrationOpen(upcomingEvent.registrationDeadline)
                      ? "bg-base-100"
                      : "bg-error/10 border border-error/20"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full ${
                      isRegistrationOpen(upcomingEvent.registrationDeadline)
                        ? "bg-success/10"
                        : "bg-error/10"
                    }`}
                  >
                    <FaCalendarAlt
                      className={`w-5 h-5 ${
                        isRegistrationOpen(upcomingEvent.registrationDeadline)
                          ? "text-success"
                          : "text-error"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-base-content/60 font-medium">
                      Registration Deadline
                    </p>
                    <p
                      className={`font-semibold ${
                        isRegistrationOpen(upcomingEvent.registrationDeadline)
                          ? "text-base-content"
                          : "text-error"
                      }`}
                    >
                      {formatDate(upcomingEvent.registrationDeadline)}
                    </p>
                    {!isRegistrationOpen(
                      upcomingEvent.registrationDeadline
                    ) && (
                      <p className="text-xs text-error font-medium mt-1">
                        Registration Closed
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Enhanced Guest Speakers */}
            {upcomingEvent?.guests && upcomingEvent.guests.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <h4 className="text-xl font-bold text-base-content mb-6 flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-full">
                    <FaStar className="text-warning" />
                  </div>
                  Featured Speakers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvent.guests.slice(0, 3).map((guest, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-4 bg-base-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group"
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base-content group-hover:text-primary transition-colors duration-300">
                          {guest.name}
                        </p>
                        <p className="text-sm text-base-content/70 mt-1">
                          {guest.title}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {upcomingEvent.guests.length > 3 && (
                    <motion.div
                      className="flex items-center justify-center bg-base-100 rounded-xl p-4 shadow-sm border-2 border-dashed border-base-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      <span className="text-base-content/70 font-medium">
                        +{upcomingEvent.guests.length - 3} more speakers
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Enhanced Tags */}
            {upcomingEvent?.tags && upcomingEvent.tags.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex flex-wrap gap-3">
                  {upcomingEvent.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tagIndex}
                      className="px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/20 text-primary rounded-full text-sm font-semibold border border-primary/20 hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + tagIndex * 0.05 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Enhanced Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <motion.div
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/events/${upcomingEvent?._id}`}
                  className="w-full btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300 focus:ring-4 focus:ring-primary/50"
                  aria-label={`View details for ${upcomingEvent?.title}`}
                >
                  <span className="text-lg">View Details</span>
                  <FaArrowRight
                    className="group-hover:translate-x-1 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>
              {upcomingEvent?.regLink &&
              isRegistrationOpen(upcomingEvent?.registrationDeadline) ? (
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    target="_blank"
                    to={upcomingEvent.regLink}
                    className="w-full btn btn-outline btn-lg gap-3 hover:btn-primary shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-4 focus:ring-primary/50"
                    aria-label={`Register for ${upcomingEvent.title} (opens in new tab)`}
                    rel="noopener noreferrer"
                  >
                    <FaTicketAlt aria-hidden="true" />
                    <span className="text-lg">Register Now</span>
                  </Link>
                </motion.div>
              ) : upcomingEvent?.regLink &&
                !isRegistrationOpen(upcomingEvent?.registrationDeadline) ? (
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <div className="w-full btn btn-disabled btn-lg gap-3 cursor-not-allowed">
                    <FaTicketAlt aria-hidden="true" />
                    <span className="text-lg">Registration Closed</span>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>

            {/* Enhanced Contact Info */}
            <motion.div
              className="pt-6 border-t border-base-300/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FaEnvelope className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-base-content font-medium">
                      {upcomingEvent?.contactEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FaPhone className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 font-medium uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-base-content font-medium">
                      {upcomingEvent?.contactPhone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.article>

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/events"
              className="btn btn-outline btn-lg gap-2 focus:ring-4 focus:ring-primary/50"
              aria-label="View all upcoming events"
            >
              View All Events
              <FaArrowRight aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpcomingEvent;
