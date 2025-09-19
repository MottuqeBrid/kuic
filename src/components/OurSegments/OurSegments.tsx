import { motion } from "motion/react";
import { Link } from "react-router";
import {
  FaCode,
  FaBookOpen,
  FaRocket,
  FaArrowRight,
  FaFlask,
} from "react-icons/fa";

// KUIC Four Core Areas - Khulna University Innovation Club
const segmentsData = [
  {
    id: 1,
    title: "Science",
    description:
      "Explore the wonders of scientific discovery through research projects, laboratory work, and scientific discussions. Dive deep into physics, chemistry, biology, and mathematics to understand the natural world.",
    icon: <FaFlask className="text-2xl text-white" />,
    accentColor: "bg-blue-500",
    features: [
      "Research Projects",
      "Laboratory Experiments",
      "Scientific Publications",
      "Science Competitions",
    ],
  },
  {
    id: 2,
    title: "Technology",
    description:
      "Master cutting-edge technologies and digital innovation. Learn programming, software development, AI, IoT, and emerging technologies that shape our digital future.",
    icon: <FaCode className="text-2xl text-white" />,
    accentColor: "bg-green-500",
    features: [
      "Programming & Development",
      "AI & Machine Learning",
      "IoT & Hardware",
      "Cybersecurity",
    ],
  },
  {
    id: 3,
    title: "Entrepreneurship",
    description:
      "Develop entrepreneurial skills and business acumen. Learn to identify opportunities, create business plans, and build innovative solutions that solve real-world problems.",
    icon: <FaRocket className="text-2xl text-white" />,
    accentColor: "bg-purple-500",
    features: [
      "Startup Development",
      "Business Planning",
      "Innovation Management",
      "Market Analysis",
    ],
  },
  {
    id: 4,
    title: "Philosophy",
    description:
      "Engage in critical thinking and philosophical discourse. Explore ethics, logic, metaphysics, and the fundamental questions that shape human understanding and society.",
    icon: <FaBookOpen className="text-2xl text-white" />,
    accentColor: "bg-pink-500",
    features: [
      "Critical Thinking",
      "Ethical Reasoning",
      "Logic & Argumentation",
      "Social Philosophy",
    ],
  },
];

const OurSegments = () => {
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
            Our <span className="text-primary">Four Core Areas</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
            Explore Science, Technology, Entrepreneurship, and Philosophy. Join
            KUIC to develop skills across these interconnected domains that
            drive innovation and critical thinking.
          </p>
        </motion.div>

        {/* Segments Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {segmentsData.map((segment, index) => (
            <motion.div
              key={segment.id}
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
                      {segment.icon}
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
                    to={`/segments/${segment.id}`}
                    className={`inline-flex items-center gap-2 px-4 py-2 ${segment.accentColor} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300`}
                  >
                    Learn More
                    <FaArrowRight className="text-xs" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurSegments;
