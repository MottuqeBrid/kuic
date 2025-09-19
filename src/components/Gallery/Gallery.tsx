import { motion } from "motion/react";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  FaSearch,
  FaTimes,
  FaDownload,
  FaShare,
  FaHeart,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

// Demo Gallery Data - KUIC Events and Activities
const galleryData = [
  {
    id: 1,
    title: "Future of AI & Machine Learning Conference 2024",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    category: "Technology",
    date: "2024-03-22",
    location: "KUIC Main Auditorium",
    likes: 89,
    isLiked: false,
  },
  {
    id: 2,
    title: "Quantum Computing Workshop Series",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
    category: "Science",
    date: "2024-03-18",
    location: "KU Advanced Physics Lab",
    likes: 67,
    isLiked: true,
  },
  {
    id: 3,
    title: "Startup Funding & Investment Summit",
    image:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    category: "Entrepreneurship",
    date: "2024-03-15",
    location: "KU Innovation Hub",
    likes: 94,
    isLiked: false,
  },
  {
    id: 4,
    title: "Ethics of Artificial Intelligence Symposium",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    category: "Philosophy",
    date: "2024-03-12",
    location: "KU Philosophy Department",
    likes: 56,
    isLiked: true,
  },
  {
    id: 5,
    title: "Biotechnology Innovation Expo",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    category: "Science",
    date: "2024-03-10",
    location: "KU Science Complex",
    likes: 78,
    isLiked: false,
  },
  {
    id: 6,
    title: "Blockchain & Cryptocurrency Deep Dive",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    category: "Technology",
    date: "2024-03-08",
    location: "KU Computer Science Lab",
    likes: 71,
    isLiked: true,
  },
  {
    id: 7,
    title: "Social Entrepreneurship Challenge",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    category: "Entrepreneurship",
    date: "2024-03-05",
    location: "KU Community Center",
    likes: 112,
    isLiked: false,
  },
  {
    id: 8,
    title: "Philosophy of Science & Knowledge",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
    category: "Philosophy",
    date: "2024-03-02",
    location: "KU Library Lecture Hall",
    likes: 43,
    isLiked: true,
  },
  {
    id: 9,
    title: "Climate Tech & Sustainability Fair",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
    category: "Science",
    date: "2024-02-28",
    location: "KU Green Campus",
    likes: 156,
    isLiked: false,
  },
  {
    id: 10,
    title: "Product Management & Design Thinking",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    category: "Entrepreneurship",
    date: "2024-02-25",
    location: "KU Design Studio",
    likes: 83,
    isLiked: true,
  },
  {
    id: 11,
    title: "Cybersecurity & Digital Privacy Summit",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    category: "Technology",
    date: "2024-02-22",
    location: "KU IT Security Center",
    likes: 91,
    isLiked: false,
  },
  {
    id: 12,
    title: "Logic & Critical Reasoning Workshop",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    category: "Philosophy",
    date: "2024-02-20",
    location: "KU Philosophy Seminar Room",
    likes: 38,
    isLiked: true,
  },
  {
    id: 13,
    title: "Space Technology & Exploration Conference",
    image:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop",
    category: "Science",
    date: "2024-02-18",
    location: "KU Astronomy Observatory",
    likes: 127,
    isLiked: false,
  },
  {
    id: 14,
    title: "Web3 & Decentralized Applications Workshop",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
    category: "Technology",
    date: "2024-02-15",
    location: "KU Innovation Lab",
    likes: 89,
    isLiked: true,
  },
  {
    id: 15,
    title: "Lean Startup Methodology Bootcamp",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
    category: "Entrepreneurship",
    date: "2024-02-12",
    location: "KU Business Incubator",
    likes: 65,
    isLiked: false,
  },
  {
    id: 16,
    title: "Mind, Consciousness & Reality Debate",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    category: "Philosophy",
    date: "2024-02-10",
    location: "KU Main Lecture Theater",
    likes: 72,
    isLiked: true,
  },
  {
    id: 17,
    title: "Nanotechnology Research Showcase",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",
    category: "Science",
    date: "2024-02-08",
    location: "KU Materials Science Lab",
    likes: 98,
    isLiked: false,
  },
  {
    id: 18,
    title: "Full-Stack Development Intensive",
    image:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop",
    category: "Technology",
    date: "2024-02-05",
    location: "KU Programming Lab",
    likes: 104,
    isLiked: true,
  },
];

