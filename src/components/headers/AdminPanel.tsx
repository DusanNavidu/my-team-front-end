import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { BiCategory } from "react-icons/bi";
import { TbMessageReport } from "react-icons/tb";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface SidebarContentProps {
  isExpanded: boolean;
  onLinkClick: () => void;
}

export default function AdminPanel() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", path: "/admin/admin-users-manage", icon: Users },
    { name: "Manage Events", path: "/admin/events", icon: Calendar },
    { name: "Categories", path: "/admin/categories", icon: BiCategory },
    { name: "Report", path: "/admin/report", icon: TbMessageReport },
    { name: "View Reports", path: "/admin/reports", icon: ClipboardList },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const sidebarWidthClass = isHovered ? "w-64" : "w-20";

  const SidebarContent: React.FC<SidebarContentProps> = ({
    isExpanded,
    onLinkClick,
  }) => (
    <div className="flex flex-col h-full overflow-hidden">
      <div
        className={`p-5 pt-7 border-b border-slate-700/50 transition-all duration-300 ${
          isExpanded ? "text-left" : "text-center"
        }`}
      >
        <h2
          className={`text-xl font-bold text-sky-400 whitespace-nowrap transition-opacity duration-200 
                    ${isExpanded ? "opacity-100" : "opacity-0"}`}
        >
          ADMIN HUB
        </h2>

        <div
          className={`mt-2 text-sm text-slate-300 transition-opacity duration-200 
                    ${isExpanded ? "opacity-100" : "opacity-0"}`}
        >
          Welcome,{" "}
          <span className="font-semibold text-white">
            {user?.fullname || "Admin"}
          </span>
        </div>

        {!isExpanded && (
          <div className="absolute top-7 left-1/2 transform -translate-x-1/2">
            <LayoutDashboard className="w-8 h-8 text-sky-400" />
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto mt-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-xl py-3 transition-all duration-200 ease-in-out whitespace-nowrap 
                                ${
                                  active
                                    ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                }
                                ${
                                  isExpanded
                                    ? "justify-start px-3"
                                    : "justify-center px-0"
                                } 
                            `}
              onClick={onLinkClick}
            >
              <IconComponent
                className={`w-6 h-6 ${isExpanded ? "mr-3" : ""}`}
              />
              {isExpanded && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center py-3 px-4 rounded-xl font-semibold shadow-md transition-all duration-200 bg-red-600 hover:bg-red-700 text-white
                        ${isExpanded ? "justify-start" : "justify-center"}
                    `}
          title={isExpanded ? "" : "Logout"}
        >
          <LogOut className={`w-6 h-6 ${isExpanded ? "mr-3" : ""}`} />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="fixed top-4 left-4 z-50 sm:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-white bg-slate-800 rounded-full shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`hidden sm:block h-screen fixed top-0 left-0 bg-slate-900 text-white z-40 shadow-2xl 
                    ${sidebarWidthClass} transition-all duration-300 ease-in-out
                `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <SidebarContent
          isExpanded={isHovered}
          onLinkClick={() => setIsHovered(false)}
        />
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-50 shadow-2xl transition-transform duration-300 sm:hidden
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
      >
        <SidebarContent
          isExpanded={true}
          onLinkClick={() => setIsMobileOpen(false)}
        />

        <div className="absolute top-4 right-4 sm:hidden">
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-white bg-slate-800 rounded-full shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="sm:ml-20"></div>
    </React.Fragment>
  );
}
