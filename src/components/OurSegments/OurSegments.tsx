import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  FaCode,
  FaBookOpen,
  FaRocket,
  FaArrowRight,
  FaFlask,
  FaLightbulb,
  FaCog,
  FaBrain,
  FaGraduationCap,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import axiosInstance from "../../hooks/axiosInstance";

interface Segment {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  features: string[];
  isActive: boolean;
  order: number;
  slug: string;
}

const OurSegments = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSegments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/segments/getCoreSegments");
        setSegments(response.data.segments || []);
      } catch (err) {
        console.error("Error fetching segments:", err);
        setError("Failed to load segments");
        setSegments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSegments();
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-4xl text-primary mr-4" />
            <span className="text-xl text-base-content">
              Loading segments...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <FaExclamationTriangle className="text-4xl text-error mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-base-content">
              Unable to Load Segments
            </h3>
            <p className="text-base-content/70">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Our <span className="text-primary">Core Areas</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
            {segments.length > 0
              ? `Explore ${segments
                  .map((s) => s.title)
                  .join(
                    ", "
                  )}. Join KUIC to develop skills across these interconnected domains that drive innovation and critical thinking.`
              : "Discover our core areas of focus and join KUIC to develop skills that drive innovation and critical thinking."}
          </p>
        </motion.div>

        {/* Segments Grid */}
        {segments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-base-300 mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No Core Areas Available
            </h3>
            <p className="text-base-content/70">
              Our core areas will be displayed here when available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {segments.map((segment, index) => {
              const IconComponent = getIconComponent(segment.icon);

              return (
                <motion.div
                  key={segment._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                >
                  {/* Segment Header with Accent */}
                  <div className="relative">
                    <div className={`h-1 w-full ${segment.accentColor}`}></div>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`p-3 rounded-lg ${segment.accentColor} flex-shrink-0`}
                        >
                          <IconComponent className="text-2xl text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
                            {segment.title}
                          </h3>
                          <p className="text-base-content/70 text-sm leading-relaxed mb-4">
                            {segment.description}
                          </p>

                          {/* Features List */}
                          <div className="space-y-2">
                            {segment.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-center gap-2 text-sm text-base-content/70"
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${segment.accentColor}`}
                                ></div>
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="px-6 pb-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={`/segments/${segment.slug}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 ${segment.accentColor} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300`}
                      >
                        Learn More
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OurSegments;
