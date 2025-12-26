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
const Post = lazy(() => import("../pages/Post"));
const Event = lazy(() => import("../pages/Event"));
const OrganizerProfile = lazy(() => import("../pages/profile/OrganizerProfile"));
const PlayerProfile = lazy(() => import("../pages/profile/PlayerProfile"));
const VisitProfile = lazy(() => import("../pages/profile/VisitProfile"));
const OrganizerRegisterPage = lazy(
  () => import("../pages/Organizer_register_page")
);
const AdminDashBoard = lazy(
  () => import("../pages/admin_pages/Admin_Dashbord")
);
const AdminUsersManage = lazy(
  () => import("../pages/admin_pages/Admin_Users_Manage")
);

type RequireAuthTypes = { children: ReactNode; roles?: string[] };

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
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
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/organizer/:id" element={<VisitProfile />} />

          <Route
            element={
              <RequireAuth roles={["ADMIN"]}>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route
              path="/admin/admin-users-manage"
              element={<AdminUsersManage />}
            />
          </Route>

          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/home" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route
              path="/organizer-register"
              element={<OrganizerRegisterPage />}
            />
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