const categories = [
  "All",
  "Events",
  "Science",
  "Technology",
  "Entrepreneurship",
  "Philosophy",
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [likedImages, setLikedImages] = useState(new Set());

  const filteredImages = galleryData.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (id: number) => {
    setLikedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownload = (imageUrl: string, title: string) => {
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, "_")}.jpg`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (imageUrl: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this KUIC event: ${title}`,
          url: imageUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
        // Fallback to copying image URL to clipboard
        navigator.clipboard.writeText(imageUrl);
        alert("Image link copied to clipboard!");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(imageUrl);
      alert("Image link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "MMMM d, yyyy");
    } catch {
      // Fallback to original formatting if date-fns fails
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            KUIC <span className="text-primary">Gallery</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
            Explore our journey through Science, Technology, Entrepreneurship,
            and Philosophy. Witness the innovation, creativity, and learning
            that defines KUIC.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-base-200 text-base-content hover:bg-base-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-base-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onClick={() => setSelectedImage(item as any)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Overlay Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item.id);
                    }}
                    className={`p-2 rounded-full ${
                      likedImages.has(item.id)
                        ? "bg-red-500 text-white"
                        : "bg-white/20 text-white"
                    } backdrop-blur-sm`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaHeart />
                  </motion.button>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      return handleShare(item.image, item.title);
                    }}
                    className="p-2 bg-white/20 text-white rounded-full backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaShare />
                  </motion.button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Meta Info */}
                <div className="space-y-2 text-xs text-base-content/60">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="text-6xl text-base-content/30 mb-4">📷</div>
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No images found
            </h3>
            <p className="text-base-content/70">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-base-100 rounded-2xl overflow-y-auto max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <h3 className="text-2xl font-bold text-base-content">
                {(selectedImage as { title?: string })?.title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-base-200 rounded-lg transition-colors duration-300"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                {/* Image */}
                <div className="relative mb-6">
                  <img
                    src={(selectedImage as { image?: string })?.image ?? ""}
                    alt={(selectedImage as { title?: string })?.title ?? ""}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Event Details - Compact Format */}
                <div className="space-y-4">
                  {/* Event Info - Single Column */}
                  <div className="space-y-2 text-sm text-base-content/70">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      <span>
                        {formatDate(
                          typeof (selectedImage as { date?: string | Date })
                            ?.date === "string"
                            ? (selectedImage as { date?: string })?.date ?? ""
                            : (selectedImage as { date?: Date })?.date
                            ? (
                                (selectedImage as { date?: Date })?.date as Date
                              ).toISOString()
                            : ""
                        )}
                      </span>
                      <FaMapMarkerAlt className="text-primary" />
                      <span>
                        {(selectedImage as { location?: string })?.location ??
                          ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-base-300">
                    <motion.button
                      onClick={() => {
                        const id = Number(
                          (selectedImage as { id?: string | number })?.id
                        );
                        if (!isNaN(id)) {
                          handleLike(id);
                        }
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        likedImages.has(
                          (selectedImage as { id?: string | number })?.id
                        )
                          ? "bg-red-500 text-white"
                          : "bg-base-200 text-base-content hover:bg-base-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaHeart />
                      {likedImages.has(
                        (selectedImage as { id?: string | number })?.id
                      )
                        ? "Liked"
                        : "Like"}
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        handleDownload(
                          (selectedImage as { image?: string })?.image ?? "",
                          (selectedImage as { title?: string })?.title ?? ""
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaDownload />
                      Download
                    </motion.button>
                    <motion.button
                      onClick={() =>
                        handleShare(
                          (selectedImage as { image?: string })?.image ?? "",
                          (selectedImage as { title?: string })?.title ?? ""
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-base-200 text-base-content rounded-lg font-medium hover:bg-base-300 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShare />
                      Share
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;
