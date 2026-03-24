import {useState} from "react";
import { X, Clock, AlertCircle, Mail, RefreshCw } from "lucide-react";
import IdentityVerificationModal from "./IdentityVerificationModal";

const VerificationStatusModal = ({ 
  isOpen, 
  onClose, 
  cardStatus = "PENDING",  // PENDING, REJECTED
  actionType = "create listing"
}) => {
  if (!isOpen) return null;
  const [openIdentityVerificationModel, setOpenIdentityVerificationModel] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {cardStatus === "PENDING" ? "Verification in Progress" : "Verification Rejected"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {cardStatus === "PENDING" ? (
            // Pending State
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="bg-yellow-100 rounded-full p-4 animate-pulse">
                  <Clock className="text-yellow-600" size={40} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Your verification is in progress
              </h3>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Thank you for submitting your college ID. Our team is reviewing your documents and we'll have an update for you within 24 hours.
              </p>

              {/* Info Boxes */}
              <div className="space-y-4 mb-6">
                {/* What happens next */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-xs font-semibold text-blue-900 mb-2">What happens next:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Our team verifies your ID</li>
                    <li>✓ You'll get an email confirmation</li>
                    <li>✓ You can then {actionType}</li>
                  </ul>
                </div>

                {/* Email notification */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <Mail className="text-green-600 flex-shrink-0" size={20} />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-green-800 mb-1">Check your email</p>
                    <p className="text-xs text-green-700">
                      We'll notify you as soon as your verification is complete.
                    </p>
                  </div>
                </div>

                {/* In the meantime */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-900 mb-2">In the meantime, you can:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Browse listings</li>
                    <li>• Add items to your wishlist</li>
                  </ul>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
              >
                Got It
              </button>
            </div>
          ) : cardStatus === "REJECTED" ? (
            // Rejected State
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertCircle className="text-red-600" size={40} />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Verification Rejected
              </h3>

              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Unfortunately, we couldn't verify your identity with the submitted documents. This could be due to image quality or missing information.
              </p>

              {/* Rejection reasons */}
              <div className="space-y-4 mb-6">
                {/* Common reasons */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-left">
                  <p className="text-xs font-semibold text-orange-900 mb-2">Common reasons for rejection:</p>
                  <ul className="text-xs text-orange-800 space-y-1">
                    <li>• Image is blurry or unclear</li>
                    <li>• ID information is not fully visible</li>
                    <li>• ID has expired</li>
                    <li>• Document doesn't match your profile</li>
                  </ul>
                </div>

                {/* What to do */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-xs font-semibold text-blue-900 mb-2">What you can do:</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Take a clearer photo of your ID</li>
                    <li>✓ Make sure all information is visible</li>
                    <li>✓ Try uploading again</li>
                  </ul>
                </div>

                {/* Contact support */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600">
                    If you need help, you can contact our support team at{" "}
                    <span className="font-semibold text-gray-900">support@unibazaar.com</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setOpenIdentityVerificationModel(true);
                    //TODO: fix this
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Try Again
                </button>
                {openIdentityVerificationModel && (
                  <IdentityVerificationModal
                    isOpen={openIdentityVerificationModel}
                    onClose={() => setOpenIdentityVerificationModel(false)}
                    userEnrollmentNo={true}
                    actionType = {actionType}
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VerificationStatusModal;