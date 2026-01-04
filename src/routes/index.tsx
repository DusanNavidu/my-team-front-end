import { lazy, Suspense, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Layout from "../components/layout/LayoutBasic";
import AdminLayout from "../components/layout/LoyoutAdmin";
import LiveScores from "../pages/LiveScores";
import Contact from "../pages/Contact";

const Index = lazy(() => import("../pages"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Home = lazy(() => import("../pages/Home"));
const Event = lazy(() => import("../pages/Event"));
const OrganizerProfile = lazy(() => import("../pages/profile/OrganizerProfile"));
const PlayerProfile = lazy(() => import("../pages/profile/PlayerProfile"));
const VisitProfile = lazy(() => import("../pages/profile/VisitProfileOrganizer"));
const OrganizerRegisterPage = lazy(() => import("../pages/Organizer_register_page"));
const AdminDashBoard = lazy(() => import("../pages/admin_pages/Admin_Dashbord"));
const AdminUsersManage = lazy(() => import("../pages/admin_pages/Admin_Users_Manage"));
const VisitProfilePlayer = lazy(() => import("../pages/profile/VistiProfilePlayer"));
type RequireAuthTypes = { children: ReactNode; roles?: string[] };

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 overflow-hidden relative">
        
        {/* 🌌 Background Glow - පිටුපසින් පෙනෙන නිල් පැහැති ආලෝකය */}
        <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>

        {/* 🌀 Main Animated Loader */}
        <div className="relative flex items-center justify-center">
          {/* පිටත කැරකෙන වළල්ල (Outer Ring) */}
          <div className="w-24 h-24 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
          
          {/* මැද කැරකෙන වළල්ල (Middle Ring - Reverse) */}
          <div className="absolute w-16 h-16 border-r-4 border-l-4 border-blue-400 rounded-full animate-spin-reverse opacity-70"></div>
          
          {/* මැදම ඇති Icon එක හෝ Dot එක */}
          <div className="absolute bg-white w-4 h-4 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-ping"></div>
        </div>

        {/* ✍️ Loading Text */}
        <div className="mt-10 text-center">
          <h2 className="text-white text-2xl font-black italic tracking-[0.3em] uppercase animate-pulse">
            MY <span className="text-blue-500">TEAM</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Synchronizing Arena
            </span>
            <span className="flex gap-1">
                <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></span>
            </span>
          </div>
        </div>

        {/* Tailwind CSS Custom Styles - මෙම කොටස ඔබේ index.css එකට හෝ style tag එකකට එක් කරන්න */}
        <style>{`
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 1.5s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => user.roles?.includes(role))) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 overflow-hidden relative">
            
            {/* 🌌 Background Dynamic Glow */}
            <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>

            {/* 🌀 Main Animated Loader */}
            <div className="relative flex items-center justify-center">
              {/* පිටත කැරකෙන වළල්ල (Outer Ring) */}
              <div className="w-24 h-24 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
              
              {/* මැද කැරකෙන වළල්ල (Middle Ring - Reverse) */}
              <div className="absolute w-16 h-16 border-r-4 border-l-4 border-blue-400 rounded-full animate-spin-reverse opacity-70"></div>
              
              {/* මැදම ඇති Pulse Dot */}
              <div className="absolute bg-white w-4 h-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-ping"></div>
            </div>

            {/* ✍️ Branding & Text */}
            <div className="mt-12 text-center z-10">
              <h2 className="text-white text-3xl font-black italic tracking-[0.3em] uppercase animate-pulse">
                MY <span className="text-blue-500">TEAM</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-2">
                  Synchronizing Arena
                </span>
                <span className="flex gap-1">
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></span>
                </span>
              </div>
            </div>

            {/* Tailwind CSS Custom Styles - මෙය ඔබගේ global CSS file එකට එක් කරන්න හෝ මෙලෙස තබන්න */}
            <style>{`
              @keyframes spin-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              .animate-spin-reverse {
                animation: spin-reverse 1.5s linear infinite;
              }
            `}</style>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organizer/:id" element={<VisitProfile />} />
          <Route path="/player-profile/:id" element={<VisitProfilePlayer />} /> 

          <Route
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route path="/admin/admin-users-manage" element={<AdminUsersManage />} />
          </Route>

          <Route
            element={
              <RequireAuth roles={["ORGANIZER", "PLAYER", "ADMIN", "USER"]}>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/organizer-register" element={<OrganizerRegisterPage />} />
            <Route path="/event" element={<Event />} />
            <Route path="/live-scores" element={<LiveScores />} />
            <Route path="/profile-organizer" element={<OrganizerProfile />} />
            <Route path="/profile-player" element={<PlayerProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
