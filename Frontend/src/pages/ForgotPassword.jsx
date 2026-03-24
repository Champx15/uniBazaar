import React, { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image1 from "../images/img1.jpg";
import Image2 from "../images/img2.png";
import Image3 from "../images/img3.jpg";
import Image4 from "../images/img4.webp";
import { useNavigate } from "react-router";
import authService from "../service/authService";

const ForgotPassword = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  // Step states
  const [step, setStep] = useState("email"); // email -> otp -> newPassword -> success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  //Validation

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email";
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

  // Step 1: Email verification
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await authService.checkEmail({ email });
      if (result.success) {
        setSuccessMessage("Email exists. Sending OTP...");
        setTimeout(() => {
          setStep("otp");
          setSuccessMessage("");
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpError = validateOtp(otp);

    if (otpError) {
      setError(otpError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await authService.verifyOTP({ email, otp });
      if (result.success) {
        setSuccessMessage("OTP verified! Enter your new password.");
        setTimeout(() => {
          setStep("newPassword");
          setSuccessMessage("");
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newPassError = validatePassword(newPass);
    const confirmPassError = validatePassword(confirmPass);

    if (newPassError) {
      setError(newPassError);
      setLoading(false);
      return;
    }
    if (confirmPassError) {
      setError(confirmPassError);
      setLoading(false);
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const result = await authService.resetPassword({ newPass });
      if (result.success) {
        setSuccessMessage("Password reset successfully!");
        setTimeout(() => {
          setStep("success");
          setSuccessMessage("");
        }, 1500);
      }
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (step) {
      case "email":
        return "Forgot Password";
      case "otp":
        return "Verify OTP";
      case "newPassword":
        return "Reset Password";
      default:
        return "Success";
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case "email":
        return "Please enter your email to reset your password";
      case "otp":
        return "Enter the OTP sent to your email";
      case "newPassword":
        return "Create a new password for your account";
      default:
        return "Your password has been reset successfully";
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
            {/* Glass Panel */}
            <div className="w-full max-w-sm md:max-w-md px-1.5 md:px-0">
              <div className="bg-white/30 md:bg-white/20 backdrop-blur-lg md:backdrop-blur-2xl border border-white/50 md:border-white/40 rounded-3xl p-7 md:p-6 shadow-2xl">
                {/* Form Header */}
                <div className="mb-7">
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-md">
                    {getTitle()}
                  </h2>
                  <p className="text-white text-sm md:text-base font-medium drop-shadow-md">
                    {getSubtitle()}
                  </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-500/40 text-green-100 text-center rounded-xl py-2.5 px-3 mb-5 shadow-md backdrop-blur-sm text-xs md:text-sm font-medium">
                    {successMessage}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-600/50 text-red-100 text-center rounded-xl py-2.5 px-3 mb-5 shadow-md backdrop-blur-sm text-xs md:text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* STEP 1: EMAIL */}
                {step === "email" && (
                  <form className="space-y-4" onSubmit={handleCheckEmail}>
                    <div>
                      <label className="block text-xs font-bold text-white/95 mb-2.5 uppercase tracking-widest drop-shadow-md">
                        Email
                      </label>
                      <input
                        type="email"
                        maxLength="254"
                        placeholder="your@university.edu"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 group cursor-pointer text-sm"
                    >
                      {loading ? (
                        "Checking..."
                      ) : (
                        <>
                          Get OTP
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="flex items-center justify-center gap-2 mx-auto mt-6 text-white/80 hover:text-white transition"
                    >
                      <ArrowLeft size={16} />
                      Back to login
                    </button>
                  </form>
                )}

                {/* STEP 2: OTP */}
                {step === "otp" && (
                  <form className="space-y-4" onSubmit={handleVerifyOTP}>
                    <div>
                      <label className="block text-xs font-bold text-white/95 mb-2.5 uppercase tracking-widest drop-shadow-md">
                        OTP Code
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6 digit OTP"
                        maxLength="6"
                        minLength="6"
                        className="w-full px-4 py-3.5 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm text-center tracking-widest font-mono"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 group cursor-pointer text-sm"
                    >
                      {loading ? (
                        "Verifying..."
                      ) : (
                        <>
                          Verify OTP
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 3: NEW PASSWORD */}
                {step === "newPassword" && (
                  <form className="space-y-4" onSubmit={handleResetPassword}>
                    <div>
                      <label className="block text-xs font-bold text-white/95 mb-2.5 uppercase tracking-widest drop-shadow-md">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          minLength="8"
                          maxLength="128"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm pr-10"
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-white/70 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/95 mb-2.5 uppercase tracking-widest drop-shadow-md">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          minLength="8"
                          maxLength="128"
                          placeholder="••••••••"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/20 md:bg-white/15 backdrop-blur-md border border-white/50 md:border-white/40 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/70 focus:outline-none transition-all text-sm shadow-sm pr-10"
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3.5 text-white/70 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 disabled:shadow-none flex items-center justify-center gap-2 group cursor-pointer text-sm"
                    >
                      {loading ? (
                        "Resetting..."
                      ) : (
                        <>
                          Reset Password
                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 4: SUCCESS */}
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
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
                      Password Reset Successfully!
                    </h3>
                    <p className="text-white/80 text-sm mb-6">
                      Your password has been updated. You can now log in with
                      your new password.
                    </p>

                    <button
                      onClick={() => navigate("/login")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 group cursor-pointer text-sm"
                    >
                      Go to Login
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
