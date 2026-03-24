import { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  FileText,
  AlertCircle,
  Shield,
  Trash2,
  CheckCircle,
  Clock,
  X,
  TrendingUp,
  AlertTriangle,
  Ban,
  Mail, CheckCircle2, XCircle
} from "lucide-react";
import adminService from "../service/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalListings: 0,
    pendingReports: 0,
    pendingVerifications: 0,
  });

  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [idCards, setIdCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [error, setError] = useState("");
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, listingsRes, reportsRes, idCardsRes, usersRes] =
        await Promise.all([
          adminService.getStats(),
          adminService.getListings(),
          adminService.getReports(),
          adminService.getIdCards(),
          adminService.getUsers(),
        ]);

      setStats(statsRes);
      setListings(listingsRes);
      setReports(reportsRes);
      setIdCards(idCardsRes);
      setUsers(usersRes);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId) => {
    try {
      const res = await adminService.banUser(userId);
      setUsers(
        users.map((u) => (u.user.id === userId ? { ...u, user: { ...u.user, status: "BANNED" } } : u)),
      );
    } catch (err) {
      setError("Failed to ban user");
    }
  };

const unBanUser = async (userId) => {
  try {
    const res = await adminService.unBanUser(userId);
    setUsers(
      users.map((u) =>
        u.user.id === userId
          ? {
              ...u,
              user: {
                ...u.user,
                status:
                  u.user.hasEnrollment && u.user.idCard?.status === "VERIFIED"
                    ? "ACTIVE"
                    : "UNVERIFIED",
              },
            }
          : u,
      ),
    );
  } catch (err) {
    setError("Failed to unban user");
  }
};

const blockListing = async (listingId) => {
  try {
    const res = await adminService.blockListing(listingId);
    if (res.ok) {
      setListings(
        listings.map((l) =>
          l.listing.id === listingId 
            ? { ...l, listing: { ...l.listing, status: "BLOCKED" } } 
            : l,
        ),
      );
    }
  } catch (err) {
    setError("Failed to block listing");
  }
};

const resolveReport = async (reportId, resolution, type, id) => {
  try {
    const res = await adminService.resolveReport(
      reportId,
      resolution,
      type,
      id,
    );
    if (res.ok) {
      setReports(reports.filter((r) => r.id !== reportId)); // This one is fine
    }
  } catch (err) {
    setError("Failed to resolve report");
  }
};

  const approveIdCard = async (cardId) => {
    try {
      const res = await adminService.verifyIdCard(cardId, "approve");
      if (res.ok) {
        setIdCards(idCards.filter((c) => c.id !== cardId));
      }
    } catch (err) {
      setError("Failed to approve ID card");
    }
  };

  const rejectIdCard = async (cardId) => {
    try {
        const res = await adminService.verifyIdCard(cardId, "reject");
      if (res.ok) {
        setIdCards(idCards.filter((c) => c.id !== cardId));
      }
    } catch (err) {
      setError("Failed to reject ID card");
    }
  };

  const acceptAppeal = async (email) => {
  try {
    await adminService.resolveAppeal(email, "accept");
  } catch (err) {
    setError("Failed to accept appeal");
  }
};

