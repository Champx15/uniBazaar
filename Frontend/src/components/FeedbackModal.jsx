import { useState } from 'react';
import userService from '../service/userService';

export default function FeedbackModal({ isOpen, onClose }) {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!feedback.trim()) {
      alert('Please enter some feedback');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userService.feedback({ feedback });
      if (!response) {
        throw new Error('Failed to send feedback');
      }

      setSent(true);
      setFeedback('');
      
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFeedback('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 p-8 w-full max-w-md">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Found a bug? Loved it? Let me know
          </h2>
          <p className="text-sm text-gray-600">
            Any feedback helps make this better.
          </p>
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your feedback here..."
          className="w-full min-h-32 p-3 border border-gray-200 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-300 mb-6 text-gray-900 placeholder-gray-400"
          autoFocus
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sent ? 'Sent! ✓' : isLoading ? 'Sending...' : 'Send Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}