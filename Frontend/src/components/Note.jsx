import React, { useState } from "react";
import FeedbackIcon from "../icons/feedback.png";
import FeedbackModal from "./FeedbackModal"; // Assuming you have this

export default function Note({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/20 backdrop-blur-sm">
      {/* Click overlay to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-[32px] p-8 pb-12 animate-slide-up shadow-2xl">
        {/* Decorative Handle */}
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />

        <div className="font-dancing text-xl font-extrabold text-gray-700 space-y-4 leading-relaxed text-center">
          <p>Built this while figuring things out.</p>
          <p>Not perfect, but I wanted something useful for our campus.</p>
          <p>If you’re using it, that means a lot.</p>
          <p className="text-blue-600">
            Find a bug? Congrats, you’re a tester :)
          </p>
        </div>

        <div className="flex justify-between items-center mt-5">
          <button
            className="p-3 rounded-2xl  transition-transform"
            onClick={() => setOpenFeedbackModal(true)}
          >
            <img src={FeedbackIcon} className="w-6 h-6" alt="feedback" />
          </button>
          <span className="font-dancing text-lg font-extrabold text-gray-400">
            — a fellow builder
          </span>
          
        </div>

        {openFeedbackModal && (
          <FeedbackModal 
            isOpen={openFeedbackModal} 
            onClose={() => setOpenFeedbackModal(false)} 
          />
        )}
      </div>
    </div>
  );
}