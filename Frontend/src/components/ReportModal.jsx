import { useState } from "react";
import { Modal } from "../components/UI.jsx";
import reportService from "../service/reportService";

function ReportModal({ isOpen, onClose, type, id }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    // Validation
    if (!reason) {
      setError("Please select a reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await reportService.report({
        type,
        id,
        reason,
        description
      });

      if (result.success) {
        // Reset form
        setReason("");
        setDescription("");
        onClose();
      } else {
        setError(result.error || "Failed to submit report");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={`Report ${type === "user" ? "User" : "Listing"}`}>
      {error && (
        <div style={{ backgroundColor: "#fee", color: "#c33", padding: "10px", borderRadius: "4px", marginBottom: "15px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Reason
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        >
          <option value="">Select reason</option>
          <option value="SPAM">Spam</option>
          <option value="HARASSMENT">Harassment</option>
          <option value="FAKE">Fake/Scam</option>
          <option value="INAPPROPRIATE">Inappropriate Content</option>
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us more..."
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minHeight: "100px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onClose}
          disabled={loading}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !reason}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            cursor: loading || !reason ? "not-allowed" : "pointer",
            opacity: loading || !reason ? 0.6 : 1
          }}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </Modal>
  );
}

export default ReportModal;