import { motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  FaSearch,
  FaTimes,
  FaDownload,
  FaShare,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import axiosInstance from "../../hooks/axiosInstance";

// TypeScript interfaces
interface GalleryItem {
  _id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

const Gallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/gallery/getGalleryItems");
      setGallery(res.data.galleryItems || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError("Failed to load gallery. Please try again later.");
      // Fallback to demo data
      setGallery([
        {
          _id: "demo-1",
          title: "AI & Machine Learning Conference 2024",
          image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
          category: "Technology",
          date: "2024-03-22",
          location: "KUIC Main Auditorium",
        },
        {
          _id: "demo-2",
          title: "Quantum Computing Workshop Series",
          image:
            "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
          category: "Science",
          date: "2024-03-18",
          location: "KU Advanced Physics Lab",
        },
        {
          _id: "demo-3",
          title: "Startup Funding & Investment Summit",
          image:
            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
          category: "Entrepreneurship",
          date: "2024-03-15",
          location: "KU Innovation Hub",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Get unique categories from gallery data
  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(gallery.map((item) => item.category).filter(Boolean))
    );
    return ["All", ...uniqueCategories];
  }, [gallery]);

  const filteredImages = useMemo(() => {
    return gallery.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [gallery, selectedCategory, searchTerm]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-lg text-base-content/70">Loading gallery...</p>
        </div>
      </div>
    );
  }

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

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-warning mb-6"
          >
            <FaExclamationTriangle />
            <span>{error} Using demo data for preview.</span>
          </motion.div>
        )}

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
              {availableCategories.map((category) => (
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
              key={item._id}
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
                {selectedImage.title}
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
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Event Details - Compact Format */}
                <div className="space-y-4">
                  {/* Event Info - Single Column */}
                  <div className="space-y-2 text-sm text-base-content/70">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      <span>{formatDate(selectedImage.date)}</span>
                      <FaMapMarkerAlt className="text-primary" />
                      <span>{selectedImage.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-base-300">
                    <motion.button
                      onClick={() =>
                        handleDownload(selectedImage.image, selectedImage.title)
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
                        handleShare(selectedImage.image, selectedImage.title)
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
