import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router";

export default function Banned() {
const navigate = useNavigate();

return ( 

<div className="min-h-screen flex items-center justify-center bg-red-50 px-4"> 
  <div className="text-center max-w-md"> 
    <ShieldX size={100} className="text-red-600 mx-auto mb-4" />
    <h1 className="text-3xl md:text-4xl font-bold text-red-900 mb-3">
Account Restricted </h1>

    <p className="text-red-700 mb-4 text-sm md:text-base">
      Your account has been suspended due to a policy violation.
    </p>

    <p className="text-gray-600 mb-6 text-base">
      We've sent you an email with more details. If you believe this was a mistake, you can contact support.
    </p>

    <div className="flex gap-3 justify-center">
      <button
        onClick={() => navigate("/")}
        className="px-5 py-2 bg-red-600 text-white rounded-lg md:text-lg hover:bg-red-700 transition"
      >
        Go Home
      </button>
    </div>
  </div>
</div>

);
}
