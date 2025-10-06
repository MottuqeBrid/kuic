import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm, useFieldArray } from "react-hook-form";
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
  FaFlask,
  FaCode,
  FaRocket,
  FaBookOpen,
  FaLightbulb,
  FaCog,
  FaBrain,
  FaGraduationCap,
  FaChartBar,
  FaUsers,
  FaProjectDiagram,
  FaTags,
} from "react-icons/fa";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";

// TypeScript interfaces matching MongoDB schema
interface RelatedCourse {
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface Resource {
  title: string;
  type: "book" | "website" | "video" | "article" | "tool" | "course";
  url: string;
  description: string;
}

interface DetailedInfo {
  overview: string;
  objectives: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  relatedCourses: RelatedCourse[];
  resources: Resource[];
}

interface Statistics {
  enrolledMembers: number;
  completedProjects: number;
  activeProjects: number;
}

interface Metadata {
  createdBy?: string;
  updatedBy?: string;
  category: "core" | "specialized" | "workshop" | "seminar";
  tags: string[];
}

interface Segment {
  _id?: string;
  title: string;
  description: string;
  icon:
    | "FaFlask"
    | "FaCode"
    | "FaRocket"
    | "FaBookOpen"
    | "FaLightbulb"
    | "FaCog"
    | "FaBrain"
    | "FaGraduationCap";
  accentColor: string;
  features: string[];
  isActive: boolean;
  order: number;
  slug: string;
  detailedInfo: DetailedInfo;
  statistics: Statistics;
  metadata: Metadata;
  createdAt?: string;
  updatedAt?: string;
}

interface MetadataFormData {
  createdBy?: string;
  updatedBy?: string;
  category: "core" | "specialized" | "workshop" | "seminar";
  tags: string; // String in form, converted to array on submit
}

interface SegmentFormData {
  title: string;
  description: string;
  icon:
    | "FaFlask"
    | "FaCode"
    | "FaRocket"
    | "FaBookOpen"
    | "FaLightbulb"
    | "FaCog"
    | "FaBrain"
    | "FaGraduationCap";
  accentColor: string;
  features: string[];
  isActive: boolean;
  order: number;
  slug: string;
  detailedInfo: {
    overview: string;
    objectives: string[];
    prerequisites: string[];
    learningOutcomes: string[];
  };
  statistics: Statistics;
  metadata: MetadataFormData;
}

const iconOptions = [
  { value: "FaFlask", label: "Science (Flask)", icon: FaFlask },
  { value: "FaCode", label: "Technology (Code)", icon: FaCode },
  { value: "FaRocket", label: "Entrepreneurship (Rocket)", icon: FaRocket },
  { value: "FaBookOpen", label: "Philosophy (Book)", icon: FaBookOpen },
  { value: "FaLightbulb", label: "Innovation (Lightbulb)", icon: FaLightbulb },
  { value: "FaCog", label: "Engineering (Cog)", icon: FaCog },
  { value: "FaBrain", label: "AI/Psychology (Brain)", icon: FaBrain },
  {
    value: "FaGraduationCap",
    label: "Education (Graduation)",
    icon: FaGraduationCap,
  },
];

const colorOptions = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

const categoryOptions = [
  { value: "core", label: "Core Area" },
  { value: "specialized", label: "Specialized" },
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
];

const AdminCoreAreas = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SegmentFormData>();

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
  } = useFieldArray({
    control,
    name: "features" as const,
  });

  const {
    fields: objectiveFields,
    append: appendObjective,
    remove: removeObjective,
  } = useFieldArray({
    control,
    name: "detailedInfo.objectives" as const,
  });

  // These field arrays are defined for future use in extended form
  // const { fields: prerequisiteFields, append: appendPrerequisite, remove: removePrerequisite } = useFieldArray({
  //   control,
  //   name: "detailedInfo.prerequisites"
  // });

  // const { fields: outcomeFields, append: appendOutcome, remove: removeOutcome } = useFieldArray({
  //   control,
  //   name: "detailedInfo.learningOutcomes"
  // });

  const fetchSegments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/segments/getAllSegments");
      setSegments(response.data.segments || []);
    } catch (err) {
      console.error("Error fetching segments:", err);
      setError(
        "Failed to load segments. Please check your connection and try again."
      );
      setSegments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);

  const coreSegments = useMemo(
    () =>
      segments
        .filter((seg) => seg.metadata.category === "core")
        .sort((a, b) => a.order - b.order),
    [segments]
  );

  const otherSegments = useMemo(
    () =>
      segments
        .filter((seg) => seg.metadata.category !== "core")
        .sort((a, b) => a.order - b.order),
    [segments]
  );

  const getIconComponent = (iconName: string) => {
    const iconMap: {
      [key: string]: React.ComponentType<{ className?: string }>;
    } = {
      FaFlask,
      FaCode,
      FaRocket,
      FaBookOpen,
      FaLightbulb,
      FaCog,
      FaBrain,
      FaGraduationCap,
    };
    return iconMap[iconName] || FaRocket;
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">
            Core Areas Management
          </h1>
          <p className="text-base-content/70 mt-2">
            Manage segments for Science, Technology, Entrepreneurship,
            Philosophy and more
          </p>
        </div>
        <motion.button
          onClick={() => {
            setEditingSegment(null);
            setIsModalOpen(true);
            reset({
              title: "",
              description: "",
              icon: "FaRocket",
              accentColor: "bg-blue-500",
              features: [""],
              isActive: true,
              order: segments.length + 1,
              slug: "",
              detailedInfo: {
                overview: "",
                objectives: [""],
                prerequisites: [""],
                learningOutcomes: [""],
              },
              statistics: {
                enrolledMembers: 0,
                completedProjects: 0,
                activeProjects: 0,
              },
              metadata: {
                createdBy: "",
                updatedBy: "",
                category: "core",
                tags: "",
              },
            });
          }}
          className="btn btn-primary gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlus />
          Add New Segment
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
            onClick={fetchSegments}
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
          <span className="ml-4 text-lg">Loading segments...</span>
        </div>
      ) : segments.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl text-base-300 mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No Segments Found
          </h3>
          <p className="text-base-content/70 mb-6">
            Get started by creating your first core area segment.
          </p>
          <motion.button
            onClick={() => {
              setEditingSegment(null);
              setIsModalOpen(true);
              reset({
                title: "",
                description: "",
                icon: "FaRocket",
                accentColor: "bg-blue-500",
                features: [""],
                isActive: true,
                order: 1,
                slug: "",
                detailedInfo: {
                  overview: "",
                  objectives: [""],
                  prerequisites: [""],
                  learningOutcomes: [""],
                },
                statistics: {
                  enrolledMembers: 0,
                  completedProjects: 0,
                  activeProjects: 0,
                },
                metadata: {
                  createdBy: "",
                  updatedBy: "",
                  category: "core",
                  tags: "",
                },
              });
            }}
            className="btn btn-primary gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            Create First Segment
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Core Segments Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FaTags className="text-2xl text-primary" />
              <h2 className="text-2xl font-bold text-base-content">
                Core Areas
              </h2>
              <div className="badge badge-primary badge-lg">
                {coreSegments.length}
              </div>
            </div>

            {coreSegments.length === 0 ? (
              <div className="bg-base-200 rounded-lg p-8 text-center">
                <FaTags className="text-4xl text-primary mx-auto mb-4" />
                <p className="text-base-content/70">No core segments found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {coreSegments.map((segment) => (
                  <SegmentCard
                    key={segment._id}
                    segment={segment}
                    onEdit={handleEditSegment}
                    onDelete={handleDeleteSegment}
                    onToggleStatus={handleToggleStatus}
                    getIconComponent={getIconComponent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Other Segments Section */}
          {otherSegments.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <FaProjectDiagram className="text-2xl text-secondary" />
                <h2 className="text-2xl font-bold text-base-content">
                  Other Segments
                </h2>
                <div className="badge badge-secondary badge-lg">
                  {otherSegments.length}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {otherSegments.map((segment) => (
                  <SegmentCard
                    key={segment._id}
                    segment={segment}
                    onEdit={handleEditSegment}
                    onDelete={handleDeleteSegment}
                    onToggleStatus={handleToggleStatus}
                    getIconComponent={getIconComponent}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-primary">
            <FaTags className="text-2xl" />
          </div>
          <div className="stat-title">Core Segments</div>
          <div className="stat-value text-primary">{coreSegments.length}</div>
          <div className="stat-desc">
            {coreSegments.filter((s) => s.isActive).length} active
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-secondary">
            <FaProjectDiagram className="text-2xl" />
          </div>
          <div className="stat-title">Other Segments</div>
          <div className="stat-value text-secondary">
            {otherSegments.length}
          </div>
          <div className="stat-desc">
            {otherSegments.filter((s) => s.isActive).length} active
          </div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-accent">
            <FaUsers className="text-2xl" />
          </div>
          <div className="stat-title">Total Members</div>
          <div className="stat-value text-accent">
            {segments.reduce((sum, s) => sum + s.statistics.enrolledMembers, 0)}
          </div>
          <div className="stat-desc">Across all segments</div>
        </div>

        <div className="stat bg-base-200 rounded-lg">
          <div className="stat-figure text-info">
            <FaChartBar className="text-2xl" />
          </div>
          <div className="stat-title">Active Projects</div>
          <div className="stat-value text-info">
            {segments.reduce((sum, s) => sum + s.statistics.activeProjects, 0)}
          </div>
          <div className="stat-desc">
            {segments.reduce(
              (sum, s) => sum + s.statistics.completedProjects,
              0
            )}{" "}
            completed
          </div>
        </div>
      </div>

      {/* Segment Form Modal */}
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
              className="bg-base-100 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-base-300">
                <h3 className="text-2xl font-bold text-base-content">
                  {editingSegment ? "Edit Segment" : "Add New Segment"}
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
                      slug: data.slug || generateSlug(data.title),
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

                    const segmentData = {
                      ...processedData,
                      order: editingSegment
                        ? editingSegment.order
                        : segments.length + 1,
                      detailedInfo: {
                        ...processedData.detailedInfo,
                        relatedCourses:
                          editingSegment?.detailedInfo.relatedCourses || [],
                        resources: editingSegment?.detailedInfo.resources || [],
                      },
                    };

                    if (editingSegment) {
                      await axiosInstance.patch(
                        `/segments/updateSegment/${editingSegment._id}`,
                        segmentData
                      );
                      setSegments((prev) =>
                        prev.map((s) =>
                          s._id === editingSegment._id
                            ? { ...s, ...segmentData }
                            : s
                        )
                      );
                      Swal.fire(
                        "Updated!",
                        "Segment updated successfully.",
                        "success"
                      );
                    } else {
                      const response = await axiosInstance.post(
                        "/segments/addSegment",
                        segmentData
                      );
                      setSegments((prev) => [
                        ...prev,
                        response.data.segment || segmentData,
                      ]);
                      Swal.fire(
                        "Created!",
                        "Segment created successfully.",
                        "success"
                      );
                    }

                    setIsModalOpen(false);
                    reset();
                    setEditingSegment(null);
                  } catch (err) {
                    console.error("Error saving segment:", err);
                    Swal.fire("Error!", "Failed to save segment.", "error");
                  }
                })}
                className="p-6 space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Title *</span>
                      </label>
                      <input
                        {...register("title", {
                          required: "Title is required",
                          onChange: (e) => {
                            if (!editingSegment) {
                              setValue("slug", generateSlug(e.target.value));
                            }
                          },
                        })}
                        type="text"
                        className="input input-bordered"
                        placeholder="e.g., Technology"
                      />
                      {errors.title && (
                        <span className="text-error text-sm mt-1">
                          {errors.title.message}
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
                        className="textarea textarea-bordered h-24"
                        placeholder="Enter segment description..."
                      />
                      {errors.description && (
                        <span className="text-error text-sm mt-1">
                          {errors.description.message}
                        </span>
                      )}
                    </div>

                    {/* Icon */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Icon *</span>
                      </label>
                      <select
                        {...register("icon", { required: "Icon is required" })}
                        className="select select-bordered"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Accent Color */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Accent Color *
                        </span>
                      </label>
                      <select
                        {...register("accentColor", {
                          required: "Color is required",
                        })}
                        className="select select-bordered"
                      >
                        {colorOptions.map((color) => (
                          <option key={color} value={color}>
                            {color.replace("bg-", "").replace("-500", "")}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <div
                          className={`w-8 h-8 rounded ${watch(
                            "accentColor"
                          )} border border-base-300`}
                        ></div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Category *
                        </span>
                      </label>
                      <select
                        {...register("metadata.category", {
                          required: "Category is required",
                        })}
                        className="select select-bordered"
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Slug */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Slug</span>
                      </label>
                      <input
                        {...register("slug")}
                        type="text"
                        className="input input-bordered"
                        placeholder="auto-generated-from-title"
                        readOnly={!editingSegment}
                      />
                      <div className="label">
                        <span className="label-text-alt">
                          URL: /segments/{watch("slug")}
                        </span>
                      </div>
                    </div>

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

                  {/* Right Column - Features & Details */}
                  <div className="space-y-4">
                    {/* Features */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Features</span>
                      </label>
                      <div className="space-y-2">
                        {featureFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2">
                            <input
                              {...register(`features.${index}` as const)}
                              type="text"
                              className="input input-bordered input-sm flex-1"
                              placeholder={`Feature ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="btn btn-sm btn-error btn-outline"
                              disabled={featureFields.length <= 1}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => appendFeature("")}
                          className="btn btn-sm btn-outline"
                        >
                          <FaPlus /> Add Feature
                        </button>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold">Statistics</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2 p-4 border border-base-300 rounded-lg">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs">Members</span>
                          </label>
                          <input
                            {...register("statistics.enrolledMembers", {
                              valueAsNumber: true,
                              min: 0,
                            })}
                            type="number"
                            min="0"
                            className="input input-bordered input-sm"
                            placeholder="0"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs">
                              Active Projects
                            </span>
                          </label>
                          <input
                            {...register("statistics.activeProjects", {
                              valueAsNumber: true,
                              min: 0,
                            })}
                            type="number"
                            min="0"
                            className="input input-bordered input-sm"
                            placeholder="0"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-xs">
                              Completed
                            </span>
                          </label>
                          <input
                            {...register("statistics.completedProjects", {
                              valueAsNumber: true,
                              min: 0,
                            })}
                            type="number"
                            min="0"
                            className="input input-bordered input-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Overview */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Overview</span>
                      </label>
                      <textarea
                        {...register("detailedInfo.overview")}
                        className="textarea textarea-bordered h-20"
                        placeholder="Detailed overview of the segment..."
                      />
                    </div>

                    {/* Objectives */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Objectives
                        </span>
                      </label>
                      <div className="space-y-2">
                        {objectiveFields.map((field, index) => (
                          <div key={field.id} className="flex gap-2">
                            <input
                              {...register(
                                `detailedInfo.objectives.${index}` as const
                              )}
                              type="text"
                              className="input input-bordered input-sm flex-1"
                              placeholder={`Objective ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeObjective(index)}
                              className="btn btn-sm btn-error btn-outline"
                              disabled={objectiveFields.length <= 1}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => appendObjective("")}
                          className="btn btn-sm btn-outline"
                        >
                          <FaPlus /> Add Objective
                        </button>
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
                          {...register("metadata.tags")}
                          type="text"
                          className="input input-bordered input-sm"
                          placeholder="Tags (comma separated)"
                        />
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
                        {editingSegment ? "Update Segment" : "Create Segment"}
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

  // Helper functions
  function handleEditSegment(segment: Segment) {
    setEditingSegment(segment);
    setIsModalOpen(true);
    reset({
      title: segment.title,
      description: segment.description,
      icon: segment.icon,
      accentColor: segment.accentColor,
      features: segment.features,
      isActive: segment.isActive,
      order: segment.order,
      slug: segment.slug,
      detailedInfo: {
        overview: segment.detailedInfo.overview,
        objectives: segment.detailedInfo.objectives,
        prerequisites: segment.detailedInfo.prerequisites,
        learningOutcomes: segment.detailedInfo.learningOutcomes,
      },
      statistics: segment.statistics,
      metadata: {
        ...segment.metadata,
        tags: Array.isArray(segment.metadata?.tags)
          ? segment.metadata.tags.join(", ")
          : segment.metadata?.tags || "",
      },
    });
  }

  async function handleDeleteSegment(segmentId: string) {
    const result = await Swal.fire({
      title: "Delete Segment?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/segments/deleteSegment/${segmentId}`);
        setSegments((prev) => prev.filter((s) => s._id !== segmentId));
        Swal.fire("Deleted!", "Segment deleted successfully.", "success");
      } catch (err) {
        console.error("Error deleting segment:", err);
        Swal.fire("Error!", "Failed to delete segment.", "error");
      }
    }
  }

  async function handleToggleStatus(segmentId: string, isActive: boolean) {
    try {
      await axiosInstance.patch(`/segments/toggleSegment/${segmentId}`);
      setSegments((prev) =>
        prev.map((s) =>
          s._id === segmentId ? { ...s, isActive: !s.isActive } : s
        )
      );
      Swal.fire(
        "Updated!",
        `Segment ${isActive ? "deactivated" : "activated"} successfully.`,
        "success"
      );
    } catch (err) {
      console.error("Error toggling segment status:", err);
      Swal.fire("Error!", "Failed to update segment status.", "error");
    }
  }
};

// SegmentCard Component
interface SegmentCardProps {
  segment: Segment;
  onEdit: (segment: Segment) => void;
  onDelete: (segmentId: string) => void;
  onToggleStatus: (segmentId: string, isActive: boolean) => void;
  getIconComponent: (
    iconName: string
  ) => React.ComponentType<{ className?: string }>;
}

const SegmentCard: React.FC<SegmentCardProps> = ({
  segment,
  onEdit,
  onDelete,
  onToggleStatus,
  getIconComponent,
}) => {
  const IconComponent = getIconComponent(segment.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 ${
        !segment.isActive ? "opacity-60" : ""
      }`}
    >
      <div className="card-body">
        {/* Header with Icon and Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`p-3 rounded-lg ${segment.accentColor} flex-shrink-0`}
            >
              <IconComponent className="text-2xl text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-base-content mb-1">
                {segment.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`badge badge-sm ${
                    segment.metadata.category === "core"
                      ? "badge-primary"
                      : "badge-secondary"
                  }`}
                >
                  {segment.metadata.category}
                </div>
                <div
                  className={`badge badge-sm ${
                    segment.isActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {segment.isActive ? "Active" : "Inactive"}
                </div>
                <div className="badge badge-sm badge-outline">
                  Order: {segment.order}
                </div>
              </div>
              <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                {segment.description}
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
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
                  onClick={() => onEdit(segment)}
                  className="flex items-center gap-2"
                >
                  <FaEdit className="text-primary" />
                  Edit Segment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onToggleStatus(segment._id!, segment.isActive)}
                  className="flex items-center gap-2"
                >
                  {segment.isActive ? (
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
                  onClick={() => onDelete(segment._id!)}
                  className="flex items-center gap-2 text-error"
                >
                  <FaTrash />
                  Delete Segment
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm text-base-content mb-2">
            Features:
          </h4>
          <div className="flex flex-wrap gap-1">
            {segment.features.slice(0, 3).map((feature, index) => (
              <span key={index} className="badge badge-xs badge-outline">
                {feature}
              </span>
            ))}
            {segment.features.length > 3 && (
              <span className="badge badge-xs badge-outline">
                +{segment.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center">
            <div className="font-bold text-primary">
              {segment.statistics.enrolledMembers}
            </div>
            <div className="text-xs text-base-content/60">Members</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-success">
              {segment.statistics.activeProjects}
            </div>
            <div className="text-xs text-base-content/60">Active</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-info">
              {segment.statistics.completedProjects}
            </div>
            <div className="text-xs text-base-content/60">Completed</div>
          </div>
        </div>

        {/* Tags */}
        {segment.metadata?.tags && segment.metadata.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap mb-3">
            <span className="text-xs text-base-content/60">Tags:</span>
            {segment.metadata.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="badge badge-xs badge-ghost">
                {tag}
              </span>
            ))}
            {segment.metadata.tags.length > 2 && (
              <span className="badge badge-xs badge-ghost">
                +{segment.metadata.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="text-xs text-base-content/50 flex items-center justify-between pt-3 border-t border-base-300">
          <span>
            Created:{" "}
            {segment.createdAt
              ? new Date(segment.createdAt).toLocaleDateString()
              : "Unknown"}
          </span>
          <span className="font-mono">/{segment.slug}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminCoreAreas;
