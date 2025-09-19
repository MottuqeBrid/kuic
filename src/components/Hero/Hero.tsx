import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { motion } from "motion/react";
import { Link } from "react-router";
import { FaArrowRight } from "react-icons/fa";

const carouselData = [
  {
    id: 1,
    image: "/kuic.jpg",
    title: "Welcome to KUIC",
    subtitle: "Khulna University Innovation Club",
    description:
      "Empowering students to innovate, create, and transform ideas into reality through technology and collaboration.",
    cta: "Join Our Community",
    ctaLink: "/join",
    overlay: "from-black/60 via-black/30 to-transparent",
  },
  {
    id: 2,
    image: "/kuic.jpg",
    title: "Innovation Hub",
    subtitle: "Where Ideas Come to Life",
    description:
      "Connect with like-minded innovators, participate in hackathons, and build the future of technology together.",
    cta: "Explore Events",
    ctaLink: "/events",
    overlay: "from-primary/80 via-primary/40 to-transparent",
  },
  {
    id: 3,
    image: "/kuic.jpg",
    title: "Tech Community",
    subtitle: "Learn, Build, Grow",
    description:
      "Access workshops, mentorship programs, and cutting-edge resources to accelerate your tech journey.",
    // cta: "Start Learning",
    // ctaLink: "/learn",
    overlay: "from-secondary/80 via-secondary/40 to-transparent",
  },
];

const Hero = () => {
  return (
    <div className="relative">
      <Carousel
        className="w-full"
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        showIndicators={true}
        interval={5000}
        transitionTime={800}
        swipeable={true}
        emulateTouch={true}
        stopOnHover={false}
        useKeyboardArrows={true}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <motion.button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <motion.button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-3 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )
        }
        renderIndicator={(onClickHandler, isSelected, _, label) => (
          <motion.button
            type="button"
            onClick={onClickHandler}
            title={label}
            className={`mx-1 w-3 h-3 rounded-full transition-all duration-300 ${
              isSelected
                ? "bg-primary scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        )}
      >
        {carouselData.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-[80vh] overflow-hidden rounded-b-2xl"
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`}
            />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="max-w-4xl mx-auto text-center text-white">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90"
                  >
                    {slide.subtitle}
                  </motion.p>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
                  >
                    {slide.description}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="pt-6"
                  >
                    {slide.ctaLink && slide.cta && (
                      <>
                        <Link
                          to={slide.ctaLink}
                          className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                        >
                          {slide.cta}
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaArrowRight />
                          </motion.div>
                        </Link>
                      </>
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.random() * 200 - 100, 0],
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
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
