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
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";

// TypeScript interfaces matching MongoDB schema
interface SlideSettings {
  showCTA: boolean;
  autoPlay: boolean;
  transitionTime: number;
  interval: number;
}

interface Metadata {
  createdBy?: string;
  updatedBy?: string;
  category: "hero" | "banner" | "promotion" | "announcement";
  tags: string[];
}

interface HeroSlide {
  _id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta?: string;
  ctaLink?: string;
  overlay: string;
  isActive: boolean;
  order: number;
  slideSettings: SlideSettings;
  metadata: Metadata;
  createdAt?: string;
  updatedAt?: string;
}

interface MetadataFormData {
  createdBy?: string;
  updatedBy?: string;
  category: "hero" | "banner" | "promotion" | "announcement";
  tags: string; // String in form, converted to array on submit
}

interface HeroSlideFormData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  ctaLink: string;
  overlay: string;
  isActive: boolean;
  order: number;
  slideSettings: SlideSettings;
  metadata: MetadataFormData;
}

const overlayOptions = [
  {
    value: "from-black/60 via-black/30 to-transparent",
    label: "Dark Gradient",
  },
  {
    value: "from-primary/80 via-primary/40 to-transparent",
    label: "Primary Gradient",
  },
  {
    value: "from-secondary/80 via-secondary/40 to-transparent",
    label: "Secondary Gradient",
  },
  {
    value: "from-accent/80 via-accent/40 to-transparent",
    label: "Accent Gradient",
  },
  {
    value: "from-success/80 via-success/40 to-transparent",
    label: "Success Gradient",
  },
  {
    value: "from-warning/80 via-warning/40 to-transparent",
    label: "Warning Gradient",
  },
];

