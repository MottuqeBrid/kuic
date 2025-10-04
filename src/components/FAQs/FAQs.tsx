import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaSearch, FaQuestionCircle, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../hooks/axiosInstance";

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

const FAQs: React.FC = () => {
  const [q, setQ] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/faqs/getFAQs");
      setFaqs(response.data?.faqs || []);
    } catch (err) {
      setError("Failed to load FAQs. Please try again later.");
      console.error("Error fetching FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const filteredFAQs = useMemo(() => {
    if (!faqs.length) return [];
    const ql = q.trim().toLowerCase();
    return faqs.filter(
      (faq) =>
        !ql ||
        faq.question.toLowerCase().includes(ql) ||
        faq.answer.toLowerCase().includes(ql)
    );
  }, [q, faqs]);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-base-200/50 to-base-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <FaSpinner className="animate-spin text-2xl text-primary" />
              <span className="text-lg">Loading FAQs...</span>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-base-200/50 to-base-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-error/10 border border-error/20 rounded-lg p-6">
              <FaQuestionCircle className="mx-auto text-4xl text-error mb-4" />
              <h3 className="text-lg font-semibold text-error mb-2">
                Unable to Load FAQs
              </h3>
              <p className="text-base-content/70 mb-4">{error}</p>
              <button onClick={fetchFAQs} className="btn btn-error btn-outline">
                Try Again
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-base-200/50 to-base-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <FaQuestionCircle className="text-2xl text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Find quick answers to common questions about KUIC. Can't find what
            you're looking for? Feel free to reach out!
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              className="input input-bordered w-full pl-12 pr-4 py-3 text-lg bg-base-100/80 backdrop-blur-sm border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              placeholder="Search FAQs..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {q && (
            <p className="text-center text-sm text-base-content/60 mt-2">
              Showing results for "{q}" ({filteredFAQs.length} found)
            </p>
          )}
        </motion.div>

        {/* FAQs List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredFAQs.map((faq, index) => (
              <motion.details
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group collapse collapse-plus border border-base-300/50 bg-base-100/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
              >
                <summary className="collapse-title text-lg font-semibold px-6 py-4 hover:text-primary transition-colors duration-300 cursor-pointer">
                  <span className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-bold mt-0.5">
                      Q
                    </span>
                    <span className="flex-1">{faq.question}</span>
                  </span>
                </summary>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="collapse-content px-6 pb-6"
                >
                  <div className="flex items-start gap-3 pt-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-secondary/10 rounded-full flex items-center justify-center text-secondary text-sm font-bold mt-0.5">
                      A
                    </span>
                    <p className="text-base-content/80 leading-relaxed flex-1">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.details>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredFAQs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="bg-base-200/50 rounded-2xl p-8 max-w-md mx-auto">
              <FaQuestionCircle className="mx-auto text-4xl text-base-content/30 mb-4" />
              <h3 className="text-xl font-semibold text-base-content/70 mb-2">
                {q ? "No FAQs Found" : "No FAQs Available"}
              </h3>
              <p className="text-base-content/60">
                {q
                  ? `No FAQs match your search for "${q}". Try different keywords or browse all FAQs.`
                  : "No FAQs have been added yet. Check back later for helpful information!"}
              </p>
              {q && (
                <button
                  onClick={() => setQ("")}
                  className="btn btn-primary btn-outline btn-sm mt-4"
                >
                  Clear Search
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {filteredFAQs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8 pt-8 border-t border-base-300/50"
          >
            <p className="text-sm text-base-content/60">
              Showing {filteredFAQs.length} of {faqs.length} FAQ
              {faqs.length !== 1 ? "s" : ""}
              {q && ` matching "${q}"`}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQs;
