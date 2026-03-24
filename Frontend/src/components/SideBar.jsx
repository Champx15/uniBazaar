import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext/AuthContext";
import browseIcon from "../icons/browse.svg";
import heartIcon from "../icons/heart.png";
import messageIcon from "../icons/message.png";
import profileIcon from "../icons/profile.svg";
import browseActive from "../icons/browse-active.svg";
import profileActive from "../icons/account-active.svg";
import savedActive from "../icons/saved-active.png";
import messageActive from "../icons/message-active.png";
import logoutIcon from "../icons/logout.png";
import { SellModal } from "./SellModal";
import IdentityVerificationModal from "./IdentityVerificationModal";
import VerificationStatusModal from "./VerificationStatusModal";
import { LogIn } from "lucide-react";

function SideBar({ setToast }) {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [identityVerificationOpen, setIdentityVerificationOpen] =
    useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const navItems = [
    {
      key: "explore",
      path: "/explore",
      label: "Explore",
      icon: { active: browseActive, inactive: browseIcon },
    },
    {
      key: "messages",
      path: "/messages",
      label: "Messages",
      icon: { active: messageActive, inactive: messageIcon },
    },
    {
      key: "saved",
      path: "/saved",
      label: "Saved",
      icon: { active: savedActive, inactive: heartIcon },
    },
    {
      key: "profile",
      path: "/profile",
      label: "Profile",
      icon: { active: profileActive, inactive: profileIcon },
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mobile Bottom Navigation Bar
  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 h-15 bg-white border-t border-gray-200 px-5 py-2 flex justify-around items-center z-50 md:hidden">
      {navItems.slice(0, 2).map(({ key, icon, path }) => (
        <NavLink key={key} to={path}>
          {({ isActive }) => (
            <img
              src={isActive ? icon.active : icon.inactive}
              alt={key}
              className="w-7 h-7"
            />
          )}
        </NavLink>
      ))}

      <button
        onClick={() =>
          user?.status === "ACTIVE"
            ? setIsSellModalOpen(true)
            : setIdentityVerificationOpen(true)
        }
        className="w-14 h-14 text-3xl font-bold rounded-full bg-blue-600 text-white flex items-center justify-center -mt-7 shadow-xl font-serif"
      >
        +
      </button>

      {navItems.slice(2).map(({ key, icon, path }) => (
        <NavLink key={key} to={path}>
          {({ isActive }) => (
            <img
              src={isActive ? icon.active : icon.inactive}
              alt={key}
              className="w-7 h-7"
            />
          )}
        </NavLink>
      ))}
    </div>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-58 bg-white border-r border-gray-200 flex-col p-7 pb-3   z-40 text-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          uni<span className="text-blue-600">Bazaar</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ key, icon, label, path }) => (
          <NavLink
            key={key}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <img
                  src={isActive ? icon.active : icon.inactive}
                  alt={key}
                  className="w-6 h-6"
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => {
          if(user){
            if (user?.status !== "ACTIVE") {
              if (user?.idCard?.status) {
                setVerificationStatus(user?.idCard?.status);
                setShowVerificationModal(true);
              } else setIdentityVerificationOpen(true);
            } else setIsSellModalOpen(true);
          }
          setToast({ message: "Please log in to list items", type: "info" });
        }}
        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-3 rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
      >
        Sell Something
      </button>

      {loading ? (
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gray-200/70 animate-pulseflex-shrink-0" />
            <div className="flex flex-col gap-1">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-3  border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            {user?.pfImageUrl ? (
              <div className="w-10 h-10 rounded-full flex items-center border-black border-2 justify-center font-bold text-sm flex-shrink-0">
                <img
                  src={user.pfImageUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {((user?.name || "Hamdardian") ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate text-lg">
                {user?.name || "Hamdardian"}
              </p>
              <p className={`${user?.email?"text-xs":"text-sm"} text-gray-500 truncate`}>
                {user?.email || "Visitor"}
              </p>
            </div>

            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0  "
                title="Logout"
              >
                <img src={logoutIcon} alt="Logout" className="w-6.5 h-6.5 " />
              </button>
            )}
            {
              !user && (
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="cursor-pointer"
                >
                  <LogIn size={27} />
                </button>
              )
            }
          </div>
        </div>
      )}
    </aside>
  );

  // RENDER MODAL ONCE HERE, NOT INSIDE THE NESTED COMPONENTS
  return (
    <>
      <DesktopSidebar />
      <MobileNav />
      <SellModal
        open={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        setToast={setToast}
      />
      <IdentityVerificationModal
        isOpen={identityVerificationOpen}
        onClose={() => setIdentityVerificationOpen(false)}
        actionType="create listing"
        userEnrollmentNo={user?.hasEnrollment}
      />
      <VerificationStatusModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        cardStatus={verificationStatus}
        actionType="create listing"
      />
    </>
  );
}

export default SideBar;