const rejectAppeal = async (email) => {
  try {
    await adminService.resolveAppeal(email, "reject");
  } catch (err) {
    setError("Failed to reject appeal");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="py-60 px-5 text-center text-base text-indigo-600">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="  p-3 md:p-5 flex justify-center items-center">
        <div className="flex-1">
          <h1 className="m-0 text-4xl md:text-5xl font-bold text-black text-center">
            Admin Dashboard
          </h1>
          <p className="mt-2 mb-0 text-sm md:text-lg opacity-90 text-black text-center">
            Manage users, listings, reports, and verifications
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-900 p-4 m-5 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto bg-transparent border-none text-2xl cursor-pointer text-inherit"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-5 p-5 max-w-7xl mx-auto">
        <StatCard
          icon={<Users size={32} />}
          label="Total Users"
          value={stats?.totalUsers}
          color="#3b82f6"
        />
        <StatCard
          icon={<Users size={32} />}
          label="Active Users"
          value={stats?.activeUsers}
          color="#10b981"
        />
        <StatCard
          icon={<FileText size={32} />}
          label="Total Listings"
          value={stats?.totalListings}
          color="#f59e0b"
        />
        <StatCard
          icon={<AlertCircle size={32} />}
          label="Pending Reports"
          value={stats?.pendingReports}
          color="#ef4444"
        />
        <StatCard
          icon={<Shield size={32} />}
          label="Pending Verifications"
          value={stats?.pendingVerifications}
          color="#8b5cf6"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-slate-200 p-0 px-5 max-w-7xl mx-auto overflow-auto ">
        <button
          className={`px-6 py-4 border-none bg-transparent cursor-pointer text-sm font-medium border-b-2 transition-all ${
            activeTab === "users"
              ? "text-indigo-500 border-b-indigo-500"
              : "text-slate-500 border-b-transparent"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users ({stats?.totalUsers})
        </button>
        <button
          className={`px-6 py-4 border-none bg-transparent cursor-pointer text-sm font-medium border-b-2 transition-all ${
            activeTab === "listings"
              ? "text-indigo-500 border-b-indigo-500"
              : "text-slate-500 border-b-transparent"
          }`}
          onClick={() => setActiveTab("listings")}
        >
          Listings ({listings.length})
        </button>
        <button
          className={`px-6 py-4 border-none bg-transparent cursor-pointer text-sm font-medium border-b-2 transition-all ${
            activeTab === "reports"
              ? "text-indigo-500 border-b-indigo-500"
              : "text-slate-500 border-b-transparent"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          Reports ({reports.length})
        </button>
        <button
          className={`px-6 py-4 border-none bg-transparent cursor-pointer text-sm font-medium border-b-2 transition-all ${
            activeTab === "idcards"
              ? "text-indigo-500 border-b-indigo-500"
              : "text-slate-500 border-b-transparent"
          }`}
          onClick={() => setActiveTab("idcards")}
        >
          ID Cards ({idCards.length})
        </button>
        <button
          className={`px-6 py-4 border-none bg-transparent cursor-pointer text-sm font-medium border-b-2 transition-all ${
            activeTab === "appeal"
              ? "text-indigo-500 border-b-indigo-500"
              : "text-slate-500 border-b-transparent"
          }`}
          onClick={() => setActiveTab("appeal")}
        >
          Appeals
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="m-3 md:m-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-5">All Users</h2>
          {stats?.totalUsers === 0 ? (
            <div className="py-60 px-5 text-center text-slate-400 text-base">
              No users found
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-x-auto shadow md:overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Name
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Email
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Verification
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Enrollment
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Listings
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Joined
                    </th>
                    <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user.user.id}
                        className="border-b border-slate-200 transition-colors hover:bg-slate-50"
                      >
                        {/* User Name with Avatar */}
                        <td className="p-4 text-sm text-slate-700 font-medium">
                          <div className="flex items-center gap-3">
                            {user.user.pfImageUrl ? (
                              <img
                                src={user.user.pfImageUrl}
                                alt={user.user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                                {user.user.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {user.user.name}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4 text-sm text-slate-700">
                          {user.user.email}
                        </td>

                        {/* Account Status */}
                        <td className="p-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1.5 rounded text-xs font-semibold ${
                              user.user.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-900"
                                : user.user.status === "BANNED"
                                  ? "bg-red-100 text-red-900"
                                  : user.user.status === "UNVERIFIED"
                                    ? "bg-yellow-100 text-yellow-900"
                                    : "bg-slate-100 text-slate-900"
                            }`}
                          >
                            {user.user.status}
                          </span>
                        </td>

                        {/* ID Card Verification */}
                        <td className="p-4 text-sm">
                          {user.user.idCard ? (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold ${
                                user.user.idCard.status === "VERIFIED"
                                  ? "bg-blue-100 text-blue-900"
                                  : user.user.idCard.status === "PENDING"
                                    ? "bg-orange-100 text-orange-900"
                                    : "bg-red-100 text-red-900"
                              }`}
                            >
                              {user.user.idCard.status === "VERIFIED" && (
                                <CheckCircle size={14} />
                              )}
                              {user.user.idCard.status === "PENDING" && (
                                <Clock size={14} />
                              )}
                              {user.user.idCard.status === "REJECTED" && (
                                <AlertTriangle size={14} />
                              )}
                              {user.user.idCard.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                              <AlertCircle size={14} /> Not Submitted
                            </span>
                          )}
                        </td>

                        {/* Enrollment Status */}
                        <td className="p-4 text-sm">
                          {user.user.hasEnrollment ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-green-100 text-green-900">
                              <CheckCircle size={14} /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                              <X size={14} /> No
                            </span>
                          )}
                        </td>

                        {/* Active Listings Count */}
                        <td className="p-4 text-sm">
                          <span className="inline-flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded text-indigo-700 font-semibold text-xs">
                            <FileText size={14} /> {user.listingsLength || 0}
                          </span>
                        </td>

                        {/* Join Date */}
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(user.user.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-sm">
                          <div className="flex gap-2">
                            {(user.user.status === "ACTIVE" ||
                              user.user.status === "UNVERIFIED") && (
                              <button
                                className="px-2.5 py-1.5 bg-red-100 text-red-900 border-none rounded cursor-pointer text-xs md:text-sm font-semibold transition-all hover:bg-red-200 flex items-center gap-1"
                                title="Ban user account"
                                onClick={() => banUser(user.user.id)}
                              >
                                <Ban size={17} /> Ban
                              </button>
                            )}
                            {user.user.status === "BANNED" && (
                              <button
                                className="px-2.5 py-1.5 bg-green-100 text-green-900 border-none rounded cursor-pointer text-xs md:text-sm font-semibold transition-all hover:bg-green-200"
                                title="Reactivate user account"
                                onClick={() => unBanUser(user.user.id)}
                              >
                                UnBan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="p-8 text-center text-slate-400"
                      >
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <div className="m-3 md:m-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-5">
            All Listings
          </h2>
          <div className="bg-white rounded-xl overflow-scroll shadow md:overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                    Title
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                    User
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                    Price
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-slate-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr
                    key={listing.listing.id}
                    className="border-b border-slate-200 transition-colors hover:bg-slate-50"
                  >
                    <td className="p-4 text-sm text-slate-700">
                      {listing.listing.title}
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      {listing.userEmail}
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      <span
                        className={`inline-block px-3 py-1.5 rounded text-xs font-semibold ${
                          listing.listing.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-900"
                            : listing.listing.status === "BLOCKED"
                              ? "bg-red-100 text-red-900"
                              : listing.listing.status === "DELETED"
                                ? "bg-gray-100 text-gray-900"
                                : "bg-purple-100 text-purple-900"
                        }`}
                      >
                        {listing.listing.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      ₹{listing.listing.price}
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      {listing.listing.status !== "BLOCKED" &&
                        listing.listing.status !== "DELETED" && (
                          <button
                            onClick={() => blockListing(listing.listing.id)}
                            className="px-3 py-2 bg-red-100 text-red-900 border-none rounded cursor-pointer text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-red-200"
                          >
                            <Trash2 size={16} /> Block
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="m-3 md:m-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-5">
            Pending Reports
          </h2>
          {reports.length === 0 ? (
            <div className="py-60 px-5 text-center text-slate-400 text-base">
              No pending reports
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map((report) => (
                <div key={report.id} className="bg-white p-4 rounded-xl shadow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-indigo-500 uppercase">
                      {report.reportedUserId ? "User Report" : "Listing Report"}
                    </span>
                    <span className="text-xs font-semibold bg-red-100 text-red-900 px-2 py-1 rounded">
                      {report.reason}
                    </span>
                  </div>
                  <p className=" text-sm mb-1  text-slate-600 leading-relaxed">
                    Reporter Id: {report.reporterId}
                  </p>
                  <div className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {report.reportedUserId ? (
                        <>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-slate-700">
                              User ID:
                            </span>
                            <span className="ml-2 text-slate-600 font-mono">
                              {report.reportedUserId}
                            </span>
                          </p>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-slate-700">
                              Email:
                            </span>
                            <span className="ml-2 text-slate-600 ">
                              {report.reportedUserEmail}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-slate-700">
                              Listing ID:
                            </span>
                            <span className="ml-2 text-slate-600 font-mono">
                              {report.reportedListing?.id}
                            </span>
                          </p>
                          <p className="text-sm mb-2">
                            <span className="font-semibold text-slate-700">
                              Title:
                            </span>
                            <span className="ml-2 text-slate-600">
                              {report.reportedListing?.title}
                            </span>
                          </p>
                          {report.reportedListing.description && (
                            <p className="text-sm mb-2">
                              <span className="font-semibold text-slate-700">
                                Description:
                              </span>
                              <span className="ml-2 text-slate-600">
                                {report.reportedListing?.description}
                              </span>
                            </p>
                          )}
                          <p className="text-sm">
                            <span className="font-semibold text-slate-700">
                              Price:
                            </span>
                            <span className="ml-2 text-slate-600 font-semibold">
                              ₹{report.reportedListing?.price}
                            </span>
                          </p>
                        </>
                      )}
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                        Description
                      </p>
                      <p className="text-sm mb-2 text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {report.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() =>
                        resolveReport(report.id, "REJECTED", null, null)
                      }
                      className="flex-1 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 rounded cursor-pointer font-semibold transition-all hover:bg-slate-100"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() =>
                        resolveReport(
                          report.id,
                          "RESOLVED",
                          report.reportedUserId ? "user" : "listing",
                          report.reportedUserId || report.reportedListing?.id,
                        )
                      }
                      className="flex-1 py-2.5 bg-indigo-500 text-white border-none rounded cursor-pointer font-semibold transition-all hover:bg-indigo-600"
                    >
                      Take Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ID Cards Tab */}
      {activeTab === "idcards" && (
        <div className="m-3 md:m-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-5">
            Pending ID Card Verifications
          </h2>
          {idCards.length === 0 ? (
            <div className="py-60 px-5 text-center text-slate-400 text-base">
              No pending verifications
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {idCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white rounded-xl overflow-hidden shadow"
                >
                  <div className="p-5 bg-slate-50 border-b border-slate-200">
                    <h3 className="m-0 text-base font-bold text-slate-900">
                      {card.name}
                    </h3>
                    <span className="text-xs text-slate-500">
                      {card.email}
                    </span>
                  </div>
                  {card.idCardUrl && (
                    <img
                      src={card.idCardUrl}
                      alt="ID Card"
                      className="w-full h-64 object-contain"
                    />
                  )}
                  <div className="p-4 border-b border-slate-200">
                    <p className="text-sm">
                      <strong>Enrollment:</strong>{" "}
                      {card.enrollment || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Submitted:</strong>{" "}
                      {new Date(card.submitted).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-3 p-4">
                    <button
                      onClick={() => rejectIdCard(card.id)}
                      className="flex-1 py-2.5 bg-red-100 text-red-900 border-none rounded cursor-pointer font-semibold flex items-center justify-center gap-1.5 transition-all hover:bg-red-200"
                    >
                      <X size={16} /> Reject
                    </button>
                    <button
                      onClick={() => approveIdCard(card.id)}
                      className="flex-1 py-2.5 bg-emerald-100 text-emerald-900 border-none rounded cursor-pointer font-semibold flex items-center justify-center gap-1.5 transition-all hover:bg-emerald-200"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


{activeTab === "appeal" && (
  <div className="m-3 md:m-10">
    <h2 className="text-3xl font-bold text-slate-900 mb-5">
      Appeals
    </h2>

  <div className="flex items-center justify-center">
    <AppealForm 
      onAccept={acceptAppeal}
      onReject={rejectAppeal}
    />
  </div>
  </div>
)}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="bg-white p-5 rounded-xl shadow border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex gap-4">
        <div className="text-3xl flex items-center" style={{ color }}>
          {icon}
        </div>
        <div className="flex-1 items-center ">
          <p className="m-0 text-xs text-slate-500 uppercase font-semibold">
            {label}
          </p>
          <p className="mt-2 mb-0 text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AppealForm({ onAccept, onReject }) {
  const [email, setEmail] = useState("");

  const handleAccept = () => {
    if (!email) return;
    onAccept(email);
    setEmail("");
  };

  const handleReject = () => {
    if (!email) return;
    onReject(email);
    setEmail("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl w-5xl">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="text-indigo-500" size={22} />
        <h3 className="text-lg font-semibold text-slate-900">
          Review Appeal
        </h3>
      </div>

      <label className="text-sm font-medium text-slate-600">
        User Email
      </label>

      <div className="mt-2 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
        <Mail size={18} className="text-slate-400" />
        <input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handleReject}
          className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-900 py-2.5 rounded-lg font-semibold hover:bg-red-200 transition"
        >
          <XCircle size={18} />
          Reject Appeal
        </button>

        <button
          onClick={handleAccept}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-100 text-emerald-900 py-2.5 rounded-lg font-semibold hover:bg-emerald-200 transition"
        >
          <CheckCircle2 size={18} />
          Accept Appeal
        </button>
      </div>
    </div>
  );
}