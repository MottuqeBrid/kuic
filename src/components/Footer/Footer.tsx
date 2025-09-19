import { motion } from "motion/react";
import { Link } from "react-router";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* KUIC Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <h3 className="text-2xl font-bold text-primary">KUIC</h3>
              <p className="text-sm text-base-content/70 leading-relaxed">
                Khulna University Innovation Club - Empowering students through
                Science, Technology, Entrepreneurship, and Philosophy to build a
                better tomorrow.
              </p>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-base-content">Follow Us</h4>
              <div className="flex space-x-3">
                <motion.a
                  href="https://facebook.com/kuic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaFacebook />
                </motion.a>
                <motion.a
                  href="https://twitter.com/kuic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter />
                </motion.a>
                <motion.a
                  href="https://instagram.com/kuic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaInstagram />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/company/kuic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedin />
                </motion.a>
                <motion.a
                  href="https://youtube.com/kuic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaYoutube />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-base-content">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/people"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  People
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Join Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Core Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-base-content">
              Core Areas
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/segments/science"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Science
                </Link>
              </li>
              <li>
                <Link
                  to="/segments/technology"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/segments/entrepreneurship"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Entrepreneurship
                </Link>
              </li>
              <li>
                <Link
                  to="/segments/philosophy"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Philosophy
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/research"
                  className="text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  Research
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold text-base-content">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <div className="text-sm text-base-content/70">
                  <p>Khulna University</p>
                  <p>Khulna-9208, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a
                  href="mailto:info@kuic.edu.bd"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  info@kuic.edu.bd
                </a>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a
                  href="tel:+880123456789"
                  className="text-sm text-base-content/70 hover:text-primary transition-colors duration-300"
                >
                  +880 123 456 789
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-base-300 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-base-content/70 text-center md:text-left">
              <p>
                © 2024 Khulna University Innovation Club. All rights reserved.
              </p>
              <p className="mt-1">
                Made with <FaHeart className="inline text-red-500 mx-1" /> by
                KUIC Team
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="text-sm text-base-content/70 hover:text-primary transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-base-content/70 hover:text-primary transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <motion.button
                onClick={scrollToTop}
                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Back to top"
              >
                <FaArrowUp />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
