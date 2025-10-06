import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaCrown,
  FaUsers,
} from "react-icons/fa";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";

// TypeScript interfaces matching MongoDB schema
interface SocialMedia {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  email: string;
}

interface Metadata {
  createdBy?: string;
  updatedBy?: string;
  tags: string[];
}

interface Message {
  _id?: string;
  name: string;
  title: string;
  role:
    | "Advisor"
    | "President"
    | "General Secretary"
    | "Vice President"
    | "Treasurer"
    | "Organizing Secretary"
    | "Director";
  photo: string;
  message: string;
  messageType: "advisor" | "leader";
  isActive: boolean;
  order: number;
  socialMedia: SocialMedia;
  metadata: Metadata;
  createdAt?: string;
  updatedAt?: string;
}

interface MetadataFormData {
  createdBy?: string;
  updatedBy?: string;
  tags: string; // String in form, converted to array on submit
}

interface MessageFormData {
  name: string;
  title: string;
  role:
    | "Advisor"
    | "President"
    | "General Secretary"
    | "Vice President"
    | "Treasurer"
    | "Organizing Secretary"
    | "Director";
  photo: string;
  message: string;
  messageType: "advisor" | "leader";
  isActive: boolean;
  order: number;
  socialMedia: SocialMedia;
  metadata: MetadataFormData;
}

