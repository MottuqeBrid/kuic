import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import {
  FaHome,
  //   FaRefresh,
  FaExclamationTriangle,
  FaBug,
  FaRocket,
} from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";

interface ErrorPageProps {
  errorCode?: number;
  title?: string;
  message?: string;
  showRetry?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  errorCode = 404,
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showRetry = false,
}) => {
  const getErrorIcon = () => {
    switch (errorCode) {
      case 404:
        return <FaExclamationTriangle className="text-6xl text-primary" />;
      case 500:
        return <FaBug className="text-6xl text-error" />;
      default:
        return <FaExclamationTriangle className="text-6xl text-warning" />;
    }
  };

  const getErrorColor = () => {
    switch (errorCode) {
      case 404:
        return "text-primary";
      case 500:
        return "text-error";
      default:
        return "text-warning";
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="mb-8"
        >
          {getErrorIcon()}
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`text-8xl font-bold ${getErrorColor()} mb-4`}
        >
          {errorCode}
        </motion.h1>

        {/* Error Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl font-bold text-base-content mb-4"
        >
          {title}
        </motion.h2>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-base-content/70 mb-8 leading-relaxed"
        >
          {message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Go Home Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaHome />
              Go Home
            </Link>
          </motion.div>

          {/* Retry Button */}
          {showRetry && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-outline btn-lg gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BiRefresh />
                Try Again
              </button>
            </motion.div>
          )}

          {/* Contact Support Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/contact"
              className="btn btn-ghost btn-lg gap-2 hover:bg-base-200 transition-all duration-300"
            >
              <FaRocket />
              Contact Support
            </Link>
          </motion.div>
        </motion.div>

        {/* Additional Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-12 p-6 bg-base-200 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-base-content mb-4">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Check the URL for typos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Try refreshing the page</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Go back to the homepage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Contact our support team</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Animation Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                x: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
