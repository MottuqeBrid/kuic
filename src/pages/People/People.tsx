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
  TimeLine?: string;
  Bio?: string;
  SocialMedia?: Record<string, unknown>;
  _id?: string;
  JoinDate?: string;
  EndDate?: string | null;
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
    case "ex-member":
      return "badge badge-warning";
    default:
      return "badge badge-ghost";
  }
}

const People: React.FC = () => {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [people, setPeople] = useState<Member[]>([]);
  const [expandedMember, setExpandedMember] = useState<Member[]>([]);
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
      const response = await axiosInstance.get(
        "/members/getMembers?Status=Active"
      );
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
  const fetchExpandedMember = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await axiosInstance.get(
        "/members/getMembers?Status=Ex-Member"
      );
      const data = response.data?.members || response.data || [];
      setExpandedMember(Array.isArray(data) ? (data as Member[]) : []);
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
    fetchExpandedMember();
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

  function formatDuration(startDate?: string, endDate?: string | null) {
    if (!startDate || !endDate) return null;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

      const diffInMs = end.getTime() - start.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInMonths = Math.floor(diffInDays / 30.44); // Average days per month
      const diffInYears = Math.floor(diffInMonths / 12);

      if (diffInYears > 0) {
        const remainingMonths = diffInMonths % 12;
        if (remainingMonths === 0) {
          return `${diffInYears} year${diffInYears > 1 ? "s" : ""}`;
        }
        return `${diffInYears} year${
          diffInYears > 1 ? "s" : ""
        }, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
      } else if (diffInMonths > 0) {
        return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""}`;
      } else if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
      } else {
        return "Less than a day";
      }
    } catch {
      return null;
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
    <section className="min-h-screen bg-gradient-to-br from-base-100 to-base-200/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {loading && (
            <div className="mb-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-lg">Loading our amazing team...</p>
            </div>
          )}
          {fetchError && (
            <div className="alert alert-error max-w-md mx-auto mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error: {fetchError}</span>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            Our Team
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Meet the brilliant minds and passionate innovators that drive KUIC
            forward. Together, we're building the future of technology and
            innovation.
          </p>
        </motion.div>

        {/* Leaders Section */}
        {leaders.some((leader) => leader) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Leadership Team
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {leaders.map((leader, idx) =>
                leader ? (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 border border-base-300">
                      <div className="card-body p-8">
                        <div className="avatar mb-6">
                          <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto">
                            <img
                              src={leader.PhotoURL || fallbackPhoto}
                              alt={leader.FullName}
                              className="rounded-full object-cover"
                              loading="lazy"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  fallbackPhoto)
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <h3 className="text-2xl font-bold mb-2">
                            {leader.FullName}
                          </h3>
                          <div className="badge badge-primary badge-lg mb-4">
                            {leader.Position}
                          </div>
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">
                          {leader.Discipline} Discipline
                        </p>
                        <div className="mb-4">
                          <span className={statusClass(leader.Status)}>
                            {leader.Status || "Unknown"}
                          </span>
                        </div>
                        {leader.Bio && (
                          <p className="text-sm text-base-content/75 leading-relaxed mb-6 line-clamp-3">
                            {leader.Bio}
                          </p>
                        )}
                        <div className="flex justify-start">
                          {renderSocialLinks(
                            leader.SocialMedia,
                            leader.FullName
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card bg-base-200/50 border-2 border-dashed border-base-300"
                  >
                    <div className="card-body p-8 text-center">
                      <div className="w-32 h-32 rounded-full bg-base-300 flex items-center justify-center mx-auto mb-6">
                        <svg
                          className="w-16 h-16 text-base-content/30"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-base-content/50 font-medium">
                        {leaderPositions[idx]} Position Available
                      </p>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium mb-2">
                  Search Members
                </label>
                <div className="relative">
                  <input
                    aria-label="Search members"
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Search by name..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 max-w-xs">
                <label className="block text-sm font-medium mb-2">
                  Filter by Discipline
                </label>
                <select
                  className="select select-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
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

              <div className="flex flex-col items-center lg:items-end">
                <div className="text-sm text-base-content/60 mb-1">
                  Total Members
                </div>
                <div className="stat-value text-2xl text-primary">
                  {people.length}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Active Members Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Active Members
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((m: Member, index) => (
              <motion.article
                key={m._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-base-300 h-full">
                  <div className="card-body p-6">
                    {/* Avatar */}
                    <div className="avatar mx-auto mb-4">
                      <div className="w-20 h-20 rounded-xl ring ring-primary/20 ring-offset-base-100 ring-offset-2">
                        <img
                          src={m.PhotoURL || fallbackPhoto}
                          alt={`${m.FullName} — ${m.Position || "Member"}`}
                          className="rounded-xl object-cover"
                          loading="lazy"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src = fallbackPhoto)
                          }
                        />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1">
                      <div className="flex flex-col items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold mb-2 text-base-content group-hover:text-primary transition-colors">
                          {m.FullName}
                        </h3>
                        <div className="badge badge-primary badge-sm">
                          {m.Position}
                        </div>
                      </div>

                      <div className="mb-4 flex justify-between items-center w-full">
                        <p className="text-sm font-bold">
                          {m.Discipline} Discipline
                        </p>

                        <span
                          className={`${statusClass(m?.Status)} text-base-100 `}
                        >
                          {m?.Status || "Unknown"}
                        </span>
                      </div>

                      {m.Bio && (
                        <p className="text-sm text-base-content/75 leading-relaxed mb-4 line-clamp-3">
                          {m.Bio}
                        </p>
                      )}

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4 text-sm">
                        {m.Email && (
                          <a
                            href={`mailto:${m.Email}`}
                            className="flex items-center justify-center gap-2 text-base-content/70 hover:text-primary transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span className="truncate">{m.Email}</span>
                          </a>
                        )}
                        {m.PhoneNumber && (
                          <a
                            href={`tel:${m.PhoneNumber}`}
                            className="flex items-center justify-center gap-2 text-base-content/70 hover:text-primary transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span>{m.PhoneNumber}</span>
                          </a>
                        )}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center">
                        {renderSocialLinks(m.SocialMedia, m.FullName)}
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="card-actions justify-center mt-4 pt-4 border-t border-base-300">
                      <div className="text-xs text-base-content/60">
                        {m.Status?.toLowerCase() === "ex-member" &&
                        m.EndDate ? (
                          <div className="text-center">
                            <div className="font-medium">
                              Duration: {formatDuration(m.JoinDate, m.EndDate)}
                            </div>
                            <div className="opacity-70">
                              {formatDate(m.JoinDate)} - {formatDate(m.EndDate)}
                            </div>
                          </div>
                        ) : (
                          <div>Joined: {formatDate(m.JoinDate)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <div className="w-32 h-32 mx-auto mb-6 opacity-20">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No members found</h3>
              <p className="text-base-content/60">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Ex-Members */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ex-Members</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {expandedMember.length > 0 &&
            expandedMember.map((m: Member, index) => (
              <motion.article
                key={m._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-base-300 h-full">
                  <div className="card-body p-6">
                    {/* Avatar */}
                    <div className="avatar mx-auto mb-4">
                      <div className="w-20 h-20 rounded-xl ring ring-secondary/20 ring-offset-base-100 ring-offset-2">
                        <img
                          src={m.PhotoURL || fallbackPhoto}
                          alt={`${m.FullName} — ${m.Position || "Member"}`}
                          className="rounded-xl object-cover"
                          loading="lazy"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src = fallbackPhoto)
                          }
                        />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="text-center flex-1">
                      <div className="flex justify-between gap-2 mb-4">
                        <h3 className="text-lg font-bold mb-2 text-base-content group-hover:text-primary transition-colors">
                          {m.FullName}
                        </h3>
                        <div className="badge badge-primary font-semibold badge-sm">
                          {m.Position}
                        </div>
                      </div>
                      <p className="text-sm text-base-content/70">
                        {m.Discipline} Discipline
                      </p>

                      <div className="my-4">
                        <span className={statusClass(m?.Status)}>
                          {m?.Status || "Unknown"}
                        </span>
                      </div>

                      {m.TimeLine && (
                        <p className="text-sm text-base-content/75 mb-4">
                          {m.TimeLine}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="card-actions justify-center mt-4 pt-4 border-t border-base-300">
                      <div className="text-xs text-base-content/60 text-center">
                        {m.EndDate ? (
                          <div>
                            <div className="font-medium">
                              Duration: {formatDuration(m.JoinDate, m.EndDate)}
                            </div>
                            <div className="opacity-70">
                              {formatDate(m.JoinDate)} - {formatDate(m.EndDate)}
                            </div>
                          </div>
                        ) : (
                          <div>Joined: {formatDate(m.JoinDate)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>

        {expandedMember.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="w-32 h-32 mx-auto mb-6 opacity-20">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No ex-members</h3>
            <p className="text-base-content/60">
              There are currently no ex-members to display
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default People;
