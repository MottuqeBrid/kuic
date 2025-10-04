import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaQuestionCircle,
  FaComment,
} from "react-icons/fa";
import axiosInstance from "../../../hooks/axiosInstance";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// TypeScript interfaces
interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FAQFormData {
  question: string;
  answer: string;
}

// FAQ Form Component
const FAQForm: React.FC<{
  initialValues?: FAQ | null;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ initialValues, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FAQFormData>({
    defaultValues: {
      question: initialValues?.question || "",
      answer: initialValues?.answer || "",
    },
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      const response = await axiosInstance.post("/faqs/addFAQ", data);
      return response?.data?.faq;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "FAQ added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to add FAQ.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FAQFormData) => {
      const response = await axiosInstance.patch(
        `/faqs/updateFAQ/${initialValues?._id}`,
        data
      );
      return response.data?.faq;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "FAQ updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      onSuccess();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to update FAQ.";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-base-100 border border-base-200 rounded-lg p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FaQuestionCircle className="text-primary" />
          {initialValues ? "Edit FAQ" : "Add New FAQ"}
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
        {/* Question */}
        <div>
          <label htmlFor="question" className="block text-sm font-medium mb-1">
            <FaQuestionCircle className="inline mr-1" />
            Question
          </label>
          <input
            id="question"
            type="text"
            {...register("question", {
              required: "Question is required",
              minLength: {
                value: 10,
                message: "Question must be at least 10 characters long",
              },
            })}
            className="input input-bordered w-full"
            placeholder="Enter your FAQ question..."
          />
          {errors.question && (
            <p className="text-error text-sm mt-1">{errors.question.message}</p>
          )}
        </div>

        {/* Answer */}
        <div>
          <label htmlFor="answer" className="block text-sm font-medium mb-1">
            <FaComment className="inline mr-1" />
            Answer
          </label>
          <textarea
            id="answer"
            rows={4}
            {...register("answer", {
              required: "Answer is required",
              minLength: {
                value: 20,
                message: "Answer must be at least 20 characters long",
              },
            })}
            className="textarea textarea-bordered w-full"
            placeholder="Enter the detailed answer..."
          ></textarea>
          {errors.answer && (
            <p className="text-error text-sm mt-1">{errors.answer.message}</p>
          )}
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
              "Update FAQ"
            ) : (
              "Add FAQ"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Main AdminFAQs Component
const AdminFAQs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);

  const queryClient = useQueryClient();

  // Fetch FAQs
  const {
    data: faqs = [],
    isLoading,
    isError,
  } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const response = await axiosInstance.get("/faqs/getFAQs");
      return response?.data?.faqs || [];
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/faqs/deleteFAQ/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "FAQ has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete FAQ.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    },
  });

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [faqs, searchQuery]);

  const handleDelete = async (faq: FAQ) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete the FAQ: "${faq.question}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(faq._id);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFAQ(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFAQ(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error">
        <span>Error loading FAQs. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content">Manage FAQs</h2>
          <p className="text-base-content/70">
            Add, edit, and organize frequently asked questions
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary gap-2"
          disabled={showForm}
        >
          <FaPlus />
          Add New FAQ
        </button>
      </div>

      {/* Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <FAQForm
            initialValues={editingFAQ}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>

      {/* FAQs List */}
      <div className="bg-base-100 border border-base-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-base-200">
          <h3 className="font-semibold">
            All FAQs ({filteredFAQs.length})
            {searchQuery && (
              <span className="text-sm font-normal text-base-content/70">
                {" "}
                - filtered by "{searchQuery}"
              </span>
            )}
          </h3>
        </div>

        <div className="divide-y divide-base-200">
          <AnimatePresence>
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-base-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium text-base-content">
                      {faq.question}
                    </h4>
                    <p className="text-base-content/70 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="btn btn-ghost btn-sm"
                      title="Edit FAQ"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(faq)}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                      title="Delete FAQ"
                      disabled={deleteMutation.isPending}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredFAQs.length === 0 && (
          <div className="p-8 text-center">
            <FaQuestionCircle className="mx-auto text-4xl text-base-content/30 mb-4" />
            <h3 className="text-lg font-medium text-base-content/70 mb-2">
              No FAQs found
            </h3>
            <p className="text-base-content/50">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Get started by adding your first FAQ."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFAQs;
