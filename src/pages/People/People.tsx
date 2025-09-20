import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import PEOPLE from "../../data/people";
import type { Member } from "../../data/people";
import { FaInstagram } from "react-icons/fa";

const fallbackPhoto = "/kuic.jpg";

function statusClass(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "active":
      return "badge badge-success";
    case "inactive":
      return "badge badge-error";
    case "pending":
      return "badge badge-warning";
    default:
      return "badge badge-ghost";
  }
}

const People: React.FC = () => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  // Use the local PEOPLE dataset. If you want remote fetching, replace this with a fetch + setPeople.
  const [people] = useState<Member[]>(PEOPLE);

  const departments = useMemo(() => {
    const s = new Set<string>();
    people.forEach((p) => s.add(p.Department || "Unknown"));
    return ["All", ...Array.from(s).sort()];
  }, [people]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return people.filter((p) => {
      if (dept !== "All" && p.Department !== dept) return false;
      if (!ql) return true;
      return (
        p.FullName.toLowerCase().includes(ql) ||
        (p.Position || "").toLowerCase().includes(ql) ||
        (p.SkillsExpertise || []).some((s) => s.toLowerCase().includes(ql))
      );
    });
  }, [q, dept, people]);

  function formatDate(d?: string) {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return d;
    }
  }

  function renderSocialIcon(key: string) {
    // minimal inline icons
    switch (key.toLowerCase()) {
      case "linkedin":
        return (
          <svg
            className="w-4 h-4 inline-block"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM8 8h4.8v2.3h.1c.7-1.3 2.4-2.6 4.9-2.6C23.6 7.7 24 11 24 15.3V24h-5v-7.3c0-1.8 0-4.1-2.5-4.1S14 15 14 17.9V24H9V8z" />
          </svg>
        );
      case "twitter":
        return (
          <svg
            className="w-4 h-4 inline-block"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M24 4.6c-.9.4-1.9.7-3 .8 1-0.6 1.8-1.6 2.1-2.7-.9.6-2 .9-3.1 1.2C19.4 2 18.1 1.4 16.7 1.4c-2.6 0-4.6 2.3-4 4.8C8 6 4.5 4 2.2 1.2c-.3.6-.5 1.2-.5 1.9 0 1.6.8 3 2 3.8-.7 0-1.4-.2-2-.6v.1c0 2.3 1.6 4.3 3.7 4.8-.4.1-.8.2-1.2.2-.3 0-.6 0-.8-.1.6 2 2.4 3.4 4.6 3.4C6.9 19.4 3.7 20.7.9 20c2.3 1.5 5 2.4 7.9 2.4 9.4 0 14.5-7.8 14.5-14.5v-.7C22.6 6.6 23.4 5.7 24 4.6z" />
          </svg>
        );
      case "facebook":
        return (
          <svg
            className="w-4 h-4 inline-block"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h10.7V14.7H9.7V11h3V8.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.4.1 2.7.1v3h-1.8c-1.4 0-1.7.7-1.7 1.6V11h3.4l-.4 3.7h-3v9.3H22c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" />
          </svg>
        );
      case "instagram":
        return <FaInstagram />;
      default:
        return (
          <svg
            className="w-4 h-4 inline-block"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M3.9 12c0-4.5 3.6-8.1 8.1-8.1s8.1 3.6 8.1 8.1-3.6 8.1-8.1 8.1S3.9 16.5 3.9 12zm11.1-1.8h-2.4v6h-2.4v-6H8.1V8.4h4.5V6.9c0-1.2.6-2.4 2.4-2.4h1.8v2.4h-1.2c-.3 0-.6.3-.6.6v1.5h1.8l-.3 1.8z" />
          </svg>
        );
    }
  }

  // Precompute leaders so we can both show them prominently and exclude them from the main list
  const leaderPositions = ["President", "Vice President", "Treasurer"];
  const leaders = leaderPositions.map((pos) =>
    people.find((p) => (p.Position || "").toLowerCase() === pos.toLowerCase())
  );
  const leaderIds = new Set(leaders.filter(Boolean).map((l) => l!.MemberID));

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-2">Our Team</h2>
          <p className="text-base-content/70 mb-6">
            Meet the students and mentors that power KUIC.
          </p>
        </motion.div>

        {/* Leaders strip: show President, Vice President and Treasurer */}
        <div className="mt-6 mb-6">
          {/* <h3 className="text-xl font-semibold mb-3">Leaders</h3> */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leaders.map((leader, idx) =>
              leader ? (
                <div
                  key={leader.MemberID}
                  className="card bg-gradient-to-r from-primary/10 to-base-200 p-4 flex items-center gap-4 border-l-4 border-primary"
                >
                  <img
                    src={leader.PhotoURL || fallbackPhoto}
                    alt={leader.FullName}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-primary"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = fallbackPhoto)
                    }
                  />
                  <div className="flex-1 w-full">
                    <div className="">
                      <div>
                        <div className="text-lg font-semibold">
                          {leader.FullName}
                        </div>
                        <div className="text-sm text-muted">
                          {leader.Position} — {leader.Department}
                        </div>
                      </div>
                      <div>
                        <span className={statusClass(leader.Status)}>
                          {leader.Status || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-base-content/70 truncate">
                      {leader.Bio}
                    </div>
                    <div className="mt-3 flex items-center flex-wrap gap-3 text-sm">
                      {leader.SocialMedia &&
                        Object.entries(leader.SocialMedia)
                          .slice(0, 4)
                          .map(([k, v]) => (
                            <a
                              key={k}
                              href={v}
                              target="_blank"
                              rel="noreferrer"
                              className="link link-primary flex items-center gap-2"
                              aria-label={`Open ${leader.FullName}'s ${k}`}
                            >
                              {renderSocialIcon(k)}
                              <span className="sr-only">{k}</span>
                              <span className="hidden sm:inline">{k}</span>
                            </a>
                          ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={idx}
                  className="card bg-base-200 p-4 flex items-center justify-center"
                >
                  <div className="text-sm text-muted">
                    No {leaderPositions[idx]} assigned
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-6">
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              aria-label="Search members"
              className="input input-bordered w-full"
              placeholder="Search by name, skill or role..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              className="select select-bordered w-full"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered
            .filter((m) => !leaderIds.has(m.MemberID))
            .map((m: Member) => (
              <article
                key={m.MemberID}
                className="card bg-base-100 shadow hover:shadow-lg transition"
              >
                <div className="flex flex-col gap-4 p-4">
                  <img
                    src={m.PhotoURL || fallbackPhoto}
                    alt={m.FullName}
                    className="w-20 h-20 rounded-lg object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = fallbackPhoto)
                    }
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{m.FullName}</h3>
                        <p className="text-sm text-muted">
                          {m.Position} — {m.Department}
                        </p>
                      </div>
                      <div>
                        <span className={statusClass(m?.Status)}>
                          {m?.Status || "Unknown"}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-base-content/75 line-clamp-3">
                      {m.Bio}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(m.SkillsExpertise || []).slice(0, 6).map((s) => (
                        <span key={s} className="badge badge-outline">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center flex-wrap gap-3 text-sm">
                      {m.SocialMedia &&
                        Object.entries(m.SocialMedia)
                          .slice(0, 4)
                          .map(([k, v]) => (
                            <a
                              key={k}
                              href={v}
                              target="_blank"
                              rel="noreferrer"
                              className="link link-primary flex items-center gap-2"
                              aria-label={`Open ${m.FullName}'s ${k}`}
                            >
                              {renderSocialIcon(k)}
                              <span className="sr-only">{k}</span>
                              <span className="hidden sm:inline">{k}</span>
                            </a>
                          ))}
                    </div>
                  </div>
                </div>

                <div className="card-actions p-4 pt-0">
                  <div className="flex items-center justify-end w-full text-xs text-muted">
                    <div>Joined: {formatDate(m.JoinDate)}</div>
                  </div>
                </div>
              </article>
            ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 text-center text-muted">
            No members match your search.
          </div>
        )}
      </div>
    </section>
  );
};

export default People;
