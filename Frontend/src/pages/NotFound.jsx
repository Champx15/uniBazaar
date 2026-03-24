import { useNavigate } from "react-router";
import { Home, Search, ArrowRight, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const suggestedLinks = [
    { label: "Browse Products", path: "/explore", icon: "🛍️" },
    { label: "My Wishlist", path: "/saved", icon: "♥" },
    { label: "Messages", path: "/messages", icon: "💬" },
    { label: "My Account", path: "/profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center space-y-8 animate-fade-in">
          {/* Large 404 */}
          <div className="relative">
            <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 select-none">
              404
            </div>
            <div className="absolute inset-0 text-8xl sm:text-9xl font-black text-zinc-900 opacity-5 blur-2xl">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-light text-zinc-900 tracking-tight">
              Page not found
            </h1>
            <p className="text-lg text-zinc-600 font-light max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          {/* Alert Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 font-medium">
              Check the URL and try again, or use the navigation below.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-zinc-900 text-white font-medium hover:bg-zinc-800 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white border-2 border-zinc-300 text-zinc-900 font-medium hover:bg-zinc-50 hover:border-zinc-400 transition-all duration-200"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Go Back
            </button>
          </div>
        </div>

        {/* Suggested Links */}
        <div className="mt-16 pt-12 border-t border-zinc-200">
          <p className="text-sm text-zinc-600 font-medium uppercase tracking-wider text-center mb-6">
            Quick Navigation
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {suggestedLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => navigate(link.path)}
                className="group flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer bg-white border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-200 space-y-2"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                  {link.icon}
                </span>
                <span className="text-xs font-medium text-zinc-700 text-center group-hover:text-zinc-900 transition-colors">
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-xs text-zinc-400">
            Error Code: <code className="bg-zinc-100 px-2 py-1 rounded text-zinc-600 font-mono">404_NOT_FOUND</code>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}