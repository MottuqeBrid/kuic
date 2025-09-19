import React, { useMemo, useState } from "react";
import { motion } from "motion/react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

const DEMO_FAQS: FAQ[] = [
  {
    id: "f1",
    question: "How do I join KUIC? ",
    answer:
      "You can join KUIC by filling the membership form available on our website or attending one of our onboarding events. Members are added after a short verification.",
    category: "Membership",
  },
  {
    id: "f2",
    question: "Do I need programming experience?",
    answer:
      "No — KUIC welcomes students from all backgrounds. We run workshops for beginners and have mentorship for technical skills.",
    category: "General",
  },
  {
    id: "f3",
    question: "Can alumni participate in events?",
    answer:
      "Yes, alumni are encouraged to mentor, speak at events, and form project teams with current students.",
    category: "Membership",
  },
  {
    id: "f4",
    question: "How can I propose a workshop or event?",
    answer:
      "Submit a proposal through our events form or contact the events coordinator via the contact page. Proposals are reviewed monthly.",
    category: "Events",
  },
];

const FAQs: React.FC = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(DEMO_FAQS.map((f) => f.category || "General"))),
    ],
    []
  );

  const faqs = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return DEMO_FAQS.filter(
      (f) =>
        (cat === "All" || (f.category || "General") === cat) &&
        (!ql ||
          f.question.toLowerCase().includes(ql) ||
          f.answer.toLowerCase().includes(ql))
    );
  }, [q, cat]);

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/70 mb-6">
            Quick answers to common questions about KUIC.
          </p>
        </motion.div>

        <div className="flex gap-3 mb-6">
          <input
            className="input input-bordered flex-1"
            placeholder="Search FAQs..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="select select-bordered w-48"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {faqs.map((f) => (
            <details
              key={f.id}
              className="collapse collapse-plus border border-base-200 bg-base-100 rounded-box"
            >
              <summary className="collapse-title text-lg font-medium">
                {f.question}
              </summary>
              <div className="collapse-content">
                <p className="text-base-content/80">{f.answer}</p>
              </div>
            </details>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="mt-6 text-center text-muted">
            No FAQs match your search.
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQs;
