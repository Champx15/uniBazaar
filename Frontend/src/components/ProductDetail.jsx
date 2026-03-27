import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import listingService from "../service/listingService";
import { useWishlist } from "../context/WishlistContext/WishlistContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useListing } from "../context/ListingContext/ListingContext";
import {
  Heart,
  MessageCircle,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  X,
  ArrowLeft,
  LogIn,
} from "lucide-react";
// import IdentityVerificationModal from "./IdentityVerificationModal";
// import VerificationStatusModal from "./VerificationStatusModal";
import ReportModal from "./ReportModal";

const ProductDetail = ({ setToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getListing } = useListing();
  const [data, setData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const imageRef = useRef(null);
  const { wishlist, addWishlist, removeWishlist, refreshWishlist } =
    useWishlist();
  const isSaved = data?.listing && wishlist.some((l) => l.id === data.listing.id);
  const isOwnListing = data?.listing && user && data.userId === user.id;
  // const [identityVerificationOpen, setIdentityVerificationOpen] =
  // useState(false);
  // const [verificationStatus, setVerificationStatus] = useState(null);
  // const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getListing(id);
        setData(data);
      } catch (err) {
        console.error(err);
        setToast?.({ message: "Failed to load product", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, getListing, setToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data?.listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const images =
    data.listing.imageUrls?.length > 0
      ? data.listing.imageUrls.slice(0, 5)
      : ["/api/placeholder/600/600"];

  const hasNext = activeIndex < images.length - 1;
  const hasPrev = activeIndex > 0;

  const handleImageMouseMove = (e) => {
    if (!zoomed || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleSave = async () => {
    if (!user) {
      navigate("/login");
      setToast?.({ message: "Please log in to save listings", type: "info" });
      return;
    }
    try {
      if (isSaved) {
        await removeWishlist(data.listing.id);
        setToast?.({ message: "Removed from wishlist", type: "info" });
      } else {
        await addWishlist(data.listing.id);
        setToast?.({ message: "Added to wishlist", type: "success" });
      }
    } catch (err) {
      setToast?.({ message: err.message, type: "error" });
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isOwnListing) {
      setToast?.({
        message: "You cannot message your own listing",
        type: "info",
      });
      return;
    }

    navigate("/messages", {
      state: {
        sellerName: data.name,
        sellerId: data.userId,
        listingTitle: data.listing.title,
        listingId: data.listing.id,
        autoMessage: `Hi!!! I'm interested in ${data.listing.title}`,
      },
    });
  };

  const handleMakeOffer = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isOwnListing) {
      setToast?.({
        message: "You cannot make an offer on your own listing",
        type: "info",
      });
      return;
    }

    setShowOfferModal(true);
  };

  const handleSubmitOffer = async () => {
    if (!offerPrice.trim()) {
      setToast?.({ message: "Please enter an offer price", type: "error" });
      return;
    }
    const offerAmount = Number(offerPrice);
    if (offerAmount <= 0) {
      setToast?.({
        message: "Please enter a valid offer price",
        type: "error",
      });
      return;
    }
    try {
      setShowOfferModal(false);
      setOfferPrice("");
      navigate("/messages", {
        state: {
          sellerName: data.name,
          sellerId: data.userId,
          listingTitle: data.listing.title,
          listingId: data.listing.id,
          autoMessage: `Hi!!! I'm interested in ${data.listing.title} and I would like to make an offer for ₹${offerAmount.toLocaleString("en-IN")}`,
          offerPrice: offerAmount,
        },
      });
      setToast?.({ message: "Navigating to chat...", type: "info" });
    } catch (err) {
      setToast?.({
        message: err.message || "Failed to process offer",
        type: "error",
      });
    }
  };

  const handleReport = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowReportModal(true);
  };

  const priceString = data.listing.price?.toString() || "0";
  const displayPrice = Number(priceString).toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="w-20 md:w-22 h-8 md:h-8 absolute top-1 left-5 md:top-2 md:left-65 z-50 cursor-pointer text-gray-900 p-2.5    flex items-center gap-1"
        aria-label="Go back"
        title="Go back"
      >
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" /> Back
      </button>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-11">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Image Gallery - Left Column (Spans 2 on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Main Image */}
            <div
              className="relative w-full bg-gradient-to-br from-gray-200 via-gray-200 to-gray-200 rounded-xl overflow-hidden aspect-square group cursor-zoom-in h-121"
              onMouseMove={handleImageMouseMove}
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              <img
                ref={imageRef}
                src={images[activeIndex]}
                alt={data.listing.title}
                className={`w-full h-full object-contain transition-all duration-300 ${
                  zoomed ? "scale-150" : "scale-100"
                }`}
                style={
                  zoomed
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : {}
                }
              />

              {/* Stock Status Badge */}
              {data.listing.status === "ACTIVE" && (
                <div className="absolute top-5 right-5 z-10 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 flex items-center gap-2 shadow-lg border border-white/20">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-gray-900">
                    Available
                  </span>
                </div>
              )}
              {data.listing.status === "SOLD" && (
                <div className="absolute top-5 right-5 z-10 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 flex items-center gap-2 shadow-lg border border-white/20">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-semibold text-gray-900">
                    Sold
                  </span>
                </div>
              )}
              {data.listing.status === "DELETED" && (
                <div className="absolute top-5 right-5 z-10 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 flex items-center gap-2 shadow-lg border border-white/20">
                  <X className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-semibold text-gray-900">
                    Not Available
                  </span>
                </div>
              )}

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  {hasPrev && (
                    <button
                      onClick={() => setActiveIndex((p) => p - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 p-2.5 rounded-full transition-all shadow-md opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  {hasNext && (
                    <button
                      onClick={() => setActiveIndex((p) => p + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-900 p-2.5 rounded-full transition-all shadow-md opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  )}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition">
                    {activeIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {showReportModal && (
              <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                type="listing"
                id={data.listing.id}
              />
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      idx === activeIndex
                        ? "border-blue-600 ring-2 ring-blue-400 ring-offset-2"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-gray-900">
                  {data.listing.title}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                ₹{displayPrice}
              </h1>
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Posted{" "}
                  {new Date(data.listing.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.listing.description}
              </p>
            </div>

            {/* Seller Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/30">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
                Seller
              </p>
              <div className="flex items-center gap-3">
                {data.pfImageUrl ? (
                  <img
                    src={data.pfImageUrl}
                    className="w-12 h-12 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    {data?.name?.charAt(0) || "S"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {data?.name || "Campus Seller"}
                  </p>
                  <p className="text-xs text-gray-600">Campus Seller</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 relative">
              {/* If user is authenticated, show normal buttons */}
              {user ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleSave}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isSaved
                          ? "bg-red-400 text-white hover:bg-red-700 shadow-md"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={isSaved ? "currentColor" : "none"}
                      />
                      <span className="hidden sm:inline">
                        {isSaved ? "Saved" : "Save"}
                      </span>
                    </button>

                    <button
                      onClick={handleContactSeller}
                      disabled={
                        isOwnListing ||
                        data.listing.status === "SOLD" ||
                        data.listing.status === "DELETED"
                      }
                      className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                        isOwnListing
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300"
                      }`}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                  </div>

                  <button
                    onClick={handleMakeOffer}
                    disabled={
                      data.listing.status === "SOLD" ||
                      data.listing.status === "DELETED" ||
                      isOwnListing
                    }
                    className={`w-full py-3.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      data.listing.status === "ACTIVE" && !isOwnListing
                        ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Make Offer
                  </button>

                  <button
                    disabled={isOwnListing}
                    onClick={handleReport}
                    className={`w-full py-3.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isOwnListing
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
                    }`}
                  >
                    <Flag className="w-5 h-5" />
                    Report
                  </button>
                </>
              ) : (
                /* If user is NOT authenticated, show faded buttons with overlay */
                <>
                  <div className="grid grid-cols-2 gap-3 opacity-50 pointer-events-none">
                    <button
                      className="py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 border border-gray-300"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="hidden sm:inline">Save</span>
                    </button>

                    <button
                      className="py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 border border-gray-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Message</span>
                    </button>
                  </div>

                  <button
                    className="w-full py-3.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md bg-blue-600 text-white opacity-50 pointer-events-none"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Make Offer
                  </button>

                  <button
                    className="w-full py-3.5 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md bg-red-600 text-white opacity-50 pointer-events-none"
                  >
                    <Flag className="w-5 h-5" />
                    Report
                  </button>

                  {/* Overlay Message */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
                    <div className="text-center px-4">
                      <p className="text-sm font-bold text-gray-900 mb-3">
                        Sign in to use these features
                      </p>
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full py-2.5 px-4 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md text-sm flex items-center justify-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Make an Offer
            </h2>
            <p className="text-sm text-gray-600 mb-8">
              Asking price:{" "}
              <span className="font-bold text-gray-900">₹{displayPrice}</span>
            </p>

            <div className="space-y-4 mb-8">
              <label className="block text-sm font-bold text-gray-900">
                Your Offer
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-lg">
                  ₹
                </span>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              {offerPrice && (
                <div className="text-sm font-semibold text-blue-700 bg-blue-50 p-3.5 rounded-lg border border-blue-200/30">
                  ₹{Number(offerPrice).toLocaleString("en-IN")} (
                  {(
                    ((Number(offerPrice) - Number(priceString)) /
                      Number(priceString)) *
                    100
                  ).toFixed(0)}
                  % of asking)
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setOfferPrice("");
                }}
                className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOffer}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                disabled={!offerPrice.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{` .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

`}</style>
    </div>
  );
};

export default ProductDetail;