const HeroContent = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<HeroSlideFormData>();

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/carousel/getAllSlides");
      setSlides(response.data.slides || []);
    } catch (err) {
      console.error("Error fetching hero slides:", err);
      setError(
        "Failed to load hero slides. Please check your connection and try again."
      );
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const activeSlides = useMemo(
    () =>
      slides
        .filter((slide) => slide.isActive)
        .sort((a, b) => a.order - b.order),
    [slides]
  );

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Hero Content Management
          </h1>
          <p className="text-base-content/70 mt-2">
            Manage carousel slides for the homepage hero section
          </p>
        </div>
        <motion.button
          onClick={() => {
            setEditingSlide(null);
            setIsModalOpen(true);
            reset({
              title: "",
              subtitle: "",
              description: "",
              image: "",
              cta: "",
              ctaLink: "",
              overlay: "from-black/60 via-black/30 to-transparent",
              isActive: true,
              order: slides.length + 1,
              slideSettings: {
                showCTA: true,
                autoPlay: true,
                transitionTime: 800,
                interval: 5000,
              },
              metadata: {
                createdBy: "",
                updatedBy: "",
                category: "hero",
                tags: "",
              },
            });
          }}
          className="btn btn-primary gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          Add New Slide
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
            onClick={fetchSlides}
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
          <span className="ml-4 text-lg">Loading hero slides...</span>
        </div>
      ) : slides.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl text-base-300 mb-4">📸</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No Hero Slides Found
          </h3>
          <p className="text-base-content/70 mb-6">
            Get started by creating your first hero slide for the homepage
            carousel.
          </p>
          <motion.button
            onClick={() => {
              setEditingSlide(null);
              setIsModalOpen(true);
              reset({
                title: "",
                subtitle: "",
                description: "",
                image: "",
                cta: "",
                ctaLink: "",
                overlay: "from-black/60 via-black/30 to-transparent",
                isActive: true,
                order: 1,
                slideSettings: {
                  showCTA: true,
                  autoPlay: true,
                  transitionTime: 800,
                  interval: 5000,
                },
                metadata: {
                  createdBy: "",
                  updatedBy: "",
                  category: "hero",
                  tags: "",
                },
              });
            }}
            className="btn btn-primary gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            Create First Slide
          </motion.button>
        </motion.div>
      ) : (
        /* Slides Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <SlideCard
              key={slide._id}
              slide={slide}
              index={index}
              onEdit={(slide) => {
                setEditingSlide(slide);
                setIsModalOpen(true);
                reset({
                  title: slide.title,
                  subtitle: slide.subtitle,
                  description: slide.description,
                  image: slide.image,
                  cta: slide.cta || "",
                  ctaLink: slide.ctaLink || "",
                  overlay: slide.overlay,
                  isActive: slide.isActive,
                  order: slide.order,
                  slideSettings: slide.slideSettings,
                  metadata: {
                    ...slide.metadata,
                    tags: Array.isArray(slide.metadata?.tags)
                      ? slide.metadata.tags.join(", ")
                      : slide.metadata?.tags || "",
                  },
                });
              }}
              onDelete={async (slideId) => {
                const result = await Swal.fire({
                  title: "Delete Hero Slide?",
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
                      `/carousel/deleteSlide/${slideId}`
                    );
                    setSlides((prev) => prev.filter((s) => s._id !== slideId));
                    Swal.fire(
                      "Deleted!",
                      "Hero slide has been deleted.",
                      "success"
                    );
                  } catch (err) {
                    console.error("Error deleting slide:", err);
                    Swal.fire("Error!", "Failed to delete slide.", "error");
                  }
                }
              }}
              onToggleStatus={async (slideId, isActive) => {
                try {
                  await axiosInstance.patch(`/carousel/toggleSlide/${slideId}`);
                  setSlides((prev) =>
                    prev.map((s) =>
                      s._id === slideId ? { ...s, isActive: !s.isActive } : s
                    )
                  );
                  Swal.fire(
                    "Updated!",
                    `Slide ${
                      isActive ? "activated" : "deactivated"
                    } successfully.`,
                    "success"
                  );
                } catch (err) {
                  console.error("Error toggling slide status:", err);
                  Swal.fire(
                    "Error!",
                    "Failed to update slide status.",
                    "error"
                  );
                }
              }}
              onReorder={(slideId, direction) => {
                // Handle reordering logic here
                console.log("Reorder slide:", slideId, direction);
              }}
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Total Slides</div>
          <div className="stat-value text-primary">{slides.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Active Slides</div>
          <div className="stat-value text-success">{activeSlides.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-title">Inactive Slides</div>
          <div className="stat-value text-warning">
            {slides.length - activeSlides.length}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-base-300">
                <h2 className="text-2xl font-bold text-base-content">
                  {editingSlide ? "Edit Hero Slide" : "Add New Hero Slide"}
                </h2>
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

                    const slideData = {
                      ...processedData,
                      order: editingSlide
                        ? editingSlide.order
                        : slides.length + 1,
                    };

                    if (editingSlide) {
                      await axiosInstance.patch(
                        `/carousel/updateSlide/${editingSlide._id}`,
                        slideData
                      );
                      setSlides((prev) =>
                        prev.map((s) =>
                          s._id === editingSlide._id
                            ? { ...s, ...slideData }
                            : s
                        )
                      );
                      Swal.fire(
                        "Updated!",
                        "Hero slide updated successfully.",
                        "success"
                      );
                    } else {
                      const response = await axiosInstance.post(
                        "/carousel/addSlide",
                        slideData
                      );
                      setSlides((prev) => [
                        ...prev,
                        response.data.slide || slideData,
                      ]);
                      Swal.fire(
                        "Created!",
                        "Hero slide created successfully.",
                        "success"
                      );
                    }

                    setIsModalOpen(false);
                    reset();
                    setEditingSlide(null);
                  } catch (err) {
                    console.error("Error saving slide:", err);
                    Swal.fire("Error!", "Failed to save hero slide.", "error");
                  }
                })}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Title *</span>
                      </label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                        })}
                        type="text"
                        placeholder="Enter slide title"
                        className="input input-bordered w-full"
                      />
                      {errors.title && (
                        <span className="text-error text-sm mt-1">
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    {/* Subtitle */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Subtitle *
                        </span>
                      </label>
                      <input
                        {...register("subtitle", {
                          required: "Subtitle is required",
                        })}
                        type="text"
                        placeholder="Enter slide subtitle"
                        className="input input-bordered w-full"
                      />
                      {errors.subtitle && (
                        <span className="text-error text-sm mt-1">
                          {errors.subtitle.message}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Description *
                        </span>
                      </label>
                      <textarea
                        {...register("description", {
                          required: "Description is required",
                        })}
                        placeholder="Enter slide description"
                        className="textarea textarea-bordered w-full h-24 resize-none"
                      />
                      {errors.description && (
                        <span className="text-error text-sm mt-1">
                          {errors.description.message}
                        </span>
                      )}
                    </div>

                    {/* Image URL */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Image URL *
                        </span>
                      </label>
                      <input
                        {...register("image", {
                          required: "Image URL is required",
                        })}
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="input input-bordered w-full"
                      />
                      {errors.image && (
                        <span className="text-error text-sm mt-1">
                          {errors.image.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* CTA Text */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">CTA Text</span>
                      </label>
                      <input
                        {...register("cta")}
                        type="text"
                        placeholder="Join Our Community"
                        className="input input-bordered w-full"
                      />
                    </div>

                    {/* CTA Link */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">CTA Link</span>
                      </label>
                      <input
                        {...register("ctaLink")}
                        type="text"
                        placeholder="/join or https://example.com"
                        className="input input-bordered w-full"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Overlay Style *
                        </span>
                      </label>
                      <select
                        {...register("overlay", {
                          required: "Overlay style is required",
                        })}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select overlay style</option>
                        {overlayOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.overlay && (
                        <span className="text-error text-sm mt-1">
                          {errors.overlay.message}
                        </span>
                      )}
                    </div>

                    {/* Active Status */}
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text font-medium">
                          Active Status
                        </span>
                        <input
                          {...register("isActive")}
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          defaultChecked={true}
                        />
                      </label>
                    </div>

                    {/* Preview */}
                    {watch("image") && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Preview
                          </span>
                        </label>
                        <div className="relative h-32 rounded-lg overflow-hidden border border-base-300">
                          <img
                            src={watch("image")}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/kuic.jpg"; // Fallback image
                            }}
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${
                              watch("overlay") ||
                              "from-black/60 via-black/30 to-transparent"
                            }`}
                          />
                          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-2">
                            <div>
                              <h3 className="font-bold text-sm">
                                {watch("title") || "Title"}
                              </h3>
                              <p className="text-xs opacity-90">
                                {watch("subtitle") || "Subtitle"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Slide Settings */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">
                          Slide Settings
                        </span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-base-300 rounded-lg">
                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-2">
                            <input
                              {...register("slideSettings.showCTA")}
                              type="checkbox"
                              className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Show CTA Button</span>
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label cursor-pointer justify-start gap-2">
                            <input
                              {...register("slideSettings.autoPlay")}
                              type="checkbox"
                              className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Auto Play</span>
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">
                              Transition Time (ms)
                            </span>
                          </label>
                          <input
                            {...register("slideSettings.transitionTime", {
                              valueAsNumber: true,
                              min: 100,
                              max: 2000,
                            })}
                            type="number"
                            min="100"
                            max="2000"
                            step="100"
                            className="input input-bordered"
                            placeholder="500"
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Interval (ms)</span>
                          </label>
                          <input
                            {...register("slideSettings.interval", {
                              valueAsNumber: true,
                              min: 1000,
                              max: 10000,
                            })}
                            type="number"
                            min="1000"
                            max="10000"
                            step="1000"
                            className="input input-bordered"
                            placeholder="3000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">Metadata</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-base-300 rounded-lg">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Category</span>
                          </label>
                          <select
                            {...register("metadata.category")}
                            className="select select-bordered"
                          >
                            <option value="">Select category</option>
                            <option value="event">Event</option>
                            <option value="announcement">Announcement</option>
                            <option value="promotion">Promotion</option>
                            <option value="general">General</option>
                          </select>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Tags</span>
                          </label>
                          <input
                            {...register("metadata.tags")}
                            type="text"
                            className="input input-bordered"
                            placeholder="Enter tags separated by commas"
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Created By</span>
                          </label>
                          <input
                            {...register("metadata.createdBy")}
                            type="text"
                            className="input input-bordered"
                            placeholder="Creator name"
                          />
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Updated By</span>
                          </label>
                          <input
                            {...register("metadata.updatedBy")}
                            type="text"
                            className="input input-bordered"
                            placeholder="Updater name"
                          />
                        </div>
                      </div>
                    </div>
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
                    className="btn btn-primary gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        {editingSlide ? "Update Slide" : "Create Slide"}
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

// Slide Card Component
interface SlideCardProps {
  slide: HeroSlide;
  index: number;
  onEdit: (slide: HeroSlide) => void;
  onDelete: (slideId: string | number) => void;
  onToggleStatus: (slideId: string | number, isActive: boolean) => void;
  onReorder: (slideId: string | number, direction: "up" | "down") => void;
}

const SlideCard: React.FC<SlideCardProps> = ({
  slide,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
  onReorder,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`card bg-base-200 shadow-xl ${
        !slide.isActive ? "opacity-60" : ""
      }`}
    >
      {/* Image Preview */}
      <figure className="relative h-48 overflow-hidden">
        <img
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h3 className="font-bold text-lg mb-1">{slide.title}</h3>
            <p className="text-sm opacity-90">{slide.subtitle}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`badge ${
              slide.isActive ? "badge-success" : "badge-warning"
            }`}
          >
            {slide.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Order Badge */}
        <div className="absolute top-2 left-2">
          <span className="badge badge-primary">#{slide.order}</span>
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
          {slide.description}
        </p>

        {/* CTA Info */}
        {slide.cta && (
          <div className="mb-4">
            <span className="text-xs font-medium text-primary">
              CTA: {slide.cta}
            </span>
            {slide.ctaLink && (
              <p className="text-xs text-base-content/60">→ {slide.ctaLink}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-between">
          <div className="flex gap-2">
            {/* Reorder Buttons */}
            <button
              onClick={() => onReorder(slide._id!, "up")}
              className="btn btn-xs btn-ghost"
              title="Move Up"
            >
              <FaArrowUp />
            </button>
            <button
              onClick={() => onReorder(slide._id!, "down")}
              className="btn btn-xs btn-ghost"
              title="Move Down"
            >
              <FaArrowDown />
            </button>
          </div>

          <div className="flex gap-2">
            {/* Toggle Status */}
            <button
              onClick={() => onToggleStatus(slide._id!, !slide.isActive)}
              className={`btn btn-xs ${
                slide.isActive ? "btn-warning" : "btn-success"
              }`}
              title={slide.isActive ? "Deactivate" : "Activate"}
            >
              {slide.isActive ? <FaEyeSlash /> : <FaEye />}
            </button>

            {/* Edit */}
            <button
              onClick={() => onEdit(slide)}
              className="btn btn-xs btn-primary"
              title="Edit"
            >
              <FaEdit />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(slide._id!)}
              className="btn btn-xs btn-error"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
