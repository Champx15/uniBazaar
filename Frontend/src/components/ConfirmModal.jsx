import { Modal } from "./UI.jsx";

export function ConfirmModal({ open, title, message, confirmText = "Delete", cancelText = "Cancel", isDestructive = false, onConfirm, onCancel, loading = false }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth={420}>
      <div className="mb-6">
        <div className="text-sm leading-6 text-gray-500">
          {message}
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onCancel}
          disabled={loading}
          className={`flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-500 ${
            loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`flex-1 py-3 rounded-xl font-bold text-sm text-white ${
            isDestructive ? "bg-red-500" : "bg-blue-600"
          } ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
          {loading ? "..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}