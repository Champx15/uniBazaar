import React from "react"

/* ── Avatar ──────────────────────────────────────────────────────────────── */
export function Avatar({ name = "", imageUrl, size = 36 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dimensionStyle = { width: size, height: size };
  const fontSizeStyle = { fontSize: size * 0.35 };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        style={dimensionStyle}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={{ ...dimensionStyle, ...fontSizeStyle }}
      className="rounded-full bg-[#EEF3FF] text-[#1A6BFF] flex items-center justify-center font-bold shrink-0"
    >
      {initials || "?"}
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────────────────────────── */
export function Spinner({ size = 32 }) {
  return (
    <div className="flex justify-center p-12">
      <div
        style={{ width: size, height: size }}
        className="rounded-full border-[3px] border-[#EEF3FF] border-t-[#1A6BFF] animate-spin"
      />
    </div>
  );
}

/* ── EmptyState ──────────────────────────────────────────────────────────── */
export function EmptyState({ icon = "📭", title, sub, action }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="text-[52px] mb-3">{icon}</div>

      <div className="text-[17px] font-bold text-[#0F1117] mb-1.5">
        {title}
      </div>

      {sub && (
        <div className="text-[13px] text-[#9CA3AF] mb-5">
          {sub}
        </div>
      )}

      {action}
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────────────────────────── */
export function Toast({ message, type = "success", onClose }) {
  const bg =
    type === "error"
      ? "#EF4444"
      : type === "info"
      ? "#1A6BFF"
      : "#00C48C";

  // Auto-dismiss after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{ background: bg }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 text-white px-5.5 py-3 rounded-xl font-semibold text-[13px] z-9999 shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center gap-2.5 animate-[slideUp_0.3s_ease] whitespace-nowrap"
    >
      {message}
      <button
        onClick={onClose}
        className="bg-transparent border-none text-white cursor-pointer text-base"
      >
        ✕
      </button>
    </div>
  );
}

/* ── Modal ───────────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[rgba(0,0,0,0.45)] z-1000 flex items-center justify-center p-4 animate-[fadeIn_0.15s_ease]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
        className="bg-white rounded-[20px] w-full max-h-[90vh] overflow-y-auto p-7 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
      >
        <div className="flex justify-between items-center mb-5.5">
          <div className="text-[18px] font-extrabold text-[#0F1117]">
            {title}
          </div>

          <button
            onClick={onClose}
            className="bg-transparent border-none text-[22px] cursor-pointer text-[#6B7280] leading-none"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/* ── FormField ───────────────────────────────────────────────────────────── */
export function FormField({ label, error, hint, children }) {
  return (
    <div className="mb-4">
      {label && (
        <div className="text-[11px] font-bold text-[#6B7280] mb-1.5 uppercase tracking-[0.6px]">
          {label}
        </div>
      )}

      {children}

      {hint && (
        <div className="text-[13px] text-[#000000] mt-1">
          {hint}
        </div>
      )}

      {error && (
        <div className="text-[11px] text-[#EF4444] mt-1">
          {error}
        </div>
      )}
    </div>
  );
}

/* ── Input ───────────────────────────────────────────────────────────────── */
export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={`${className || ""} w-full px-3.5 py-2.75 border-[1.5px] border-[#E8EBF0] rounded-[10px] text-[14px] text-[#0F1117] bg-white transition-[border-color] duration-150`}
    />
  );
}

/* ── Textarea ────────────────────────────────────────────────────────────── */
export function Textarea({ className, ...props }) {
  return (
    <textarea
      {...props}
      className={`${className || ""} w-full px-3.5 py-2.75 border-[1.5px] border-[#E8EBF0] rounded-[10px] text-[14px] text-[#0F1117] bg-white resize-y min-h-25`}
    />
  );
}

/* ── PrimaryButton ───────────────────────────────────────────────────────── */
export function PrimaryButton({
  children,
  loading,
  fullWidth,
  className,
  ...props
}) {
  const disabled = loading || props.disabled;

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${className || ""}
        px-6 py-3
        bg-[#1A6BFF]
        text-white
        rounded-xl
        font-extrabold
        text-[14px]
        transition-[opacity,transform]
        duration-150
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
      `}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = loading ? "0.7" : "1";
      }}
    >
      {loading ? "Loading…" : children}
    </button>
  );
}

/* ── TagChip ─────────────────────────────────────────────────────────────── */
export function TagChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#EEF3FF] text-[#1A6BFF] px-2.5 py-1 rounded-[20px] text-[12px] font-semibold">
      {label}

      {onRemove && (
        <button
          onClick={onRemove}
          className="bg-transparent border-none cursor-pointer text-[#1A6BFF] text-[14px] leading-none p-0 -mt-px"
        >
          ×
        </button>
      )}
    </span>
  );
}

/* ── timeAgo helper ──────────────────────────────────────────────────────── */
export function timeAgo(timestamp) {
  if (!timestamp) return "";

  const diff = Date.now() - new Date(timestamp).getTime();

  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;

  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12)
    return `${months} month${months > 1 ? "s" : ""} ago`;

  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

