import { useAuth } from "../context/AuthContext/AuthContext";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext/UserContext";
import { Avatar } from "./UI";
import { BadgeCheck, CircleCheck ,BadgeX, Pencil,LogOut, Trash, Trash2} from "lucide-react";

function ProfileCard({ listings, setEditOpen, setDeleteAccountModal }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { deleteUser } = useUser();

  const activeCnt = listings.filter((listing) => listing.status==='ACTIVE').length;
  const soldCnt = listings.length - activeCnt;

  const stats = [
    ["Total", listings.length],
    ["Active", activeCnt],
    ["Sold", soldCnt],
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserBadge = (status) => {
    if (status === "ACTIVE") {
      return { label: "Verified", color: "bg-green-100 text-green-700" };
    }
    if (status === "UNVERIFIED") {
      return { label: "Unverified", color: "bg-red-100 text-red-700" };
    }
    return { label: "Unknown", color: "bg-gray-100 text-gray-600" };
  };
  const badge = getUserBadge(user?.status);

  return (
    <div className="bg-white rounded-2xl p-6 pb-4 border border-gray-200">
      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col gap-3">
        {/* Header Section */}
        <div className="flex  items-center-safe text-center gap-14  ">
          <div className="ml-9 w-20 h-20 rounded-2xl">
          <Avatar name={user?.name} imageUrl={user?.pfImageUrl} size={82}  />
          {/* <img src={user?.pfImageUrl} alt={user?.name} className="w-full h-full object-cover rounded-2xl" /> */}
          </div>
          <div>
            <div className="text-lg font-extrabold text-gray-900 flex items-center ml-5">
              {user?.name || "User"}

              <span
                className={`ml-2 px-2 py-1 w-fit h-fit text-xs font-semibold rounded-full flex gap-[1px]   ${badge.color}`}
              >                {badge.label=== "Verified" ?<BadgeCheck size={14} />:<BadgeX size={14} />}
                {badge.label}
              </span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {user?.email || "No email provided"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>
        {/* <hr className="bg-gray-200 text-gray-300 h-[2px]"></hr> */}

        {/* Stats Section */}
        {/* <div className="flex flex-col gap-1.5 pt-5 border-t border-gray-200">
          {stats.map(([label, val]) => (
            <div key={label} className="flex justify-between items-center">
              <div className="text-xs text-gray-400 font-semibold">{label}</div>
              <div className="text-lg font-extrabold text-blue-600">{val}</div>
            </div>
          ))}
        </div> */}

        {/* Buttons Section */}
        <div className="flex pt-3  gap-2 border-t-2 border-gray-200 text-gray-600">
          <button
            onClick={() => setEditOpen(true)}
            className="px-4 py-1  rounded-lg text-sm font-bold flex gap-1 cursor-pointer"
          >
            <Pencil size={18} /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1  rounded-lg text-sm font-bold flex gap-1 cursor-pointer"
          >
            <LogOut size={18} /> Logout
          </button>
          <button
            onClick={() => setDeleteAccountModal(true)}
            className="px-4 py-1  rounded-lg text-sm font-bold flex gap-1 cursor-pointer"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex md:hidden flex-col gap-4">
        {/* Header Section */}
        <div className=" ml-2 flex items-center gap-10">
          <Avatar
            name={user?.name || "Guest User"}
            imageUrl={user?.pfImageUrl}
            size={72}
          />
          <div className="flex-1 min-w-0">
            <div className="text-lg font-extrabold text-gray-900 flex items-center">
              {user?.name || "Guest User"}
              <span
                className={`ml-2 px-2 py-1 w-fit h-fit text-xs font-semibold rounded-full flex gap-[1px]   ${badge.color}`}
              >                {badge.label=== "Verified" ?<BadgeCheck size={14} />:<BadgeX size={14} />}
                {badge.label}
              </span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {user?.email || "No email available"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex w-full gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex-1 py-2 bg-blue-100 flex gap-0.5 items-center justify-center  text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-200 transition"
          >
            <Pencil size={16} /> Edit
          </button>
          <button
            onClick={handleLogout}
            className="flex-1  py-2 flex gap-1 bg-red-50 justify-center items-center text-red-500 rounded-lg text-sm font-bold hover:bg-red-100 transition"
          >
            <LogOut size={16} /> Logout
          </button>
          <button
            onClick={() => setDeleteAccountModal(true)}
            className="flex-1  py-2 flex gap-0.5 justify-center bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200 transition"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>

        {/* Stats Section */}
        <div className="flex w-full gap-7 pt-4 border-t border-gray-200">
          {stats.map(([label, val]) => (
            <div key={label} className="flex-1 text-center">
              <div className="text-xl font-extrabold text-blue-600">{val}</div>
              <div className="text-xs text-gray-400 font-semibold mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
