import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaTag,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaExternalLinkAlt,
  FaThumbtack,
  FaInfoCircle,
} from "react-icons/fa";
import { motion } from "motion/react";
import axiosInstance from "../../hooks/axiosInstance";

interface Guest {
  name: string;
  title: string;
  bio: string;
  image: string;
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

interface AgendaItem {
  time: string;
  event: string;
  speaker: string;
}

interface EventItem {
  _id: string;
  title: string;
  category?: string;
  date: string;
  time: string;
  location: string;
  short_dec?: string;
  thumb?: string;
  images?: string[];
  status?: "upcoming" | "past" | "completed";
  description?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  price?: string;
  registrationDeadline?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  tags?: string[];
  guests?: Guest[];
  agenda?: AgendaItem[];
  regLink?: string;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
const SingleEvent: React.FC = () => {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

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

  // Format date function
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Status badge styling
  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const baseClasses = "badge font-medium";
    switch (status.toLowerCase()) {
      case "upcoming":
        return `${baseClasses} badge-success`;
      case "past":
        return `${baseClasses} badge-neutral`;
      case "completed":
        return `${baseClasses} badge-info`;
      default:
        return `${baseClasses} badge-ghost`;
    }
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await axiosInstance.get(`/events/getEvent/${id}`);
      console.log(data.data?.event);
      setEvent(data?.data?.event || null);
    } catch (error) {
      console.error("Error fetching event:", error);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <FaInfoCircle className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-base-content/70 mb-6">
            The requested event does not exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <FaArrowLeft />
            Back to Events
          </Link>

          {/* Event Header */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold flex-1">
                      {event.title}
                    </h1>
                    {event.isPinned && (
                      <div className="badge badge-primary gap-2">
                        <FaThumbtack className="w-3 h-3" />
                        Pinned
                      </div>
                    )}
                  </div>

                  {event.short_dec && (
                    <p className="text-lg text-base-content/80 mb-4">
                      {event.short_dec}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 items-center">
                    {event.status && (
                      <span
                        className={
                          getStatusBadge(event.status) || "badge badge-ghost"
                        }
                      >
                        {event.status}
                      </span>
                    )}
                    {event.category && (
                      <div className="badge badge-outline">
                        <FaTag className="w-3 h-3 mr-1" />
                        {event.category}
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration Button */}
                {event.regLink && event.status === "upcoming" && (
                  <div className="lg:text-right">
                    <a
                      href={event.regLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg"
                    >
                      Register Now
                      <FaExternalLinkAlt className="ml-2" />
                    </a>
                    {event.registrationDeadline && (
                      <p className="text-xs text-base-content/60 mt-2">
                        Registration closes:{" "}
                        {formatDate(event.registrationDeadline)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Images */}
              {(event.thumb || (event.images && event.images.length > 0)) && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body p-0">
                    {event.thumb && (
                      <img
                        src={event.thumb}
                        alt={event.title}
                        className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
                      />
                    )}
                    {event.images && event.images.length > 0 && (
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Gallery</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {event.images.map((src: string, i: number) => (
                            <img
                              key={i}
                              src={src}
                              alt={`${event.title} ${i + 1}`}
                              className="w-full h-24 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Event Description */}
              {event.description && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">
                      About This Event
                    </h2>
                    <p className="text-base-content/80 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Guests */}
              {event.guests && event.guests.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">
                      Featured Speakers
                    </h2>
                    <div className="grid gap-6">
                      {event.guests.map((guest, index) => (
                        <div key={index} className="flex gap-4">
                          {guest.image && (
                            <img
                              src={guest.image}
                              alt={guest.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {guest.name}
                            </h3>
                            {guest.title && (
                              <p className="text-primary text-sm">
                                {guest.title}
                              </p>
                            )}
                            {guest.bio && (
                              <p className="text-base-content/70 text-sm mt-2">
                                {guest.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Event Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 p-4 bg-base-200 rounded-lg"
                        >
                          <div className="text-primary font-semibold min-w-20">
                            {formatTime12Hour(item.time)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.event}</h4>
                            {item.speaker && (
                              <p className="text-sm text-base-content/70">
                                Speaker: {item.speaker}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Event Info */}
            <div className="space-y-6">
              {/* Event Details */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">Event Details</h2>

                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-start gap-3">
                      <FaCalendarAlt className="text-primary w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-medium">{formatDate(event.date)}</p>
                        <p className="text-sm text-base-content/70">
                          {formatTime12Hour(event.time)}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-primary w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-base-content/70">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    {/* Attendees */}
                    {(event.maxAttendees || event.currentAttendees) && (
                      <div className="flex items-start gap-3">
                        <FaUsers className="text-primary w-5 h-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Attendees</p>
                          <p className="text-sm text-base-content/70">
                            {event.currentAttendees || 0}
                            {event.maxAttendees &&
                              ` / ${event.maxAttendees}`}{" "}
                            registered
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    {event.price && (
                      <div className="flex items-start gap-3">
                        <FaDollarSign className="text-primary w-5 h-5 mt-0.5" />
                        <div>
                          <p className="font-medium">Price</p>
                          <p className="text-sm text-base-content/70">
                            {event.price === "0" ||
                            event.price.toLowerCase() === "free"
                              ? "Free"
                              : `$${event.price}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              {(event.organizer ||
                event.contactEmail ||
                event.contactPhone ||
                event.website) && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Organizer</h2>

                    <div className="space-y-3">
                      {event.organizer && (
                        <div className="flex items-center gap-3">
                          <FaUser className="text-primary w-4 h-4" />
                          <span className="text-sm">{event.organizer}</span>
                        </div>
                      )}

                      {event.contactEmail && (
                        <div className="flex items-center gap-3">
                          <FaEnvelope className="text-primary w-4 h-4" />
                          <a
                            href={`mailto:${event.contactEmail}`}
                            className="text-sm link link-hover"
                          >
                            {event.contactEmail}
                          </a>
                        </div>
                      )}

                      {event.contactPhone && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="text-primary w-4 h-4" />
                          <a
                            href={`tel:${event.contactPhone}`}
                            className="text-sm link link-hover"
                          >
                            {event.contactPhone}
                          </a>
                        </div>
                      )}

                      {event.website && (
                        <div className="flex items-center gap-3">
                          <FaGlobe className="text-primary w-4 h-4" />
                          <a
                            href={event.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm link link-hover"
                          >
                            Visit Website
                            <FaExternalLinkAlt className="ml-1 w-3 h-3 inline" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title text-xl mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <div key={index} className="badge badge-outline">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SingleEvent;
