import React, { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaGlobe,
} from "react-icons/fa";
import { format } from "date-fns";
import axiosInstance from "../../hooks/axiosInstance";
interface Member {
  FullName: string;
  Email?: string;
  Position?: string;
  YearBatch?: string;
  Discipline?: string;
  Status?: string;
  PhotoURL?: string;
  Bio?: string;
  SocialMedia?: Record<string, unknown>;
  _id?: string;
  JoinDate?: string;
  PhoneNumber?: string;
}

const fallbackPhoto = "/kuic.jpg";

const leaderPositions = ["President", "Vice President", "Treasurer"];

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
  const [people, setPeople] = useState<Member[]>([]);
  // derived filtered members (no local state)
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const leaders = useMemo(
    () =>
      leaderPositions.map((pos: string) =>
        people.find((p) => p?.Position?.toLowerCase() === pos.toLowerCase())
      ),
    [people]
  );

  const leaderIds = useMemo(() => {
    const s = new Set<string>();
    for (const l of leaders) if (l && l._id) s.add(l._id);
    return s;
  }, [leaders]);

  const filteredMembers = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return people.filter((p) => {
      if (dept !== "All" && p.Discipline !== dept) return false;
      if (p._id && leaderIds.has(p._id)) return false;
      if (!ql) return true;
      return p.FullName?.toLowerCase().includes(ql) || false;
    });
  }, [people, q, dept, leaderIds]);
  const fetchMember = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await axiosInstance.get("/members/getMembers");
      const data = response.data?.members || response.data || [];
      setPeople(Array.isArray(data) ? (data as Member[]) : []);
      console.log(data);
    } catch (error: unknown) {
      console.error("Error fetching members:", error);
      setFetchError(String(error ?? "Failed to load members"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, []);

  const disciplines = useMemo(() => {
    const s = new Set<string>();
    people.forEach((p) => s.add(p.Discipline || "Unknown"));
    return ["All", ...Array.from(s).sort()];
  }, [people]);

  function formatDate(d?: string) {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      return format(dt, "MMM d, yyyy");
    } catch {
      return d;
    }
  }

  function renderSocialIcon(key: string) {
    switch (key.toLowerCase()) {
      case "linkedin":
        return <FaLinkedin className="w-4 h-4 inline-block" />;
      case "twitter":
        return <FaTwitter className="w-4 h-4 inline-block" />;
      case "facebook":
        return <FaFacebook className="w-4 h-4 inline-block" />;
      case "instagram":
        return <FaInstagram className="w-4 h-4 inline-block" />;
      default:
        return <FaGlobe className="w-4 h-4 inline-block" />;
    }
  }

  const isValidUrl = (s?: string) => {
    if (!s) return false;
    try {
      const url = new URL(s);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const renderSocialLinks = (sm?: Record<string, unknown>, name?: string) => {
    if (!sm) return null;

    // Prioritize URL fields and valid URLs
    const urlFields = ["PersonalWebsite", "Website"];
    const socialFields = ["LinkedIn", "Twitter", "Facebook", "Instagram"];

    const validLinks: Array<[string, string]> = [];
    const textEntries: Array<[string, unknown]> = [];

    Object.entries(sm).forEach(([k, v]) => {
      const href = typeof v === "string" ? v.trim() : "";

      // Always treat URL fields as links if they're valid URLs
      if (
        urlFields.some((field) => k.toLowerCase().includes(field.toLowerCase()))
      ) {
        if (href && isValidUrl(href)) {
          validLinks.push([k, href]);
        } else if (href) {
          textEntries.push([k, v]);
        }
      }
      // For social fields, only show as links if they're valid URLs
      else if (
        socialFields.some((field) =>
          k.toLowerCase().includes(field.toLowerCase())
        )
      ) {
        if (href && isValidUrl(href)) {
          validLinks.push([k, href]);
        }
        // Don't show social fields as text if they're not URLs
      }
      // Other fields as text
      else {
        textEntries.push([k, v]);
      }
    });

    return (
      <div className="flex flex-wrap gap-2">
        {/* Render valid links first */}
        {validLinks.map(([k, href]) => (
          <a
            key={k}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="link link-primary flex items-center gap-2"
            aria-label={`Open ${name ?? "member"}'s ${k}`}
          >
            {renderSocialIcon(k)}
            <span className="not-sr-only">{k}</span>
          </a>
        ))}

        {/* Render text entries */}
        {textEntries.slice(0, 2).map(([k, v]) => (
          <div key={k} className="text-xs text-muted">
            <span className="font-semibold mr-1">{k}:</span>
            <span>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {loading && <div className="py-8 text-center">Loading members…</div>}
          {fetchError && (
            <div className="py-4 text-center text-error">
              Error: {fetchError}
            </div>
          )}
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
                  key={idx}
                  className="card bg-gradient-to-r from-primary/10 to-base-200 p-4 flex items-center gap-4 border-l-4 border-primary"
                >
                  <img
                    src={leader.PhotoURL || fallbackPhoto}
                    alt={leader.FullName}
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-primary"
                    loading="lazy"
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
                          {leader.Position} — {leader.Discipline}
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
                      {renderSocialLinks(leader.SocialMedia, leader.FullName)}
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
              placeholder="Search by name..."
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
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((m: Member) => (
            <article
              key={m._id}
              className="card bg-base-100 shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col gap-4 p-4">
                <img
                  src={m.PhotoURL || fallbackPhoto}
                  alt={`${m.FullName} — ${m.Position || "Member"}`}
                  className="w-20 h-20 rounded-lg object-cover"
                  loading="lazy"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = fallbackPhoto)
                  }
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{m.FullName}</h3>
                      <p className="text-sm text-muted">
                        {m.Position} — {m.Discipline}
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
                  {/* Email */}
                  <div className="mt-3 flex items-center flex-wrap gap-3 text-sm">
                    {m.Email && (
                      <a
                        href={`mailto:${m.Email}`}
                        className="link link-hover mr-3 text-sm"
                      >
                        {m.Email}
                      </a>
                    )}
                    {m.PhoneNumber && (
                      <a
                        href={`tel:${m.PhoneNumber}`}
                        className="link link-hover mr-3 text-sm"
                      >
                        {m.PhoneNumber}
                      </a>
                    )}
                    {/* Social links */}
                    {(m.SocialMedia as Record<string, unknown>) &&
                      renderSocialLinks(m.SocialMedia, m.FullName)}
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

        {filteredMembers.length === 0 && (
          <div className="mt-8 text-center text-muted">
            No members match your search.
          </div>
        )}
      </div>
    </section>
  );
};

export default People;
