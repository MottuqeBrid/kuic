import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaImage,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTag,
  FaEye,
} from "react-icons/fa";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

// TypeScript interfaces
interface GalleryItem {
  _id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GalleryFormData {
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
}

// Gallery Form Component
const GalleryForm: React.FC<{
  initialValues?: GalleryItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ initialValues, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<GalleryFormData>({
    defaultValues: {
      title: initialValues?.title || "",
      date: initialValues?.date
        ? initialValues.date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      location: initialValues?.location || "",
      category: initialValues?.category || "",
      image: initialValues?.image || "",
    },
  });

  const queryClient = useQueryClient();
  const watchedImage = watch("image");

  const createMutation = useMutation({
    mutationFn: async (data: GalleryFormData) => {
      try {
        const response = await axiosInstance.post("/gallery/addGalleryItem", {
          ...data,
          date: new Date(data.date),
        });
        return response.data;
      } catch {
        // In demo mode, simulate success
        console.log("Demo mode: Simulating add operation", data);
        return { success: true, demo: true };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      Swal.fire({
        icon: "success",
        title: result?.demo ? "Demo Mode" : "Success!",
        text: result?.demo
          ? "Gallery item added successfully (demo mode - changes won't persist)"
          : "Gallery item added successfully.",
        timer: 3000,
        showConfirmButton: false,
      });
      onSuccess();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to add gallery item.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: GalleryFormData) => {
      try {
        const response = await axiosInstance.patch(
          `/gallery/updateGalleryItem/${initialValues?._id}`,
          {
            ...data,
            date: new Date(data.date),
          }
        );
        return response.data;
      } catch {
        // In demo mode, simulate success
        console.log("Demo mode: Simulating update operation", data);
        return { success: true, demo: true };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      Swal.fire({
        icon: "success",
        title: result?.demo ? "Demo Mode" : "Success!",
        text: result?.demo
          ? "Gallery item updated successfully (demo mode - changes won't persist)"
          : "Gallery item updated successfully.",
        timer: 3000,
        showConfirmButton: false,
      });
      onSuccess();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update gallery item.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (initialValues) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  });

  const categories = [
    "Science",
    "Technology",
    "Entrepreneurship",
    "Philosophy",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-base-100 border border-base-200 rounded-lg p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaImage className="text-primary" />
          {initialValues ? "Edit Gallery Item" : "Add New Gallery Item"}
        </h3>
        <button
          onClick={onCancel}
          className="btn btn-ghost btn-sm"
          aria-label="Cancel"
        >
          <FaTimes />
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Image Preview */}
        {watchedImage && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Image Preview
            </label>
            <div className="relative w-full h-48 bg-base-200 rounded-lg overflow-hidden">
              <img
                src={watchedImage}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/kuic.jpg";
                }}
              />
            </div>
          </div>
        )}

        {/* Image URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            <FaImage className="inline mr-1" />
            Image URL
          </label>
          <input
            id="image"
            type="url"
            {...register("image", {
              required: "Image URL is required",
            })}
            className="input input-bordered w-full"
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && (
            <p className="text-error text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              <FaTag className="inline mr-1" />
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters long",
                },
              })}
              className="input input-bordered w-full"
              placeholder="Enter gallery item title..."
            />
            {errors.title && (
              <p className="text-error text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              <FaFilter className="inline mr-1" />
              Category
            </label>
            <select
              id="category"
              {...register("category", { required: "Category is required" })}
              className="select select-bordered w-full"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-error text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              <FaCalendarAlt className="inline mr-1" />
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register("date", { required: "Date is required" })}
              className="input input-bordered w-full"
            />
            {errors.date && (
              <p className="text-error text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-1"
            >
              <FaMapMarkerAlt className="inline mr-1" />
              Location
            </label>
            <input
              id="location"
              type="text"
              {...register("location", { required: "Location is required" })}
              className="input input-bordered w-full"
              placeholder="Enter event location..."
            />
            {errors.location && (
              <p className="text-error text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : initialValues ? (
              "Update Gallery Item"
            ) : (
              "Add Gallery Item"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Main AdminGallery Component
const AdminGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);

  const queryClient = useQueryClient();

  // Fetch Gallery Items
  const { data: galleryItems = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/gallery/getGalleryItems");
        return response.data?.galleryItems || [];
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await axiosInstance.delete(`/gallery/deleteGalleryItem/${id}`);
        return { success: true };
      } catch {
        // In demo mode, simulate success
        console.log("Demo mode: Simulating delete operation for ID:", id);
        return { success: true, demo: true };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      Swal.fire({
        icon: "success",
        title: result?.demo ? "Demo Mode" : "Deleted!",
        text: result?.demo
          ? "Gallery item deleted successfully (demo mode - changes won't persist)"
          : "Gallery item has been deleted successfully.",
        timer: 3000,
        showConfirmButton: false,
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete gallery item.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    },
  });

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(galleryItems.map((item) => item.category).filter(Boolean))
    );
    return ["All", ...uniqueCategories];
  }, [galleryItems]);

  // Filtered Gallery Items
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [galleryItems, searchQuery, categoryFilter]);

  const handleDelete = async (item: GalleryItem) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete "${item.title}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(item._id);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleView = (item: GalleryItem) => {
    setViewingItem(item);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Data Notice */}
      {galleryItems.length > 0 && galleryItems[0]._id.startsWith("demo-") && (
        <div className="alert alert-info">
          <FaImage className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Demo Mode</h3>
            <div className="text-sm">
              API not connected. Showing demo data. Add/Edit/Delete operations
              will not persist.
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content">
            Manage Gallery
          </h2>
          <p className="text-base-content/70">
            Add, edit, and organize gallery images and events
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary gap-2"
          disabled={showForm}
        >
          <FaPlus />
          Add New Image
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search gallery items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-base-content/50" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select select-bordered w-48"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <GalleryForm
            initialValues={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      <div className="bg-base-100 border border-base-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-base-200">
          <h3 className="font-semibold">
            Gallery Items ({filteredItems.length})
            {searchQuery && (
              <span className="text-sm font-normal text-base-content/70">
                {" "}
                - filtered by "{searchQuery}"
              </span>
            )}
            {categoryFilter !== "All" && (
              <span className="text-sm font-normal text-base-content/70">
                {" "}
                - {categoryFilter} category
              </span>
            )}
          </h3>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-base-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-base-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/kuic.jpg";
                      }}
                    />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(item)}
                        className="btn btn-sm btn-circle bg-white/20 border-white/30 text-white hover:bg-white/30"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn btn-sm btn-circle bg-white/20 border-white/30 text-white hover:bg-white/30"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="btn btn-sm btn-circle bg-error/80 border-error text-white hover:bg-error"
                        title="Delete"
                        disabled={deleteMutation.isPending}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="badge badge-primary badge-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <div className="space-y-1 text-xs text-base-content/60">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <FaImage className="mx-auto text-4xl text-base-content/30 mb-4" />
              <h3 className="text-lg font-medium text-base-content/70 mb-2">
                No gallery items found
              </h3>
              <p className="text-base-content/50">
                {searchQuery || categoryFilter !== "All"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first gallery item."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewingItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingItem(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-base-100 rounded-2xl overflow-hidden max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <h3 className="text-xl font-bold text-base-content">
                {viewingItem.title}
              </h3>
              <button
                onClick={() => setViewingItem(null)}
                className="p-2 hover:bg-base-200 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              <div className="relative mb-4">
                <img
                  src={viewingItem.image}
                  alt={viewingItem.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/kuic.jpg";
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="badge badge-primary">
                    {viewingItem.category}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  <span>{formatDate(viewingItem.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  <span>{viewingItem.location}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-base-300">
                <button
                  onClick={() => {
                    setViewingItem(null);
                    handleEdit(viewingItem);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setViewingItem(null);
                    handleDelete(viewingItem);
                  }}
                  className="btn btn-error btn-sm"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminGallery;
