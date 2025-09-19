import { motion } from "motion/react";
import { Link } from "react-router";
import {
  FaCode,
  FaUsers,
  FaBookOpen,
  FaRocket,
  FaArrowRight,
  FaFlask,
  FaGlobe,
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
    <div className="py-16 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-orange-500">Four Core Areas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
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
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors duration-300">
                        {segment.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {segment.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2">
                        {segment.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2 text-sm text-gray-600"
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

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Choose Your Path?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join KUIC and become part of a vibrant community where you can
              develop your skills, work on meaningful projects, and prepare for
              your future career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/join"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                >
                  <FaUsers />
                  Join Our Community
                  <FaArrowRight />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <FaGlobe />
                  Learn More About KUIC
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurSegments;
