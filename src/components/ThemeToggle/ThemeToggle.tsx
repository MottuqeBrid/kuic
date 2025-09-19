import { useContext } from "react";
import { motion } from "motion/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.button
        onClick={toggleTheme}
        className="relative w-14 h-8 bg-base-300 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        initial={false}
        animate={{
          backgroundColor: theme === "light" ? "#E9ECEF" : "#2D2D2D",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Toggle Circle */}
        <motion.div
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{
            x: theme === "light" ? 0 : 24,
            rotate: theme === "light" ? 0 : 180,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{
              opacity: theme === "light" ? 1 : 0,
              scale: theme === "light" ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <FaSun className="text-orange-500 text-xs" />
          </motion.div>
          <motion.div
            animate={{
              opacity: theme === "light" ? 0 : 1,
              scale: theme === "light" ? 0.5 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <FaMoon className="text-slate-700 text-xs" />
          </motion.div>
        </motion.div>

        {/* Background Icons */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <motion.div
            animate={{
              opacity: theme === "light" ? 0.3 : 0.1,
              scale: theme === "light" ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            <FaSun className="text-orange-500 text-xs" />
          </motion.div>
          <motion.div
            animate={{
              opacity: theme === "light" ? 0.1 : 0.3,
              scale: theme === "light" ? 0.8 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <FaMoon className="text-slate-500 text-xs" />
          </motion.div>
        </div>
      </motion.button>

      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{
          scale: 2,
          opacity: [0, 0.3, 0],
          transition: { duration: 0.4 },
        }}
      />
    </motion.div>
  );
};

export default ThemeToggle;
