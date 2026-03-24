import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Image1 from "../images/img1.jpg";
import Image2 from "../images/img2.png";
import Image3 from "../images/img3.jpg";
import Image4 from "../images/img4.webp";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext/AuthContext";

const Login = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { login, user, oAuth2Login } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email, pass);
      if (result.success) {
        const userRole = result.user?.role;
        if (userRole === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          const from = location.state?.from?.pathname || "/explore";
          navigate(from, { replace: true });
        }
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleOAuth2Login = () => {
    window.location.href =
      "http://localhost:8080/api/v1/oauth2/authorization/google";
  };

  const images = [Image1, Image2, Image3, Image4];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:p-10 lg:p-3 relative overflow-hidden">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={currentImage}
          alt="Blurred Background"
          className="absolute inset-0 w-full h-full object-cover blur-lg opacity-50 scale-110"
        />
      </div>

      {/* Dark Overlay for depth */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-7"></div>

      {/* MOBILE: Header with Logo and Text */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-7 top-0 left-0 right-0  px-6 pt-8 pb-8 text-left">
        <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-xl">
          uniBazaar
        </h1>
        <p className="text-sm text-white leading-relaxed drop-shadow-xl">
          Your campus marketplace. Buy, sell, and exchange items with fellow
          students safely and easily.
        </p>

        <p className="mt-2 text-sm text-white leading-relaxed drop-shadow-xl">
          From books to bikes — everything within your university.
        </p>
      </div>

      {/* Main Card Container - Responsive */}
      <div
        className="relative w-full h-screen md:h-auto md:aspect-video max-w-[1400px] md:max-h-[630px] 
           md:rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Background Image with Carousel */}
        <img
          src={currentImage}
          alt="Background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Dark Overlay - Subtle for text readability - DESKTOP ONLY */}
        <div className="hidden md:block absolute inset-0 bg-black/15"></div>

        <div className="relative w-full h-full flex items-center px-4 md:px-12">
          {/* LEFT SIDE - Banner - DESKTOP ONLY */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-0 pointer-events-none"></div>

          {/* Content Container - DESKTOP ONLY */}
          <div className="relative z-20 hidden md:flex flex-col justify-center w-1/2 pr-10 text-white">
            <h1 className="text-5xl font-extrabold mb-6">uniBazaar</h1>

            <p className="text-xl text-white leading-relaxed drop-shadow-xl">
              Your campus marketplace. Buy, sell, and exchange items with fellow
              students safely and easily.
            </p>

            <p className="mt-4 text-xl text-white drop-shadow-xl">
              From books to bikes — everything within your university.
            </p>
          </div>

          {/* Form Container */}
          <div className="relative w-full h-full flex items-center justify-center md:justify-end px-0 md:px-0 md:pr-8 lg:pr-16 z-20 pt-32 md:pt-0">
            {/* Floating Glass Login Panel */}
            <div className="w-full max-w-sm md:max-w-md px-1.5 md:px-0">
              {/* Glass Panel Container - LESS GLASS ON MOBILE */}
              <div className="bg-white/20 md:bg-white/20 backdrop-blur-sm md:backdrop-blur-2xl border border-white/40 rounded-3xl p-6 md:p-6 shadow-2xl">
                {/* Form Header */}
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-md">
                    Welcome back
                  </h2>
                  <p className="text-white text-sm md:text-base font-medium">
                    Please enter your credentials
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-600/40 text-red-100 text-center rounded-xl py-2 px-3 md:py-1.5 mb-4 shadow-md backdrop-blur-sm text-xs md:text-sm">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form className="space-y-3" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-bold text-white/90 mb-2.5 uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      maxLength="254"
                      placeholder="john.doe@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/40 text-white placeholder:text-white/60 focus:bg-white/25 focus:border-white/60 focus:outline-none transition-all text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <label className="text-xs font-bold text-white/90 uppercase tracking-widest">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-pass")}
                        className="text-xs font-semibold text-white/80 hover:text-white underline transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      maxLength="128"
                      placeholder="••••••••••••"
                      name="password"
                      autocomplete="current-password"
                      className="w-full px-4 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/40 text-white placeholder:text-white/60 focus:bg-white/25 focus:border-white/60 focus:outline-none transition-all text-sm"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      required
                    />
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 group cursor-pointer text-sm"
                  >
                    {loading ? (
                      "Signing In..."
                    ) : (
                      <>
                        Sign In{" "}
                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-4 flex items-center gap-3">
                  <div className="flex-grow h-px bg-white/30"></div>
                  <span className="text-xs text-white/60 font-bold uppercase tracking-widest">
                    or
                  </span>
                  <div className="flex-grow h-px bg-white/30"></div>
                </div>

                {/* Google Sign In */}
                <button
                  className="w-full bg-white/15 backdrop-blur-md hover:bg-white/25 border border-white/40 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 md:gap-3 hover:shadow-lg text-sm md:text-sm cursor-pointer"
                  onClick={handleOAuth2Login}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className=" md:inline">Sign in with Google</span>
                </button>

                {/* Sign Up Link */}
                <p className="mt-7 text-center text-white/80 text-xs md:text-sm font-medium">
                  Are you new?{" "}
                  <button
                    className="text-white font-bold hover:text-white/80 underline transition-colors cursor-pointer"
                    onClick={() => navigate("/signup")}
                  >
                    Create an Account
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