const roleOptions = [
  "Advisor",
  "President",
  "General Secretary",
  "Vice President",
  "Treasurer",
  "Organizing Secretary",
  "Director",
];

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<MessageFormData>();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/messages/getAllMessages");
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(
        "Failed to load messages. Please check your connection and try again."
      );
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const advisorMessages = useMemo(
    () => messages.filter((msg) => msg.messageType === "advisor"),
    [messages]
  );

  const leaderMessages = useMemo(
    () =>
      messages
        .filter((msg) => msg.messageType === "leader")
        .sort((a, b) => a.order - b.order),
    [messages]
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Messages Management
          </h1>
          <p className="text-base-content/70 mt-2">
            Manage advisor and leadership messages for the website
          </p>
        </div>
        <motion.button
          onClick={() => {
            setEditingMessage(null);
            setIsModalOpen(true);
            reset({
              name: "",
              title: "",
              role: "President",
              photo: "/kuic.jpg",
              message: "",
              messageType: "leader",
              isActive: true,
              order: leaderMessages.length + 1,
              socialMedia: {
                linkedin: "",
                twitter: "",
                facebook: "",
                instagram: "",
                email: "",
              },
              metadata: {
                createdBy: "",
                updatedBy: "",
                tags: "",
              },
            });
          }}
          className="btn btn-primary gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          Add New Message
        </motion.button>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-error mb-6"
        >
          <FaExclamationTriangle />
          <div className="flex-1">
            <span>{error}</span>
          </div>
          <button
            onClick={fetchMessages}
            className="btn btn-sm btn-ghost"
            disabled={loading}
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Retry"}
          </button>
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <FaSpinner className="animate-spin text-4xl text-primary" />
          <span className="ml-4 text-lg">Loading messages...</span>
        </div>
      ) : messages.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl text-base-300 mb-4">💬</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No Messages Found
          </h3>
          <p className="text-base-content/70 mb-6">
            Get started by creating your first advisor or leadership message.
          </p>
          <motion.button
            onClick={() => {
              setEditingMessage(null);
              setIsModalOpen(true);
              reset({
                name: "",
                title: "",
                role: "President",
                photo: "/kuic.jpg",
                message: "",
                messageType: "leader",
                isActive: true,
                order: 1,
                socialMedia: {
                  linkedin: "",
                  twitter: "",
                  facebook: "",
                  instagram: "",
                  email: "",
                },
                metadata: {
                  createdBy: "",
                  updatedBy: "",
                  tags: "",
                },
              });
            }}
            className="btn btn-primary gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            Create First Message
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Advisor Messages Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaCrown className="text-2xl text-warning" />
              <h2 className="text-2xl font-bold text-base-content">
                Advisor Messages
              </h2>
              <div className="badge badge-warning badge-lg">
                {advisorMessages.length}
              </div>
            </div>

            {advisorMessages.length === 0 ? (
              <div className="bg-base-200 rounded-lg p-8 text-center">
                <FaCrown className="text-4xl text-warning mx-auto mb-4" />
                <p className="text-base-content/70">
                  No advisor messages found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {advisorMessages.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onEdit={(msg) => {
                      setEditingMessage(msg);
                      setIsModalOpen(true);
                      reset({
                        name: msg.name,
                        title: msg.title,
                        role: msg.role,
                        photo: msg.photo,
                        message: msg.message,
                        messageType: msg.messageType,
                        isActive: msg.isActive,
                        order: msg.order,
                        socialMedia: msg.socialMedia,
                        metadata: {
                          ...msg.metadata,
                          tags: Array.isArray(msg.metadata?.tags)
                            ? msg.metadata.tags.join(", ")
                            : msg.metadata?.tags || "",
                        },
                      });
                    }}
                    onDelete={async (messageId) => {
                      const result = await Swal.fire({
                        title: "Delete Message?",
                        text: "This action cannot be undone!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!",
                      });

                      if (result.isConfirmed) {
                        try {
                          await axiosInstance.delete(
                            `/messages/deleteMessage/${messageId}`
                          );
                          setMessages((prev) =>
                            prev.filter((m) => m._id !== messageId)
                          );
                          Swal.fire(
                            "Deleted!",
                            "Message deleted successfully.",
                            "success"
                          );
                        } catch (err) {
                          console.error("Error deleting message:", err);
                          Swal.fire(
                            "Error!",
                            "Failed to delete message.",
                            "error"
                          );
                        }
                      }
                    }}
                    onToggleStatus={async (messageId, isActive) => {
                      try {
                        await axiosInstance.patch(
                          `/messages/toggleMessage/${messageId}`
                        );
                        setMessages((prev) =>
                          prev.map((m) =>
                            m._id === messageId
                              ? { ...m, isActive: !m.isActive }
                              : m
                          )
                        );
                        Swal.fire(
                          "Updated!",
                          `Message ${
                            isActive ? "activated" : "deactivated"
                          } successfully.`,
                          "success"
                        );
                      } catch (err) {
                        console.error("Error toggling message status:", err);
                        Swal.fire(
                          "Error!",
                          "Failed to update message status.",
                          "error"
                        );
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Leaders Messages Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaUsers className="text-2xl text-primary" />
              <h2 className="text-2xl font-bold text-base-content">
                Leadership Messages
              </h2>
              <div className="badge badge-primary badge-lg">
                {leaderMessages.length}
              </div>
            </div>

            {leaderMessages.length === 0 ? (
              <div className="bg-base-200 rounded-lg p-8 text-center">
                <FaUsers className="text-4xl text-primary mx-auto mb-4" />
                <p className="text-base-content/70">
                  No leadership messages found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {leaderMessages.map((message) => (
                  <MessageCard
                    key={message._id}
                    message={message}
                    onEdit={(msg) => {
                      setEditingMessage(msg);
                      setIsModalOpen(true);
                      reset({
                        name: msg.name,
                        title: msg.title,
                        role: msg.role,
                        photo: msg.photo,
                        message: msg.message,
                        messageType: msg.messageType,
                        isActive: msg.isActive,
                        order: msg.order,
                        socialMedia: msg.socialMedia,
                        metadata: {
                          ...msg.metadata,
                          tags: Array.isArray(msg.metadata?.tags)
                            ? msg.metadata.tags.join(", ")
                            : msg.metadata?.tags || "",
                        },
                      });
                    }}
                    onDelete={async (messageId) => {
                      const result = await Swal.fire({
                        title: "Delete Message?",
                        text: "This action cannot be undone!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!",
                      });

                      if (result.isConfirmed) {
                        try {
                          await axiosInstance.delete(
                            `/messages/deleteMessage/${messageId}`
                          );
                          setMessages((prev) =>
                            prev.filter((m) => m._id !== messageId)
                          );
                          Swal.fire(
                            "Deleted!",
                            "Message deleted successfully.",
                            "success"
                          );
                        } catch (err) {
                          console.error("Error deleting message:", err);
                          Swal.fire(
                            "Error!",
                            "Failed to delete message.",
                            "error"
                          );
                        }
                      }
                    }}
                    onToggleStatus={async (messageId, isActive) => {
                      try {
                        await axiosInstance.patch(
                          `/messages/toggleMessage/${messageId}`
                        );
                        setMessages((prev) =>
                          prev.map((m) =>
                            m._id === messageId
                              ? { ...m, isActive: !m.isActive }
                              : m
                          )
                        );
                        Swal.fire(
                          "Updated!",
                          `Message ${
                            isActive ? "activated" : "deactivated"
                          } successfully.`,
                          "success"
                        );
                      } catch (err) {
                        console.error("Error toggling message status:", err);
                        Swal.fire(
                          "Error!",
                          "Failed to update message status.",
                          "error"
                        );
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-primary">
            <FaCrown className="text-2xl" />
          </div>
          <div className="stat-title">Advisor Messages</div>
          <div className="stat-value text-primary">
            {advisorMessages.length}
          </div>
          <div className="stat-desc">
            {advisorMessages.filter((m) => m.isActive).length} active
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-2xl" />
          </div>
          <div className="stat-title">Leadership Messages</div>
          <div className="stat-value text-secondary">
            {leaderMessages.length}
          </div>
          <div className="stat-desc">
            {leaderMessages.filter((m) => m.isActive).length} active
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Messages</div>
          <div className="stat-value text-accent">{messages.length}</div>
          <div className="stat-desc">
            {messages.filter((m) => m.isActive).length} active
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Active Rate</div>
          <div className="stat-value text-info">
            {messages.length > 0
              ? Math.round(
                  (messages.filter((m) => m.isActive).length /
                    messages.length) *
                    100
                )
              : 0}
            %
          </div>
        </div>
      </div>

      {/* Message Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-base-100 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-base-300">
                <h3 className="text-2xl font-bold text-base-content">
                  {editingMessage ? "Edit Message" : "Add New Message"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={handleSubmit(async (data) => {
                  try {
                    // Convert tags string to array
                    const processedData = {
                      ...data,
                      metadata: {
                        ...data.metadata,
                        tags:
                          typeof data.metadata?.tags === "string"
                            ? data.metadata.tags
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter((tag) => tag.length > 0)
                            : data.metadata?.tags || [],
                      },
                    };

                    const messageData = {
                      ...processedData,
                      order: editingMessage
                        ? editingMessage.order
                        : data.messageType === "leader"
                        ? leaderMessages.length + 1
                        : 0,
                    };

                    if (editingMessage) {
                      await axiosInstance.patch(
                        `/messages/updateMessage/${editingMessage._id}`,
                        messageData
                      );
                      setMessages((prev) =>
                        prev.map((m) =>
                          m._id === editingMessage._id
                            ? { ...m, ...messageData }
                            : m
                        )
                      );
                      Swal.fire(
                        "Updated!",
                        "Message updated successfully.",
                        "success"
                      );
                    } else {
                      const response = await axiosInstance.post(
                        "/messages/addMessage",
                        messageData
                      );
                      setMessages((prev) => [
                        ...prev,
                        response.data.data || messageData,
                      ]);
                      Swal.fire(
                        "Created!",
                        "Message created successfully.",
                        "success"
                      );
                    }

                    setIsModalOpen(false);
                    reset();
                    setEditingMessage(null);
                  } catch (err) {
                    console.error("Error saving message:", err);
                    Swal.fire("Error!", "Failed to save message.", "error");
                  }
                })}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Name *</span>
                      </label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        className="input input-bordered"
                        placeholder="Enter full name"
                      />
                      {errors.name && (
                        <span className="text-error text-sm mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Message Title *
                        </span>
                      </label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                        })}
                        type="text"
                        className="input input-bordered"
                        placeholder="e.g., Message from the President"
                      />
                      {errors.title && (
                        <span className="text-error text-sm mt-1">
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    {/* Role */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Role *</span>
                      </label>
                      <select
                        {...register("role", { required: "Role is required" })}
                        className="select select-bordered"
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      {errors.role && (
                        <span className="text-error text-sm mt-1">
                          {errors.role.message}
                        </span>
                      )}
                    </div>

                    {/* Message Type */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Message Type *
                        </span>
                      </label>
                      <div className="flex gap-4">
                        <label className="label cursor-pointer">
                          <input
                            {...register("messageType")}
                            type="radio"
                            value="advisor"
                            className="radio radio-primary"
                          />
                          <span className="label-text ml-2">Advisor</span>
                        </label>
                        <label className="label cursor-pointer">
                          <input
                            {...register("messageType")}
                            type="radio"
                            value="leader"
                            className="radio radio-primary"
                          />
                          <span className="label-text ml-2">Leader</span>
                        </label>
                      </div>
                    </div>

                    {/* Photo URL */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Photo URL
                        </span>
                      </label>
                      <input
                        {...register("photo")}
                        type="url"
                        className="input input-bordered"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>

                    {/* Order (for leaders only) */}
                    {watch("messageType") === "leader" && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Display Order
                          </span>
                        </label>
                        <input
                          {...register("order", {
                            valueAsNumber: true,
                            min: 0,
                          })}
                          type="number"
                          min="0"
                          className="input input-bordered"
                          placeholder="0"
                        />
                      </div>
                    )}

                    {/* Active Status */}
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-3">
                        <input
                          {...register("isActive")}
                          type="checkbox"
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text font-medium">Active</span>
                      </label>
                    </div>
                  </div>

                  {/* Right Column - Message & Details */}
                  <div className="space-y-4">
                    {/* Message */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Message *
                        </span>
                      </label>
                      <textarea
                        {...register("message", {
                          required: "Message is required",
                        })}
                        className="textarea textarea-bordered h-32"
                        placeholder="Enter the message content..."
                      />
                      {errors.message && (
                        <span className="text-error text-sm mt-1">
                          {errors.message.message}
                        </span>
                      )}
                    </div>

                    {/* Social Media Links */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">
                          Social Media Links
                        </span>
                      </label>
                      <div className="space-y-3 p-4 border border-base-300 rounded-lg">
                        <div className="grid grid-cols-1 gap-3">
                          <input
                            {...register("socialMedia.linkedin")}
                            type="url"
                            className="input input-bordered input-sm"
                            placeholder="LinkedIn URL"
                          />
                          <input
                            {...register("socialMedia.twitter")}
                            type="url"
                            className="input input-bordered input-sm"
                            placeholder="Twitter URL"
                          />
                          <input
                            {...register("socialMedia.facebook")}
                            type="url"
                            className="input input-bordered input-sm"
                            placeholder="Facebook URL"
                          />
                          <input
                            {...register("socialMedia.instagram")}
                            type="url"
                            className="input input-bordered input-sm"
                            placeholder="Instagram URL"
                          />
                          <input
                            {...register("socialMedia.email")}
                            type="email"
                            className="input input-bordered input-sm"
                            placeholder="Email Address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">Metadata</span>
                      </label>
                      <div className="space-y-3 p-4 border border-base-300 rounded-lg">
                        <input
                          {...register("metadata.createdBy")}
                          type="text"
                          className="input input-bordered input-sm"
                          placeholder="Created By"
                        />
                        <input
                          {...register("metadata.updatedBy")}
                          type="text"
                          className="input input-bordered input-sm"
                          placeholder="Updated By"
                        />
                        <input
                          {...register("metadata.tags")}
                          type="text"
                          className="input input-bordered input-sm"
                          placeholder="Tags (comma separated)"
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    {watch("photo") && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Photo Preview
                          </span>
                        </label>
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-base-300">
                          <img
                            src={watch("photo")}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/kuic.jpg";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-4 border-t border-base-300">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {editingMessage ? "Update Message" : "Create Message"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// MessageCard Component
interface MessageCardProps {
  message: Message;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onToggleStatus: (messageId: string, isActive: boolean) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const getSocialMediaLinks = (socialMedia: SocialMedia) => {
    const links = [];
    if (socialMedia.linkedin)
      links.push({
        icon: FaLinkedin,
        url: socialMedia.linkedin,
        color: "text-blue-600",
      });
    if (socialMedia.twitter)
      links.push({
        icon: FaTwitter,
        url: socialMedia.twitter,
        color: "text-sky-500",
      });
    if (socialMedia.facebook)
      links.push({
        icon: FaFacebook,
        url: socialMedia.facebook,
        color: "text-blue-700",
      });
    if (socialMedia.instagram)
      links.push({
        icon: FaInstagram,
        url: socialMedia.instagram,
        color: "text-pink-600",
      });
    if (socialMedia.email)
      links.push({
        icon: FaEnvelope,
        url: `mailto:${socialMedia.email}`,
        color: "text-gray-600",
      });
    return links;
  };

  const socialLinks = getSocialMediaLinks(message.socialMedia);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-base-200 shadow-lg border-l-4 ${
        message.messageType === "advisor"
          ? "border-l-warning"
          : "border-l-primary"
      } ${!message.isActive ? "opacity-60" : ""}`}
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Profile Image */}
            <div className="avatar">
              <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-2">
                <img
                  src={message.photo}
                  alt={message.name}
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/kuic.jpg";
                  }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg text-base-content">
                    {message.name}
                  </h3>
                  <p className="text-sm text-base-content/70 font-medium">
                    {message.role}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`badge badge-sm ${
                        message.messageType === "advisor"
                          ? "badge-warning"
                          : "badge-primary"
                      }`}
                    >
                      {message.messageType === "advisor" ? "Advisor" : "Leader"}
                    </div>
                    <div
                      className={`badge badge-sm ${
                        message.isActive ? "badge-success" : "badge-error"
                      }`}
                    >
                      {message.isActive ? "Active" : "Inactive"}
                    </div>
                    {message.messageType === "leader" && (
                      <div className="badge badge-sm badge-outline">
                        Order: {message.order}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-base text-primary mt-3">
                {message.title}
              </h4>

              <p className="text-sm text-base-content/80 mt-2 line-clamp-3">
                {message.message}
              </p>

              {/* Social Media Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-base-content/60">Social:</span>
                  {socialLinks.map(({ icon: Icon, url, color }, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${color} hover:scale-110 transition-transform`}
                    >
                      <Icon className="text-sm" />
                    </a>
                  ))}
                </div>
              )}

              {/* Tags */}
              {message.metadata?.tags && message.metadata.tags.length > 0 && (
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  <span className="text-xs text-base-content/60">Tags:</span>
                  {message.metadata.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="badge badge-xs badge-outline">
                      {tag}
                    </span>
                  ))}
                  {message.metadata.tags.length > 3 && (
                    <span className="badge badge-xs badge-outline">
                      +{message.metadata.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-4 h-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button
                  onClick={() => onEdit(message)}
                  className="flex items-center gap-2"
                >
                  <FaEdit className="text-primary" />
                  Edit Message
                </button>
              </li>
              <li>
                <button
                  onClick={() => onToggleStatus(message._id!, message.isActive)}
                  className="flex items-center gap-2"
                >
                  {message.isActive ? (
                    <>
                      <FaEyeSlash className="text-warning" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <FaEye className="text-success" />
                      Activate
                    </>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onDelete(message._id!)}
                  className="flex items-center gap-2 text-error"
                >
                  <FaTrash />
                  Delete Message
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-xs text-base-content/50 flex items-center justify-between mt-4 pt-3 border-t border-base-300">
          <span>
            Created:{" "}
            {message.createdAt
              ? new Date(message.createdAt).toLocaleDateString()
              : "Unknown"}
          </span>
          {message.updatedAt && message.updatedAt !== message.createdAt && (
            <span>
              Updated: {new Date(message.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminMessages;
