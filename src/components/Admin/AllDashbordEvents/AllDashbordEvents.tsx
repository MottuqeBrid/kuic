import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../../hooks/axiosInstance";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaTag,
  FaThumbtack,
  FaSearch,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router";

interface Event {
  _id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  short_dec: string;
  thumb: string;
  images: string[];
  status: "upcoming" | "past" | "completed";
  description: string;
  maxAttendees: number;
  currentAttendees: number;
  price: string;
  registrationDeadline: string;
  organizer: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  tags: string[];
  guests: Array<{
    name: string;
    title: string;
    bio: string;
    image: string;
    social: {
      linkedin: string;
      twitter: string;
      instagram: string;
      facebook: string;
      website: string;
    };
  }>;
  agenda: Array<{
    time: string;
    event: string;
    speaker: string;
  }>;
  regLink: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const AllDashbordEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses = "badge badge-sm font-medium";
    switch (status?.toLowerCase()) {
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

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/events/getEvents");
      setEvents(res?.data?.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string, eventTitle: string) => {
    setDeleteLoading(eventId);
    try {
      Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete the event "${eventTitle}". This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axiosInstance.delete(`/events/deleteEvent/${eventId}`);
          await fetchEvents();
          Swal.fire("Deleted!", "Your event has been deleted.", "success");
        }
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire("Error!", "Failed to delete event. Please try again.", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Filter events based on search term and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      event.status === statusFilter ||
      (statusFilter === "pinned" && event.isPinned);

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <FaCalendarAlt className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">All Events</h1>
                  <p className="text-base-content/70">
                    Manage and monitor all events
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn btn-primary">
                  <FaPlus className="mr-2" />
                  Add New Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="form-control flex-1">
                <label className="label">
                  <span className="label-text font-medium">Search Events</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, location, or organizer..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-base-content/50" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Filter by Status
                  </span>
                </label>
                <div className="relative">
                  <select
                    className="select select-bordered w-full pl-10"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <option value="completed">Completed</option>
                    <option value="pinned">Pinned Events</option>
                  </select>
                  <FaFilter className="absolute left-3 top-3 text-base-content/50" />
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-base-content/70">
              Showing {filteredEvents.length} of {events.length} events
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="font-bold">Event</th>
                      <th className="font-bold">Date & Time</th>
                      <th className="font-bold">Location</th>
                      <th className="font-bold">Status</th>
                      <th className="font-bold">Attendees</th>
                      <th className="font-bold">Price</th>
                      <th className="font-bold">Organizer</th>
                      <th className="font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12">
                          <div className="text-base-content/50">
                            <FaCalendarAlt className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg">No events found</p>
                            <p className="text-sm">
                              Try adjusting your search or filter criteria
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEvents.map((event) => (
                        <tr
                          key={event._id}
                          className={`hover ${
                            event.isPinned
                              ? "bg-primary/5 border-l-4 border-l-primary"
                              : ""
                          }`}
                        >
                          <td>
                            <div className="flex items-center gap-3">
                              {event.thumb && (
                                <div className="avatar">
                                  <div
                                    className={`mask mask-squircle w-12 h-12 ${
                                      event.isPinned
                                        ? "ring-2 ring-primary ring-offset-1"
                                        : ""
                                    }`}
                                  >
                                    <img src={event.thumb} alt={event.title} />
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="font-bold flex flex-col-reverse items-center gap-2">
                                  {event.isPinned && (
                                    <div className="badge badge-primary badge-sm gap-1">
                                      <FaThumbtack className="w-2.5 h-2.5" />
                                      Pinned
                                    </div>
                                  )}
                                  <span
                                    className={
                                      event.isPinned ? "text-primary" : ""
                                    }
                                  >
                                    {event.title}
                                  </span>
                                </div>
                                <div className="text-sm text-base-content/70 line-clamp-1">
                                  {event.short_dec}
                                </div>
                                {event.category && (
                                  <div className="badge badge-outline badge-xs mt-1">
                                    {event.category}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 text-sm">
                                <FaCalendarAlt className="w-3 h-3 text-primary" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-base-content/70">
                                <FaClock className="w-3 h-3" />
                                {formatTime12Hour(event.time)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 text-sm">
                              <FaMapMarkerAlt className="w-3 h-3 text-primary" />
                              <span className="max-w-32 truncate">
                                {event.location}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={getStatusBadge(event.status)}>
                              {event.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-1 text-sm">
                              <FaUsers className="w-3 h-3 text-primary" />
                              {event.currentAttendees || 0}
                              {event.maxAttendees && (
                                <span className="text-base-content/70">
                                  /{event.maxAttendees}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="text-sm">
                              {event.price || "Free"}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm max-w-24 truncate block">
                              {event.organizer || "N/A"}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/events/${event._id}`}
                                className="btn btn-ghost btn-xs"
                                title="View Event"
                              >
                                <FaEye className="w-3 h-3" />
                              </Link>
                              <Link
                                to={`/admin/update-event/${event._id}`}
                                state={{ event }}
                                className="btn btn-ghost btn-xs"
                                title="Edit Event"
                              >
                                <FaEdit className="w-3 h-3" />
                              </Link>
                              <button
                                className={`btn btn-ghost btn-xs text-error hover:bg-error hover:text-error-content ${
                                  deleteLoading === event._id ? "loading" : ""
                                }`}
                                onClick={() =>
                                  handleDelete(event._id, event.title)
                                }
                                disabled={deleteLoading === event._id}
                                title="Delete Event"
                              >
                                {deleteLoading === event._id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <FaTrash className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-primary">
                <FaCalendarAlt className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Events</div>
              <div className="stat-value text-primary">{events.length}</div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-success">
                <FaClock className="w-8 h-8" />
              </div>
              <div className="stat-title">Upcoming</div>
              <div className="stat-value text-success">
                {events.filter((e) => e.status === "upcoming").length}
              </div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-info">
                <FaTag className="w-8 h-8" />
              </div>
              <div className="stat-title">Completed</div>
              <div className="stat-value text-info">
                {events.filter((e) => e.status === "completed").length}
              </div>
            </div>

            <div className="stat bg-base-100 shadow-xl rounded-box">
              <div className="stat-figure text-warning">
                <FaThumbtack className="w-8 h-8" />
              </div>
              <div className="stat-title">Pinned</div>
              <div className="stat-value text-warning">
                {events.filter((e) => e.isPinned).length}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AllDashbordEvents;
