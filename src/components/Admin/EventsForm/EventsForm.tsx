import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaImage,
  FaPlus,
  FaTrash,
  FaUsers,
  FaDollarSign,
  FaTag,
  FaThumbtack,
} from "react-icons/fa";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";
import { useLocation } from "react-router";

// TypeScript interfaces based on the schema
interface Guest {
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
}

interface AgendaItem {
  time: string;
  event: string;
  speaker: string;
}

interface EventFormData {
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
  guests: Guest[];
  agenda: AgendaItem[];
  regLink: string;
  isPinned: boolean;
}

const categories = ["Science", "Technology", "Entrepreneurship", "Philosophy"];

const EventsForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const location = useLocation();

  // Check if we're editing an existing event
  const editingEvent = location.state?.event;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<EventFormData>({
    defaultValues: editingEvent || {
      title: "",
      category: "",
      date: "",
      time: "",
      location: "",
      short_dec: "",
      thumb: "",
      images: [""],
      status: "upcoming",
      description: "",
      maxAttendees: 0,
      currentAttendees: 0,
      price: "",
      registrationDeadline: "",
      organizer: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      tags: [""],
      guests: [],
      agenda: [],
      regLink: "",
      isPinned: false,
    },
  });

  // Set form mode based on whether we're editing
  useEffect(() => {
    if (editingEvent) {
      //   setFormMode("edit");
      // Populate arrays for editing
      if (editingEvent.images?.length) {
        setImages(editingEvent.images);
        // Also set the form values for each image
        editingEvent.images.forEach((img: string, index: number) => {
          setValue(`images.${index}`, img);
        });
      } else {
        setImages([""]);
      }

      if (editingEvent.tags?.length) {
        setTags(editingEvent.tags);
        // Also set the form values for each tag
        editingEvent.tags.forEach((tag: string, index: number) => {
          setValue(`tags.${index}`, tag);
        });
      } else {
        setTags([""]);
      }
    }
  }, [editingEvent, setValue]);

  // Using useState for arrays that don't work well with useFieldArray typing
  const [images, setImages] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const {
    fields: guestFields,
    append: appendGuest,
    remove: removeGuest,
  } = useFieldArray({
    control,
    name: "guests",
  });

  const {
    fields: agendaFields,
    append: appendAgenda,
    remove: removeAgenda,
  } = useFieldArray({
    control,
    name: "agenda",
  });

  const addImage = () => {
    const newImages = [...images, ""];
    setImages(newImages);
    // Set empty value for the new image field
    setValue(`images.${newImages.length - 1}`, "");
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
      // Clear the form values for removed image
      setValue(`images.${index}`, "");
    }
  };

  const addTag = () => {
    const newTags = [...tags, ""];
    setTags(newTags);
    // Set empty value for the new tag field
    setValue(`tags.${newTags.length - 1}`, "");
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      const newTags = tags.filter((_, i) => i !== index);
      setTags(newTags);
      // Clear the form values for removed tag
      setValue(`tags.${index}`, "");
    }
  };

  // Handler to update image state when input changes
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    setValue(`images.${index}`, value);
  };

  // Handler to update tag state when input changes
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
    setValue(`tags.${index}`, value);
  };

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      // Validate required fields before submission
      if (!data.title?.trim()) {
        throw new Error("Event title is required");
      }
      if (!data.date) {
        throw new Error("Event date is required");
      }
      if (!data.time) {
        throw new Error("Event time is required");
      }
      if (!data.location?.trim()) {
        throw new Error("Event location is required");
      }

      // Filter out empty strings from arrays and clean data
      const cleanedData = {
        ...data,
        images: images.filter((img) => img.trim() !== ""),
        tags: tags.filter((tag) => tag.trim() !== ""),
        // Ensure numeric fields are properly formatted
        maxAttendees: data.maxAttendees || 0,
        currentAttendees: data.currentAttendees || 0,
        // Clean up string fields
        title: data.title.trim(),
        location: data.location.trim(),
        short_dec: data.short_dec?.trim() || "",
        description: data.description?.trim() || "",
        organizer: data.organizer?.trim() || "",
      };
      console.log("Submitting event data:", cleanedData);

      // Determine API endpoint based on mode
      const apiEndpoint = editingEvent
        ? `/events/updateEvent/${editingEvent._id}`
        : "/events/addEvent";

      const apiMethod = editingEvent ? "patch" : "post";

      const response = await axiosInstance[apiMethod](apiEndpoint, cleanedData);

      if (response?.data?.success) {
        await Swal.fire({
          icon: "success",
          title: editingEvent
            ? "Event updated successfully!"
            : "Event created successfully!",
          text: editingEvent
            ? "Your event has been updated with the new information."
            : "Your new event has been created and is now available.",
          confirmButtonText: "Great!",
          confirmButtonColor: "#10b981",
        });

        // Reset form only for new events
        if (!editingEvent) {
          reset();
          setImages([""]);
          setTags([""]);
        }
      } else {
        throw new Error(response?.data?.message || "Failed to save event");
      }
    } catch (error) {
      console.error("Error submitting event:", error);

      await Swal.fire({
        icon: "error",
        title: editingEvent
          ? "Failed to update event"
          : "Failed to create event",
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNewGuest = () => {
    appendGuest({
      name: "",
      title: "",
      bio: "",
      image: "",
      social: {
        linkedin: "",
        twitter: "",
        instagram: "",
        facebook: "",
        website: "",
      },
    });
  };

  const addNewAgendaItem = () => {
    appendAgenda({
      time: "",
      event: "",
      speaker: "",
    });
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
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
                  <h1 className="text-3xl font-bold">
                    {editingEvent ? "Edit Event" : "Create New Event"}
                  </h1>
                  <p className="text-base-content/70">
                    {editingEvent
                      ? "Update the event details below"
                      : "Fill in the details to create a new event"}
                  </p>
                  {editingEvent && (
                    <div className="mt-2">
                      <span className="badge badge-info badge-sm">
                        Editing: {editingEvent.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Progress Indicator */}
              <div className="flex flex-col items-end">
                <div className="text-sm text-base-content/60 mb-2">
                  Form Status
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isDirty ? "bg-warning" : "bg-success"
                    }`}
                  ></div>
                  <span className="text-sm">
                    {isDirty ? "Unsaved changes" : "Up to date"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Event Title *
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a compelling event title"
                    className={`input input-bordered w-full ${
                      errors.title ? "input-error" : ""
                    }`}
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 3,
                        message: "Title must be at least 3 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Title must not exceed 100 characters",
                      },
                    })}
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.title.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Category */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Category</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    {...register("category")}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Date *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className={`input input-bordered w-full ${
                        errors.date ? "input-error" : ""
                      }`}
                      {...register("date", {
                        required: "Date is required",
                        validate: (value) => {
                          const selectedDate = new Date(value);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return (
                            selectedDate >= today ||
                            "Event date cannot be in the past"
                          );
                        },
                      })}
                    />
                    <FaCalendarAlt className="absolute right-3 top-3 text-base-content/50" />
                  </div>
                  {errors.date && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.date.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Time */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Time *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      className={`input input-bordered w-full ${
                        errors.time ? "input-error" : ""
                      }`}
                      {...register("time", { required: "Time is required" })}
                    />
                    <FaClock className="absolute right-3 top-3 text-base-content/50" />
                  </div>
                  {errors.time && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.time.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Location */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">Location *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Conference Room A, Online via Zoom, Central Park"
                      className={`input input-bordered w-full pl-10 ${
                        errors.location ? "input-error" : ""
                      }`}
                      {...register("location", {
                        required: "Location is required",
                        minLength: {
                          value: 3,
                          message: "Location must be at least 3 characters",
                        },
                      })}
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-base-content/50" />
                  </div>
                  {errors.location && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.location.message}
                      </span>
                    </label>
                  )}
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      💡 Be specific - include room numbers, building names, or
                      online platform details
                    </span>
                  </label>
                </div>

                {/* Status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    {...register("status")}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Is Pinned */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      {...register("isPinned")}
                    />
                    <div>
                      <span className="label-text font-semibold flex items-center gap-2">
                        <FaThumbtack className="text-primary" />
                        Pin Event
                      </span>
                      <span className="label-text-alt">
                        Feature this event prominently
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div className="form-control mt-6">
                <label className="label">
                  <span className="label-text font-semibold">
                    Short Description
                  </span>
                  <span className="label-text-alt">
                    {watch("short_dec")?.length || 0}/200 characters
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24 w-full"
                  placeholder="A compelling one-liner that captures the essence of your event..."
                  maxLength={200}
                  {...register("short_dec", {
                    maxLength: {
                      value: 200,
                      message:
                        "Short description must not exceed 200 characters",
                    },
                  })}
                ></textarea>
                {errors.short_dec && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.short_dec.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    💡 This appears in event cards and previews - make it
                    engaging!
                  </span>
                </label>
              </div>

              {/* Full Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Full Description
                  </span>
                  <span className="label-text-alt">
                    {watch("description")?.length || 0}/1000 characters
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Provide detailed information about the event, including agenda, speakers, what attendees will learn, requirements, etc."
                  maxLength={1000}
                  {...register("description", {
                    maxLength: {
                      value: 1000,
                      message: "Description must not exceed 1000 characters",
                    },
                  })}
                ></textarea>
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description.message}
                    </span>
                  </label>
                )}
                <label className="label">
                  <span className="label-text-alt text-base-content/60">
                    💡 Include key details that will help attendees decide if
                    this event is right for them
                  </span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Attendee & Pricing Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaUsers className="text-primary" />
                Attendee & Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Max Attendees */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Max Attendees
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input input-bordered w-full"
                    {...register("maxAttendees", {
                      valueAsNumber: true,
                      min: 0,
                    })}
                  />
                </div>

                {/* Current Attendees */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Current Attendees
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="input input-bordered w-full"
                    {...register("currentAttendees", {
                      valueAsNumber: true,
                      min: 0,
                    })}
                  />
                </div>

                {/* Price */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Price</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Free / $50 / Contact for pricing"
                      className="input input-bordered w-full pl-10"
                      {...register("price")}
                    />
                    <FaDollarSign className="absolute left-3 top-3 text-base-content/50" />
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Registration Deadline
                    </span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    {...register("registrationDeadline")}
                  />
                </div>

                {/* Registration Link */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Registration Link
                    </span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/register"
                    className="input input-bordered w-full"
                    {...register("regLink")}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Organizer Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaUser className="text-primary" />
                Organizer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organizer */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Organizer Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter organizer name"
                    className="input input-bordered w-full"
                    {...register("organizer")}
                  />
                </div>

                {/* Contact Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Contact Email
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      className="input input-bordered w-full pl-10"
                      {...register("contactEmail", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    <FaEnvelope className="absolute left-3 top-3 text-base-content/50" />
                  </div>
                  {errors.contactEmail && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.contactEmail.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Contact Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Contact Phone
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="input input-bordered w-full pl-10"
                      {...register("contactPhone")}
                    />
                    <FaPhone className="absolute left-3 top-3 text-base-content/50" />
                  </div>
                </div>

                {/* Website */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Website</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className="input input-bordered w-full pl-10"
                      {...register("website")}
                    />
                    <FaGlobe className="absolute left-3 top-3 text-base-content/50" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaImage className="text-primary" />
                Images
              </h2>

              {/* Thumbnail */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-semibold">
                    Thumbnail Image
                  </span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/thumbnail.jpg"
                  className="input input-bordered w-full"
                  {...register("thumb")}
                />
              </div>

              {/* Additional Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="label-text font-semibold">
                    Additional Images
                  </label>
                  <button
                    type="button"
                    onClick={addImage}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    <FaPlus className="mr-2" />
                    Add Image
                  </button>
                </div>

                <div className="space-y-3">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="input input-bordered flex-1"
                        value={imageUrl}
                        {...register(`images.${index}`)}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                      />
                      {images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="btn btn-square btn-outline btn-error"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaTag className="text-primary" />
                Tags
              </h2>

              <div className="flex items-center justify-between mb-4">
                <p className="text-base-content/70">
                  Add tags to help categorize your event
                </p>
                <button
                  type="button"
                  onClick={addTag}
                  className="btn btn-sm btn-outline btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Add Tag
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tags.map((tagValue, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter tag"
                      className="input input-bordered flex-1"
                      value={tagValue}
                      {...register(`tags.${index}`)}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                    />
                    {tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="btn btn-square btn-outline btn-error"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Guests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Guest Speakers</h2>

              <div className="flex items-center justify-between mb-6">
                <p className="text-base-content/70">
                  Add guest speakers and their information
                </p>
                <button
                  type="button"
                  onClick={addNewGuest}
                  className="btn btn-outline btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Add Guest
                </button>
              </div>

              <div className="space-y-8">
                {guestFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="card bg-base-200 border-2 border-dashed border-base-300"
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          Guest {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeGuest(index)}
                          className="btn btn-sm btn-outline btn-error"
                        >
                          <FaTrash className="mr-2" />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Name</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Guest name"
                            className="input input-bordered w-full"
                            {...register(`guests.${index}.name`)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Title
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="Guest title/position"
                            className="input input-bordered w-full"
                            {...register(`guests.${index}.title`)}
                          />
                        </div>

                        <div className="form-control md:col-span-2">
                          <label className="label">
                            <span className="label-text font-medium">Bio</span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered h-20 w-full"
                            placeholder="Guest biography"
                            {...register(`guests.${index}.bio`)}
                          ></textarea>
                        </div>

                        <div className="form-control md:col-span-2">
                          <label className="label">
                            <span className="label-text font-medium">
                              Image URL
                            </span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/guest-image.jpg"
                            className="input input-bordered w-full"
                            {...register(`guests.${index}.image`)}
                          />
                        </div>

                        {/* Social Media */}
                        <div className="md:col-span-2">
                          <label className="label">
                            <span className="label-text font-medium">
                              Social Media
                            </span>
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="url"
                              placeholder="LinkedIn URL"
                              className="input input-bordered input-sm"
                              {...register(`guests.${index}.social.linkedin`)}
                            />
                            <input
                              type="url"
                              placeholder="Twitter URL"
                              className="input input-bordered input-sm"
                              {...register(`guests.${index}.social.twitter`)}
                            />
                            <input
                              type="url"
                              placeholder="Instagram URL"
                              className="input input-bordered input-sm"
                              {...register(`guests.${index}.social.instagram`)}
                            />
                            <input
                              type="url"
                              placeholder="Facebook URL"
                              className="input input-bordered input-sm"
                              {...register(`guests.${index}.social.facebook`)}
                            />
                            <input
                              type="url"
                              placeholder="Website URL"
                              className="input input-bordered input-sm md:col-span-2"
                              {...register(`guests.${index}.social.website`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Agenda */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Event Agenda</h2>

              <div className="flex items-center justify-between mb-6">
                <p className="text-base-content/70">
                  Create a detailed agenda for your event
                </p>
                <button
                  type="button"
                  onClick={addNewAgendaItem}
                  className="btn btn-outline btn-primary"
                >
                  <FaPlus className="mr-2" />
                  Add Agenda Item
                </button>
              </div>

              <div className="space-y-4">
                {agendaFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="card bg-base-200 border border-base-300"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-semibold">
                          Item {index + 1}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeAgenda(index)}
                          className="btn btn-xs btn-outline btn-error"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-sm">Time</span>
                          </label>
                          <input
                            type="time"
                            className="input input-bordered input-sm w-full"
                            {...register(`agenda.${index}.time`)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-sm">Event</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Agenda item"
                            className="input input-bordered input-sm w-full"
                            {...register(`agenda.${index}.event`)}
                          />
                        </div>

                        <div className="form-control">
                          <label className="label py-1">
                            <span className="label-text text-sm">Speaker</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Speaker name"
                            className="input input-bordered input-sm w-full"
                            {...register(`agenda.${index}.speaker`)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="card bg-base-100 shadow-xl"
          >
            <div className="card-body">
              {/* Form Summary */}
              <div className="mb-4 p-4 bg-base-200 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Form Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-base-content/60">
                      Required fields:
                    </span>
                    <span className="ml-1 font-medium">4 of 4</span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Images:</span>
                    <span className="ml-1 font-medium">
                      {images.filter((img) => img.trim()).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Tags:</span>
                    <span className="ml-1 font-medium">
                      {tags.filter((tag) => tag.trim()).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-base-content/60">Guests:</span>
                    <span className="ml-1 font-medium">
                      {guestFields.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to reset all fields? This action cannot be undone."
                        )
                      ) {
                        reset();
                        setImages([""]);
                        setTags([""]);
                      }
                    }}
                    className="btn btn-ghost btn-sm"
                    disabled={isSubmitting}
                  >
                    <FaTrash className="w-4 h-4 mr-2" />
                    Reset Form
                  </button>

                  {isDirty && (
                    <div className="badge badge-warning badge-sm">
                      Unsaved changes
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="btn btn-outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={`btn btn-primary min-w-32 ${
                      isSubmitting ? "loading" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        {editingEvent ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        {editingEvent ? "Update Event" : "Create Event"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventsForm;
