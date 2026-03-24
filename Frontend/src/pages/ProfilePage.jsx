import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext/AuthContext.js";
import { useListing } from "../context/ListingContext/ListingContext.js";
import {
  Toast,
  Modal,
  FormField,
  Input,
  PrimaryButton,
} from "../components/UI.jsx";
import { ConfirmModal } from "../components/ConfirmModal.jsx";
import { EditListingModal } from "../components/EditListingModal.jsx";
import MobileHeader from "../components/MobileHeader.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import MyListingsSection from "../components/MyListingsSection.jsx";
import { useUser } from "../context/UserContext/UserContext.js";
import { UserRound,Activity, Layers, Handshake } from "lucide-react";
import FeedbackIcon from "../icons/feedback.png";
import FeedbackModal from "../components/FeedbackModal.jsx";
import Note from "../components/Note.jsx"
export default function ProfilePage({ isMobile }) {
  const { user, logout } = useAuth();
  const { editUser, deleteUser } = useUser();
  const {
    loading,
    deleteListing,
    userListings,
    refreshUserListings,
    updateListingAvailability,
  } = useListing();
  const navigate = useNavigate();

  useEffect(() => {
    refreshUserListings();
  }, []);

  // Mock data for development
  // const mockListings = [
  //   {
  //     id: "1",
  //     title: "Vintage Desk Lamp",
  //     price: 950,
  //     description: "Barely used desk lamp, perfect condition",
  //     imageUrls: [
  //       "https://i5.walmartimages.com/asr/7438eead-bf94-443a-8fc7-e0835f4d35e5_1.cc1d2f8bf91a0a39c5f9d20ba43d2b17.jpeg",
  //     ],
  //     available: true,
  //     tags: ["Electronics"],
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     user: { id: "test_user", name: "Test User", email: "test@example.com" },
  //   },
  //   {
  //     id: "2",
  //     title: "Programming Books Bundle",
  //     price: 1200,
  //     description: "Clean Code, Design Patterns, and more",
  //     imageUrls: [
  //       "https://i5.walmartimages.com/asr/7438eead-bf94-443a-8fc7-e0835f4d35e5_1.cc1d2f8bf91a0a39c5f9d20ba43d2b17.jpeg",
  //     ],
  //     available: true,
  //     tags: ["Books"],
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     user: { id: "test_user", name: "Test User", email: "test@example.com" },
  //   },
  //   {
  //     id: "3",
  //     title: "Football Shoes",
  //     price: 2500,
  //     description: "Nike football shoes, size 9, unused",
  //     imageUrls: [
  //       "https://i5.walmartimages.com/asr/7438eead-bf94-443a-8fc7-e0835f4d35e5_1.cc1d2f8bf91a0a39c5f9d20ba43d2b17.jpeg",
  //     ],
  //     available: true,
  //     tags: ["Sports", "asdfasd", "asdasdf"],
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     user: { id: "test_user", name: "Test User", email: "test@example.com" },
  //   },
  // ];

  // Use mock data if listings are empty (development)
  // const displayListings = userListings.length > 0 ? userListings : mockListings;
  const displayListings = userListings;

  // State for all modals and forms
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name ?? "",
    pfImageFile: null,
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [deleteListingModal, setDeleteListingModal] = useState(null);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openNote, setOpenNote] = useState(false);

  const activeCnt = displayListings.filter(
    (listing) => listing.status === "ACTIVE",
  ).length;
  const soldCnt = displayListings.length - activeCnt;
  const stats = [
    ["Total", displayListings.length,Layers,"text-blue-600","bg-blue-50"],
    ["Active", activeCnt,Activity,"text-emerald-600","bg-emerald-50"],
    ["Sold", soldCnt,Handshake,"text-amber-600","bg-amber-100"],
  ];

  // Profile edit handlers
  const handleSaveProfile = async () => {
    // Validate name
    if (!editForm.name.trim()) {
      setToast({ message: "Name is required", type: "error" });
      return;
    }
    if (editForm.name.trim().length < 2) {
      setToast({
        message: "Name must be at least 2 characters",
        type: "error",
      });
      return;
    }
    if (editForm.name.trim().length > 100) {
      setToast({
        message: "Name must be less than 100 characters",
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = { name: editForm.name.trim() };
      if (editForm.pfImageFile) {
        payload.pfImage = editForm.pfImageFile;
      }
      await editUser(payload);
      setEditOpen(false);
      setToast({ message: "Profile updated!", type: "success" });
    } catch (e) {
      setToast({ message: e.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // Listing handlers
  const handleEditListing = (listing) => {
    setEditingListing(listing);
  };

  const handleDeleteListingClick = (listingId) => {
    setDeleteListingModal(listingId);
  };

  const handleConfirmDeleteListing = async () => {
    if (!deleteListingModal) return;

    const res = await deleteListing(deleteListingModal);

    if (!res.success) {
      setToast({ message: res.error, type: "error" });
    } else {
      setToast({ message: "Listing deleted", type: "success" });
    }

    setDeleteListingModal(null);
  };

  const handleToggleAvailable = async (listing) => {
    const res = await updateListingAvailability(
      listing.id,
      // !listing.available
      listing.status === "ACTIVE" ? "SOLD" : "ACTIVE",
    );

    if (!res.success) {
      setToast({ message: res.error, type: "error" });
    }
  };

  // Account deletion handler
  const handleConfirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      setDeleteAccountModal(false);
      await deleteUser();
      logout();
      navigate("/login");
    } catch (e) {
      setToast({ message: e.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const listingsSection = (
    <MyListingsSection
      listings={displayListings}
      loading={loading}
      onEdit={handleEditListing}
      onDelete={handleDeleteListingClick}
      onToggle={handleToggleAvailable}
      isMobile={isMobile}
    />
  );

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen pb-20">
        <div className="flex-1 overflow-y-auto">
          <MobileHeader title="👤Profile" />
          
<button 
  onClick={() => setOpenNote(true)}
  className="fixed bottom-24 right-6 w-11 h-11 flex items-center justify-center 
             bg-red-100 rounded-full text-2xl shadow-2xl  border-white  text-center
             animate-float z-50 opacity-72 hover:scale-110 transition-all animate-float"
             style={{ animationDelay: `${Math.random() * 2}s` }}
>

  💝
</button>
<Note isOpen={openNote} onClose={() => setOpenNote(false)} />       
     <div className="px-4 pt-4">
            <ProfileCard
              listings={displayListings}
              setEditOpen={setEditOpen}
              setDeleteAccountModal={setDeleteAccountModal}
            />
          </div>

          <div className="px-4 pt-4 pb-4">{listingsSection}</div>
        </div>

        {/* All Modals - Must be outside scroll container */}
        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit Profile"
        >
          <FormField label="Full Name">
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value,
                })
              }
              placeholder="Your name"
            />
          </FormField>

          <FormField label="Profile Picture">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setEditForm({
                    ...editForm,
                    pfImageFile: file,
                  });
                }
              }}
            />
          </FormField>

          {editForm.pfImageFile && (
            <img
              src={URL.createObjectURL(editForm.pfImageFile)}
              alt="preview"
              className="w-20 h-20 rounded-full object-cover border border-gray-200 mt-3"
            />
          )}

          <PrimaryButton onClick={handleSaveProfile} loading={saving} fullWidth>
            Save Changes
          </PrimaryButton>
        </Modal>

        {editingListing && (
          <EditListingModal
            open={!!editingListing}
            onClose={() => setEditingListing(null)}
            listing={editingListing}
            onUpdated={(updated) => {
              setEditingListing(null);
              setToast({
                message: "Listing updated!",
                type: "success",
              });
              refreshUserListings();
            }}
          />
        )}

        <ConfirmModal
          open={!!deleteListingModal}
          title="Delete Listing?"
          message="This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleConfirmDeleteListing}
          onCancel={() => setDeleteListingModal(null)}
          loading={deleting}
        />

        <ConfirmModal
          open={deleteAccountModal}
          title="Delete Account?"
          message="All your data will be permanently removed."
          confirmText="Delete My Account"
          onConfirm={handleConfirmDeleteAccount}
          onCancel={() => setDeleteAccountModal(false)}
          loading={deleting}
        />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex min-h-screen ">
      <main className="flex-1 px-5 mt-6 overflow-y-auto">
        <div className="text-[1.45rem] font-extrabold text-gray-900 mb-6 ">
          <span className="text-[1.42rem]">👤</span> My Profile
        </div>

        <div className="grid grid-cols-[480px_1fr] gap-2 items-start">
          {/* Sidebar */}
          <div className="flex flex-col  gap-2">
            <div>
              <ProfileCard
                listings={displayListings}
                setEditOpen={setEditOpen}
                setDeleteAccountModal={setDeleteAccountModal}
              />
            </div>
            <div className="bg-white rounded-2xl w-[calc(100%-0px)] h-fit p-4 border border-gray-200 text-lg font-extrabold text-gray-900">
              Stats
              <div className="flex gap-8 pt-2 border-t-2 mt-1  border-gray-200">
                {stats.map(([label, val, Icon, textColor, bg]) => (
                  <div key={label} className="flex items-center gap-3 bg-white p-3 rounded-3xl shadow-sm border border-gray-100">
                    <div className={`p-3 ${bg}  rounded-2xl`}>
                      <Icon size={20}  className={textColor}/>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-xl font-bold text-gray-900">{val}</p>
                    </div>
                  </div>  
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3 pl-4 pb-2 border border-dashed border-gray-400 opacity-77 h-full border-gray-200 text-lg font-medium text-gray-900 flex flex-col">
              <span >Note from Developer 💝</span>
              <button
                className=" absolute bottom-53 right-175 opacity-80 cursor-pointer"
                onClick={() => setOpenFeedbackModal(true)}
                title="Got Feedback?"
              >
                <img src={FeedbackIcon} className="w-7 h-7" />
              </button>

              <div className="font-dancing text-[1.24rem] font-extrabold mt-2 leading-relaxed ml-3  ">
                <p>Built this while figuring things out.</p>

                <p>
                  Not perfect, but I wanted something useful for our campus.
                </p>

                <p>If you’re using it, that means a lot.</p>

                <p>Find a bug? Congrats, you’re a tester :)</p>
              </div>
              <span className="font-dancing text-[1.24rem] text-right font-extrabold mr-5">
                — a fellow builder
              </span>
            </div>
          </div>
              {openFeedbackModal && (
                <FeedbackModal
                  isOpen={openFeedbackModal}
                  onClose={() => setOpenFeedbackModal(false)}
                />
              )}

          {/* Listings */}
          {listingsSection}
        </div>

        {/* All Modals */}
        <Modal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          title="Edit Profile"
        >
          <FormField label="Full Name">
            <Input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value,
                })
              }
              maxLength="100"
              placeholder="Your name"
            />
          </FormField>

          <FormField label="Profile Picture">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setEditForm({
                    ...editForm,
                    pfImageFile: file,
                  });
                }
              }}
            />
          </FormField>

          {editForm.pfImageFile && (
            <img
              src={URL.createObjectURL(editForm.pfImageFile)}
              alt="preview"
              className="w-20 h-20 rounded-full object-cover border border-gray-200 mt-3"
            />
          )}

          <PrimaryButton onClick={handleSaveProfile} loading={saving} fullWidth>
            Save Changes
          </PrimaryButton>
        </Modal>

        {editingListing && (
          <EditListingModal
            open={!!editingListing}
            onClose={() => setEditingListing(null)}
            listing={editingListing}
            onUpdated={(updated) => {
              setEditingListing(null);
              setToast({
                message: "Listing updated!",
                type: "success",
              });
              refreshUserListings();
            }}
          />
        )}

        <ConfirmModal
          open={!!deleteListingModal}
          title="Delete Listing?"
          message="This action cannot be undone."
          confirmText="Delete"
          onConfirm={handleConfirmDeleteListing}
          onCancel={() => setDeleteListingModal(null)}
          loading={deleting}
        />

        <ConfirmModal
          open={deleteAccountModal}
          title="Delete Account?"
          message="All your data will be permanently removed."
          confirmText="Delete My Account"
          onConfirm={handleConfirmDeleteAccount}
          onCancel={() => setDeleteAccountModal(false)}
          loading={deleting}
        />

        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </main>
    </div>
  );
}
