import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Image1 from "../images/img1.jpg";
import Image2 from "../images/img2.png";
import Image3 from "../images/img3.jpg";
import Image4 from "../images/img4.webp";
import { useNavigate } from "react-router";
import authService from "../service/authService";

const Signup = () => {
  const navigate = useNavigate();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [step, setStep] = useState("signup"); // signup -> otp -> success

  const images = [Image1, Image2, Image3, Image4];

  /* =======================
     Background Carousel
  ======================== */
  useEffect(() => {
    const slider = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(slider);
  }, []);

  /* =======================
     OTP Countdown Timer
  ======================== */
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const currentImage = images[currentImageIndex];

  /* =======================
     VALIDATIONS
  ======================== */
  const validateName = (name) => {
    if (!name || name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    if (name.length > 50) {
      return "Full name must be less than 50 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validateEnrollmentNo = (enrollmentNo) => {
    if (!enrollmentNo || enrollmentNo.trim().length === 0) {
      return "Enrollment number is required";
    }
    if (enrollmentNo.length >= 15) {
      return "Enrollment number must be less than 15 digits";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&* etc)";
    }
    return "";
  };

  const validateOtp = (otp) => {
    if (!otp || otp.length < 6 || otp.length > 6) {
      return "Please enter a valid 6-digit OTP";
    }
    return "";
  };
  /* =======================
     SEND OTP
  ======================== */
  const handleGetOtp = async (e) => {
    e.preventDefault();

    // Validate only email & enrollment
    const emailError = validateEmail(email);
    const enrollmentError = validateEnrollmentNo(enrollmentNo);

    if (emailError) {
      setError(emailError);
      return;
    }
    if (enrollmentError) {
      setError(enrollmentError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const result = await authService.sendOTP({ email, enrollmentNo });

      if (result.success) {
        setStep("otp");
        setSuccessMessage("OTP sent to your email!");
        setTimer(60);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     VERIFY OTP & SIGNUP
  ======================== */
  const handleSignup = async (e) => {
    e.preventDefault();

    const nameError = validateName(fullName);
    const passwordError = validatePassword(password);
    const OtpError = validateOtp(otp);

    if (nameError) {
      setError(nameError);
      return;
    }
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (OtpError) {
      setError(OtpError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const result = await authService.verifySignup({
        name: fullName,
        email,
        pass: password,
        pfImage: null,
        otp,
        enrollmentNo,
      });

      if (result.success) {
        setStep("success");
        setOtp("");
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     RESEND OTP
  ======================== */
  const handleResendOtp = async () => {
    
    const emailError = validateEmail(email);
    const enrollmentError = validateEnrollmentNo(enrollmentNo);

    if (emailError) {
      setError(emailError);
      return;
    }
    if (enrollmentError) {
      setError(enrollmentError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const result = await authService.sendOTP({ email, enrollmentNo });

      if (result.success) {
        setSuccessMessage("OTP resent to your email!");
        setTimer(60);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-7 top-0 left-0 right-0 px-6 pt-8 pb-8 text-left">
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
            <h1 className="text-5xl font-extrabold mb-6">Uni Bazaar</h1>
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
            {/* Floating Glass Signup Panel */}
            <div className="w-full max-w-sm md:max-w-md px-1.5 md:px-0">
              {/* Glass Panel Container */}
              <div className="bg-white/30 md:bg-white/20 backdrop-blur-lg md:backdrop-blur-2xl border border-white/50 md:border-white/40 rounded-3xl p-7 md:p-5 shadow-2xl">
                {/* Form Header */}
                <div className="mb-7">
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-2 drop-shadow-md">
                    {step === "success" ? "Welcome!" : "Create Account"}
                  </h2>
                  <p className="text-white text-sm md:text-base font-medium drop-shadow-md">
                    {step === "success"
                      ? "Your account has been created successfully"
                      : step === "otp"
                        ? "Enter the OTP sent to your email"
                        : "Join our campus marketplace"}
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-600/50 text-red-100 text-center rounded-xl py-2.5 px-3 mb-5 shadow-md backdrop-blur-sm text-xs md:text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-600/40 text-green-100 text-center rounded-xl py-2.5 px-3 mb-5 shadow-md backdrop-blur-sm text-xs md:text-sm font-medium">
                    {successMessage}
                  </div>
                )}

                {/* Success State */}
                {step === "success" && (
                  <div className="text-center py-8">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-green-500/20 rounded-full p-4">
                        <svg
                          className="w-10 h-10 text-green-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-6">
                      You can now log in and start exploring the marketplace.
                    </p>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/50"
                    >
                      Go to Login
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {/* Form */}
                {step !== "success" && (
                  <form
                    className="space-y-2 md:space-y-2.5"
                    onSubmit={step === "otp" ? handleSignup : handleGetOtp}
                  >
                    {/* Full Name */}
                    {step === "signup" && (
                      <div>
                        <label className="block text-xs font-bold text-white/95 mb-1 uppercase tracking-widest drop-shadow-md">
                          Full Name
                        </label>
                        <input
                          type="text"
                          maxLength="100"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm"
                        />
                      </div>
                    )}

                    {/* Email */}
                    {step === "signup" && (
                      <div>
                        <label className="block text-xs font-bold text-white/95 mb-1 uppercase tracking-widest drop-shadow-md">
                          Email
                        </label>
                        <input
                          type="email"
                          maxLength="254"
                          placeholder="john.doe@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm"
                        />
                      </div>
                    )}

                    {/* Enrollment Number */}
                    {step === "signup" && (
                      <div>
                        <label className="block text-xs font-bold text-white/95 mb-1 uppercase tracking-widest drop-shadow-md">
                          Enrollment Number
                        </label>
                        <input
                          type="text"
                          maxLength="15"
                          placeholder="Enter your enrollment number"
                          value={enrollmentNo}
                          onChange={(e) => setEnrollmentNo(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm"
                        />
                        <p className="text-xs text-white/70 mt-1">
                          • Max 15 characters
                        </p>
                      </div>
                    )}

                    {/* Password */}
                    {step === "signup" && (
                      <div>
                        <label className="block text-xs font-bold text-white/95 mb-1 uppercase tracking-widest drop-shadow-md">
                          Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          minLength="8"
                          maxLength="128"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-12 top-97 md:top-101 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                        <p className="text-xs text-white/70 mt-1">
                          • Min 8 characters • 1 number • 1 special char
                          (!@#$%^&* etc)
                        </p>
                      </div>
                    )}

                    {/* OTP Input */}
                    {step === "otp" && (
                      <div>
                        <label className="block text-xs font-bold text-white/95 mb-2.5 uppercase tracking-widest drop-shadow-md">
                          OTP Code
                        </label>
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                          }
                          maxLength="6"
                          minLength="6"
                          required
                          className="w-full px-4 py-3.5 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm text-center tracking-widest font-mono shadow-sm"
                        />
                      </div>
                    )}

                    {/* Sign Up Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 group cursor-pointer text-sm"
                    >
                      {loading ? (
                        step === "otp" ? (
                          "Creating Account..."
                        ) : (
                          "Sending OTP..."
                        )
                      ) : (
                        <>
                          {step === "otp" ? "Create Account" : "Get OTP"}
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>

                    {/* Resend OTP */}
                    {step === "otp" && (
                      <>
                        {timer > 0 ? (
                          <p className="text-white text-sm text-center">
                            Resend OTP in {timer}s
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading}
                            className="text-sm text-white underline text-center w-full hover:text-white/80 transition-colors disabled:opacity-60"
                          >
                            Resend OTP
                          </button>
                        )}
                      </>
                    )}
                  </form>
                )}

                {/* Sign In Link */}
                {step !== "success" && (
                  <p className="mt-4 text-center text-white/80 text-xs md:text-sm font-medium">
                    Already have an account?{" "}
                    <button
                      onClick={() => navigate("/login")}
                      className="text-white font-bold hover:text-white/80 underline transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
