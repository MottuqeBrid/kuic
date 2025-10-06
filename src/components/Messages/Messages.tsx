import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import axiosInstance from "../../hooks/axiosInstance";

interface SocialMedia {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  email: string;
}

interface Metadata {
  createdBy?: string;
  updatedBy?: string;
  tags: string[];
}

interface Message {
  _id?: string;
  name: string;
  title: string;
  role: string;
  photo: string;
  message: string;
  messageType: "advisor" | "leader";
  isActive: boolean;
  order: number;
  socialMedia: SocialMedia;
  metadata: Metadata;
  createdAt?: string;
  updatedAt?: string;
}

const Messages: React.FC = () => {
  const [advisor, setAdvisor] = useState<Message | null>(null);
  const [leaders, setLeaders] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/messages/getMessages");

        setAdvisor(response.data.advisor);
        setLeaders(response.data.leaders || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
        setAdvisor(null);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="bg-base-100">
        <div className="bg-gradient-to-r from-primary to-cyan-600 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-white mr-4" />
              <span className="text-xl text-white">Loading messages...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-base-100">
        <div className="bg-gradient-to-r from-primary to-cyan-600 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col items-center justify-center py-20 text-white">
              <FaExclamationTriangle className="text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Unable to Load Messages
              </h3>
              <p className="text-white/80">Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-cyan-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-center text-white">
              Insights & Messages
            </h2>
            <p className="text-center text-white/80 max-w-2xl mx-auto mt-2">
              Stay updated with the latest club initiatives and hear directly
              from our leadership.
            </p>
          </motion.div>

          {/* Advisor Message */}
          {advisor && (
            <div className="mt-10 bg-base-200 text-base-content rounded-lg overflow-hidden shadow-lg">
              <div className="p-10 text-center">
                <img
                  src={advisor.photo}
                  alt={advisor.name}
                  className="w-40 h-40 rounded-full mx-auto object-cover ring-4 ring-primary"
                  onError={(e) => {
                    e.currentTarget.src = "/kuic.jpg";
                  }}
                />
                <h3 className="text-2xl font-semibold mt-4 text-primary">
                  {advisor.title}
                </h3>
                <p className="mt-4 text-sm text-base-content/80">
                  {advisor.message}
                </p>
                <div className="mt-6 text-sm font-semibold">
                  — {advisor.name}
                </div>
                <div className="text-xs text-base-content/60 mt-1">
                  {advisor.role}
                </div>
              </div>
            </div>
          )}

          {/* Leaders Messages */}
          {leaders.length > 0 && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaders.map((leader) => (
                <motion.div
                  key={leader._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-base-100 flex-1 rounded-lg p-6 shadow-md"
                >
                  <div className="flex flex-col items-start gap-4">
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-primary"
                      onError={(e) => {
                        e.currentTarget.src = "/kuic.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-primary">
                        {leader.title}
                      </h4>
                      <p className="text-sm text-base-content/60 font-medium mb-2">
                        {leader.role}
                      </p>
                      <p className="text-sm text-base-content/80 mt-2">
                        {leader.message}
                      </p>
                      <div className="mt-4 text-sm font-medium">
                        — {leader.name}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state when no messages */}
          {!advisor && leaders.length === 0 && !loading && !error && (
            <div className="mt-10 text-center py-20">
              <div className="text-6xl text-white/30 mb-4">💬</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Messages Available
              </h3>
              <p className="text-white/80">
                Messages from our leadership will appear here when available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Messages;
