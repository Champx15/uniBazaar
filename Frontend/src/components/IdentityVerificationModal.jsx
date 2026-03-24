import React, { useState, useRef } from "react";
import userService from "../service/userService";
import { X, Upload, AlertCircle, Clock, Loader, Mail } from "lucide-react";

const IdentityVerificationModal = ({
  isOpen,
  onClose,
  actionType = "create listing",
  userEnrollmentNo = false,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];
  const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
  const MAX_ENROLLMENT_LENGTH = 15;

  // Check if enrollment is needed (only ask if user doesn't have one)
  const needsEnrollment = !userEnrollmentNo;

  const validateFile = (selectedFile) => {
    setError("");

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return false;
    }

    // Check file format
    if (!ALLOWED_FORMATS.includes(selectedFile.type)) {
      setError("Only JPG, PNG, and WebP formats are allowed");
      return false;
    }

    // Check file extension
    const fileName = selectedFile.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext),
    );
    if (!hasValidExtension) {
      setError("Invalid file type. Please upload a valid image file");
      return false;
    }

    return true;
  };

  const validateEnrollment = (enrollment) => {
    if (!enrollment || enrollment.trim().length === 0) {
      return "Enrollment number is required";
    }
    if (enrollment.length > MAX_ENROLLMENT_LENGTH) {
      return `Enrollment number must be ${MAX_ENROLLMENT_LENGTH} characters or less`;
    }
    return "";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result);
        };
        reader.readAsDataURL(droppedFile);
      }
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Validate file
    if (!file) {
      setError("Please select a file");
      return;
    }

    // Validate enrollment if needed
    if (needsEnrollment) {
      const enrollmentError = validateEnrollment(enrollmentNo);
      if (enrollmentError) {
        setError(enrollmentError);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await userService.uploadIdCard({
        idCard: file,
        enrollmentNo: needsEnrollment ? enrollmentNo : null,
      });
      setSubmitted(true);
      // Keep modal open to show pending message
      setFile(null);
      setPreview(null);
      setEnrollmentNo("");
    } catch (err) {
      setError(err.message || "Failed to submit ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {submitted ? "Verification Submitted" : "Verify Your Identity"}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!submitted ? (
            <>
              {/* Info Section */}
              <div className="mb-6">
                <p className="text-gray-700 text-sm mb-3">
                  To {actionType}, we need to verify you're a registered
                  student. Please upload a clear photo of your college ID card
                  {needsEnrollment && " and provide your enrollment number"}.
                </p>

                {/* Privacy Notice */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4 flex gap-3">
                  <AlertCircle
                    className="text-purple-600 flex-shrink-0"
                    size={20}
                  />
                  <div className="text-xs text-purple-800">
                    <p className="font-semibold mb-1">Privacy Notice:</p>
                    <p>
                      We only use this data to verify you're a student. We don't
                      store or keep your ID information.
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle
                    className="text-blue-600 flex-shrink-0"
                    size={20}
                  />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Requirements:</p>
                    <ul className="space-y-1">
                      <li>• Clear photo of your college ID</li>
                      <li>• JPG, PNG, or WebP format</li>
                      <li>• Maximum file size: 5MB</li>
                      <li>• Make sure your ID is clearly visible</li>
                      {needsEnrollment && (
                        <li>
                          • Enrollment number (up to {MAX_ENROLLMENT_LENGTH}{" "}
                          characters)
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              {!preview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all mb-6"
                >
                  <Upload className="mx-auto mb-3 text-gray-400" size={40} />
                  <p className="text-gray-900 font-semibold mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-600">
                    JPG, PNG, or WebP (Max 5MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(",")}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                </div>
              ) : (
                <div className="mb-6">
                  {/* Image Preview */}
                  <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={preview}
                      alt="College ID Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold">File:</span> {file?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Size:</span>{" "}
                      {((file?.size || 0) / 1024).toFixed(2)} KB
                    </p>
                  </div>

                  {/* Change File Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-semibold py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change File
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ALLOWED_EXTENSIONS.join(",")}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={loading}
                  />
                </div>
              )}

              {/* Enrollment Number Field - Only show if user doesn't have one */}
              {needsEnrollment && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Enrollment Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={enrollmentNo}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only digits
                      if (value.length <= MAX_ENROLLMENT_LENGTH) {
                        setEnrollmentNo(value);
                      }
                    }}
                    placeholder="Enter your enrollment number"
                    maxLength={MAX_ENROLLMENT_LENGTH}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {enrollmentNo.length}/{MAX_ENROLLMENT_LENGTH} characters
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
                  <AlertCircle
                    className="text-red-600 flex-shrink-0"
                    size={20}
                  />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    !file || (needsEnrollment && !enrollmentNo) || loading
                  }
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all disabled:bg-blue-600/60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit ID"
                  )}
                </button>
              </div>
            </>
          ) : (
            // Pending Verification State
            <div className="text-center py-12">
              <div className="mb-6 flex justify-center">
                <div className="bg-yellow-100 rounded-full p-4 animate-pulse">
                  <Clock className="text-yellow-600" size={40} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Verification Pending
              </h3>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Your ID has been submitted successfully. Our team will verify
                your identity within 24 hours.
              </p>

              {/* Email Check Section */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3">
                <Mail className="text-green-600 flex-shrink-0" size={20} />
                <div className="text-left">
                  <p className="text-xs font-semibold text-green-800 mb-1">
                    Check your email
                  </p>
                  <p className="text-xs text-green-700">
                    We'll send you a confirmation once your verification is
                    complete.
                  </p>
                </div>
              </div>

              {/* Info Message */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600">
                  In the meantime, you can browse listings and add items to your
                  wishlist. Once verified, you'll be able to create listings,
                  make offers, and message sellers.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Got It
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationModal;
