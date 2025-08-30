import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logoR.png";
import {
  Home,
  Upload,
  BookOpen,
  Sparkles,
  FileQuestion,
  CreditCard,
  Mic,
  Users,
  MessageSquare,
  User,
  ChevronRight,
  Zap,
  Star,
  Trophy,
  Menu,
  X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import SidebarUserNav from "../dashboard/helper/SidebarUserNav";

export default function Sidebar() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = jwtDecode(token);
  console.log("Decoded Token:", decodedToken);
  console.log("User in Sidebar:", user);

  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Close mobile menu when switching to desktop
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Route mapping
  const routeMap = {
    Dashboard: "/dashboard",
    "Upload PDFs": "/upload",
    "My Library": "/library",
    "AI Summaries": "/ai-summaries",
    "Quiz Master": "/quizmaster",
    Flashcards: "/flashcards",
    "Voice Assistant": "/voice-assistant",
    "Study Groups": "/study-groups",
    "Chat with PDFs": "/chat-pdfs",
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
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const achievements = [
    { icon: Trophy, label: "Level 12", color: "text-yellow-500" },
    { icon: Star, label: "890 XP", color: "text-purple-500" },
    { icon: Zap, label: "23 Streak", color: "text-orange-500" },
  ];

  const menuItems = [
    {
      section: "MAIN",
      items: [
        {
          name: "Dashboard",
          icon: Home,
          color: "from-blue-500 to-cyan-500",
          bgAccent: "bg-gradient-to-r from-blue-50 to-cyan-50",
          badge: null,
        },
        {
          name: "Upload PDFs",
          icon: Upload,
          color: "from-emerald-500 to-green-500",
          bgAccent: "bg-gradient-to-r from-emerald-50 to-green-50",
          badge: null,
        },
        {
          name: "My Library",
          icon: BookOpen,
          color: "from-purple-500 to-violet-500",
          bgAccent: "bg-gradient-to-r from-purple-50 to-violet-50",
          badge: "24",
        },
      ],
    },
    {
      section: "AI FEATURES",
      items: [
        {
          name: "AI Summaries",
          icon: Sparkles,
          color: "from-pink-500 to-rose-500",
          bgAccent: "bg-gradient-to-r from-pink-50 to-rose-50",
          badge: "NEW",
          special: true,
        },
        {
          name: "Quiz Master",
          icon: FileQuestion,
          color: "from-yellow-500 to-amber-500",
          bgAccent: "bg-gradient-to-r from-yellow-50 to-amber-50",
          badge: null,
        },
        {
          name: "Flashcards",
          icon: CreditCard,
          color: "from-teal-500 to-cyan-500",
          bgAccent: "bg-gradient-to-r from-teal-50 to-cyan-50",
          badge: null,
        },
        {
          name: "Voice Assistant",
          icon: Mic,
          color: "from-indigo-500 to-blue-500",
          bgAccent: "bg-gradient-to-r from-indigo-50 to-blue-50",
          badge: "BETA",
        },
      ],
    },
    {
      section: "COMMUNITY",
      items: [
        {
          name: "Study Groups",
          icon: Users,
          color: "from-blue-600 to-indigo-600",
          bgAccent: "bg-gradient-to-r from-blue-50 to-indigo-50",
          badge: "3",
        },
        {
          name: "Chat with PDFs",
          icon: MessageSquare,
          color: "from-red-500 to-pink-500",
          bgAccent: "bg-gradient-to-r from-red-50 to-pink-50",
          badge: null,
        },
      ],
    },
  ];

  // Mobile navbar component
  const MobileNavbar = () => (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-gray-200/60 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center justify-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20 shadow-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center ">
          <div className="w-15 h-12 rounded-xl flex items-center justify-center">
            <img src={logo} alt="Recallr Logo" className="h-10" />
          </div>
          <h1 className="font-bold text-2xl mt-2 text-gray-900">Recallr</h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse delay-200"></div>
          </div>
          <SidebarUserNav
            user={user}
            trigger={
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg cursor-pointer">
                <User className="w-5 h-5 text-white" />
              </div>
            }
          />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="bg-white border-t border-gray-200 shadow-lg max-h-[70vh] overflow-y-auto">
          <div className="p-4">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
                <div className="space-y-2">
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
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? `bg-gradient-to-r ${item.color} text-white`
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span
                            className={`ml-auto px-2 py-1 text-xs font-bold rounded-full ${
                              item.badge === "NEW"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : item.badge === "BETA"
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Desktop sidebar component
 // Desktop sidebar component
const DesktopSidebar = () => (
  <div className="hidden md:flex w-72 bg-gradient-to-br from-slate-50 to-blue-50/30 border-r border-gray-200/60 h-screen flex-col relative overflow-hidden z-10">
    {/* Header */}
    <div className="p-6 relative z-10 flex-shrink-0">
      <div className="flex items-center space-x-1">
        <div className="relative">
          <div className="w-14 h-12 pb-4 rounded-2xl flex items-center justify-center shadow-lg">
            <img src={logo} alt="Recallr Logo" />
          </div>
        </div>
        <div className="">
          <h1 className="font-bold text-xl text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            Recallr
          </h1>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600">Don't store. Recall</p>
            <div className="flex space-x-0.5">
              <div className="w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse delay-100"></div>
              <div className="w-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="mt-4 flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl p-3 border border-white/20">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-center space-x-2">
            <achievement.icon className={`w-4 h-4 ${achievement.color}`} />
            <span className="text-xs font-semibold text-gray-700">
              {achievement.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Menu Items - This section should be scrollable */}
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {menuItems.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-8">
          <div className="flex items-center space-x-2 px-4 mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {section.section}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

          <nav className="space-y-2">
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
                  className={`relative w-full group transition-all duration-300 ease-out transform ${
                    isActive ? "scale-102" : isHovered ? "scale-101" : ""
                  }`}
                >
                  <div
                    className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? `${item.bgAccent} shadow-lg shadow-black/5 border border-white/40`
                        : isHovered
                        ? "bg-white/60 backdrop-blur-sm shadow-md shadow-black/5"
                        : "hover:bg-white/40"
                    }`}
                  >
                    <div
                      className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                        isActive || isHovered
                          ? `bg-gradient-to-r ${item.color} shadow-lg`
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          isActive || isHovered
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      />
                      {item.special && (isActive || isHovered) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur opacity-30"></div>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span
                        className={`font-semibold transition-all duration-300 ${
                          isActive ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {item.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        {item.badge && (
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                              item.badge === "NEW"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse"
                                : item.badge === "BETA"
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {(isActive || isHovered) && (
                          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-300 transform translate-x-0 group-hover:translate-x-1" />
                        )}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <div
                      className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${item.color} rounded-r-full shadow-lg`}
                    ></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      ))}
    </div>

    {/* User Profile - Fixed at bottom */}
    <div className="flex-shrink-0">
      <SidebarUserNav
        user={user}
        trigger={
          <div className="p-4 relative z-10 cursor-pointer">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  </div>
);

  return (
    <>
      {/* Mobile Navbar (fixed at top on mobile) */}
      <MobileNavbar />

      {/* Desktop Sidebar (always visible on desktop) */}
      <DesktopSidebar />

      {/* Add padding to content on mobile to account for fixed navbar */}
      {isMobile && <div className="h-16 md:h-0"></div>}
    </>
  );
}
