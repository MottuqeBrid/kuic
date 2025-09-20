import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  cover?: string;
};

const DEMO_POSTS: Post[] = [
  {
    id: "post-1",
    title: "KUIC Hackathon 2025 — Recap and Highlights",
    excerpt:
      "A quick recap of the winners, top projects, and lessons learned from our 48-hour hackathon.",
    author: "Logan Hart",
    date: "2025-07-20",
    category: "Events",
    cover: "/kuic.jpg",
  },
  {
    id: "post-2",
    title: "How to Pitch Your Project",
    excerpt:
      "Simple techniques to make your demo stand out to judges and investors.",
    author: "Brittany Williams",
    date: "2025-06-10",
    category: "Guides",
    cover: "/kuic.jpg",
  },
  {
    id: "post-3",
    title: "Member Spotlight: Kristin Hill",
    excerpt:
      "We spoke with Kristin about her journey, projects, and tips for young innovators.",
    author: "Editorial Team",
    date: "2025-05-02",
    category: "Members",
    cover: "/kuic.jpg",
  },
];

const Blog: React.FC = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(DEMO_POSTS.map((p) => p.category)))],
    []
  );

  const posts = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return DEMO_POSTS.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!ql ||
          p.title.toLowerCase().includes(ql) ||
          p.excerpt.toLowerCase().includes(ql))
    );
  }, [q, cat]);

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-2">Blog</h2>
          <p className="text-base-content/70 mb-6">
            News, guides, and member stories from KUIC.
          </p>
        </motion.div>

        <div className="flex gap-3 mb-6">
          <input
            className="input input-bordered flex-1"
            placeholder="Search posts..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <article
              key={p.id}
              className="card bg-base-100 shadow hover:shadow-lg transition"
            >
              <div className="flex gap-4 p-4">
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-28 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      <Link to={`/blog/${p.id}`}>{p.title}</Link>
                    </h3>
                    <div className="text-xs text-muted">
                      {new Date(p.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-base-content/75 mt-2">
                    {p.excerpt}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-muted">By {p.author}</div>
                    <div className="text-xs badge badge-outline">
                      {p.category}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="mt-8 text-center text-muted">No posts found.</div>
        )}
      </div>
    </section>
  );
};

export default Blog;
