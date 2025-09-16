import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  HelpCircle,
  Ticket,
  Settings,
  Menu,
  X,
  ChevronRight,
  User,
  ChevronLeft,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import SidebarUserNav from "../dashboard/helper/SidebarUserNav";
import logo from "../../assets/logoR.png";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [collapsed, setCollapsed] = useState(false);
  const sidebarRef = useRef(null);

  // Screen size breakpoints
  const breakpoints = {
    xs: 480, // Extra small devices
    sm: 640, // Small devices
    md: 768, // Medium devices
    lg: 1024, // Large devices
    xl: 1280, // Extra large devices
    xxl: 1536, // 2X large devices
  };

  // Return early if no token
  if (!token) {
    return null;
  }

  const decodedToken = jwtDecode(token);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      // Auto-collapse sidebar on small screens
      if (width < breakpoints.lg) {
        setCollapsed(false);
      }

      // Auto-close sidebar on very small screens when resizing
      if (width < breakpoints.sm && isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, breakpoints.lg, breakpoints.sm]);

  // Route mapping
  const routeMap = {
    Dashboard: "/admin/dashboard",
    "Manage FAQs": "/admin/faqs",
    "Manage Tickets": "/admin/tickets",
    Settings: "/admin/settings",
  };

  // Get active item from URL
  const getActiveItemFromPath = () => {
    const currentPath = location.pathname;
    const found = Object.entries(routeMap).find(([, path]) =>
      currentPath.startsWith(path)
    );
    return found ? found[0] : "Dashboard";
  };

  const [activeItem, setActiveItem] = useState(getActiveItemFromPath);

  useEffect(() => {
    setActiveItem(getActiveItemFromPath());
  }, [location.pathname]);

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    const path = routeMap[itemName];
    if (path) {
      navigate(path);
      if (windowWidth < breakpoints.lg) {
        toggleSidebar();
      }
    }
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      section: "ADMIN",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          color: "from-blue-500 to-cyan-500",
          bgAccent: "bg-gradient-to-r from-blue-50 to-cyan-50",
          badge: null,
        },
        {
          name: "Manage FAQs",
          icon: HelpCircle,
          color: "from-emerald-500 to-green-500",
          bgAccent: "bg-gradient-to-r from-emerald-50 to-green-50",
          badge: null,
        },
        {
          name: "Manage Tickets",
          icon: Ticket,
          color: "from-purple-500 to-violet-500",
          bgAccent: "bg-gradient-to-r from-purple-50 to-violet-50",
          badge: null,
        },
        {
          name: "Settings",
          icon: Settings,
          color: "from-yellow-500 to-amber-500",
          bgAccent: "bg-gradient-to-r from-yellow-50 to-amber-50",
          badge: null,
        },
      ],
    },
  ];

  const MobileNavbar = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md flex items-center justify-between px-4 py-3">
      <div className="flex items-center spcae-y-1">
        {/* <LayoutDashboard className="h-6 w-6 text-blue-600" /> */}
        <img src={logo} className="h-10 w-8" alt="" />

        <span className="font-bold pt-2 text-gray-900">Recallr-Admin </span>
      </div>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu size={24} className="text-gray-700" />
      </button>
    </div>
  );

  // Determine sidebar width based on screen size and state
  const getSidebarWidth = () => {
    if (windowWidth < breakpoints.lg) {
      return "w-72"; // Full sidebar on mobile
    }
    return collapsed ? "w-20" : "w-72"; // Collapsed or expanded on desktop
  };

  // Mobile overlay
  const MobileOverlay = () => (
    <AnimatePresence>
      {isOpen && windowWidth < breakpoints.lg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </AnimatePresence>
  );
  // Desktop sidebar component
  const DesktopSidebar = () => (
    <motion.div
      ref={sidebarRef}
      initial={false}
      animate={{ width: collapsed ? 80 : 288 }}
      className="hidden lg:flex fixed top-0 left-0 h-screen 
      bg-gradient-to-br from-slate-50 to-blue-50/30 border-r border-gray-200/60 
      flex-col overflow-y-auto z-10
      dark:from-gray-900 dark:to-gray-800 dark:border-gray-700"
    >
      {/* Header */}
      <div className="p-4 relative z-10 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800">
                <img src={logo} className="h-10 w-8" alt="" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Recallr Admin
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Administration Portal
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800 mx-auto">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-gray-700 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              size={16}
              className={`text-gray-500 dark:text-gray-400 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!collapsed && (
              <div className="flex items-center space-x-2 px-3 mb-3">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.section}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
              </div>
            )}

            <nav className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isActive = activeItem === item.name;
                const isHovered = hoveredItem === item.name;

                return (
                  <button
                    key={itemIndex}
                    onClick={() => handleItemClick(item.name)}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`relative w-full group transition-all duration-300 ease-out ${
                      isActive ? "scale-102" : isHovered ? "scale-101" : ""
                    }`}
                    aria-label={item.name}
                  >
                    <div
                      className={`flex items-center ${
                        collapsed
                          ? "justify-center px-3 py-3"
                          : "space-x-3 px-3 py-3"
                      } rounded-xl transition-all duration-300 ${
                        isActive
                          ? `${item.bgAccent} shadow-lg shadow-black/5 border border-white/40 dark:border-gray-600`
                          : isHovered
                          ? "bg-white/60 dark:bg-gray-700 backdrop-blur-sm shadow-md shadow-black/5"
                          : "hover:bg-white/40 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div
                        className={`relative p-2 rounded-xl transition-all duration-300 ${
                          isActive || isHovered
                            ? `bg-gradient-to-r ${item.color} shadow-lg`
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 transition-all duration-300 ${
                            isActive || isHovered
                              ? "text-white"
                              : "text-gray-600 dark:text-gray-300"
                          }`}
                        />
                      </div>
                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span
                            className={`font-medium transition-all duration-300 ${
                              isActive
                                ? "text-gray-900 dark:text-graay-300"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {item.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            {(isActive || isHovered) && (
                              <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform duration-300 transform translate-x-0 group-hover:translate-x-1" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {(isActive && !collapsed) || (isActive && collapsed) ? (
                      <div
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b ${item.color} rounded-r-full shadow-lg`}
                      ></div>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* User Profile - Fixed at bottom */}
      {!collapsed && (
        <div className="flex-shrink-0">
          <SidebarUserNav
            user={user}
            trigger={
              <div className="p-3 relative z-10 cursor-pointer">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                        {user?.userName || "Admin User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Administrator
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      )}

      {/* Collapsed user profile */}
      {collapsed && (
        <div className="flex-shrink-0 p-3">
          <SidebarUserNav
            user={user}
            trigger={
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-2 border border-white/20 dark:border-gray-700 shadow-lg flex justify-center">
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                    {user.profilePicture ? (
                      <img
                        src={user?.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
              </div>
            }
          />
        </div>
      )}
    </motion.div>
  );

  // Mobile sidebar component
  const MobileSidebar = () => (
    <>
      <MobileOverlay />
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -288 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-30 h-full w-72 bg-gradient-to-br from-slate-50 to-blue-50/30 border-r border-gray-200/60 shadow-xl lg:hidden flex flex-col
        dark:from-gray-900 dark:to-gray-800 dark:border-gray-700"
      >
        {/* Header */}
        <div className="p-4 relative z-10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-gray-800">
                <LayoutDashboard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Admin Panel
                </h1>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/40 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <div className="flex items-center space-x-2 px-3 mb-3">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.section}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
              </div>

              <nav className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.name;

                  return (
                    <button
                      key={itemIndex}
                      onClick={() => handleItemClick(item.name)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? `${item.bgAccent} shadow-md`
                          : "hover:bg-white/40 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white`
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 p-3">
          <SidebarUserNav
            user={user}
            trigger={
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-gray-700 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                      {user?.profilePicture ? (
                        <img
                          src={user?.profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                      {user?.userName || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      Administrator
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            }
          />
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      {windowWidth < breakpoints.lg ? (
        <>
          <MobileNavbar />
          <MobileSidebar />
        </>
      ) : (
        <DesktopSidebar />
      )}
    </>
  );
};

export default AdminSidebar;
