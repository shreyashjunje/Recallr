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
  if (!token) return null;

  const decodedToken = jwtDecode(token);
  console.log("Decoded Token:", decodedToken);
  console.log("User in Sidebar:", user);

  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false); // toggle for mobile

  // Route mapping
  const routeMap = {
    Dashboard: "/dashboard",
    "Upload PDFs": "/upload",
    "My Library": "/library",
    "AI Summaries": "/summify",
    "Quiz Master": "/quizmaster",
    Flashcards: "/flashgenius",
    "Voice Assistant": "/voice-assistant",
    "Study Groups": "/study-groups",
    "Chat with PDFs": "/chat-pdfs",
  };

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
    setMobileOpen(false); // close drawer on mobile after navigation
  };

  const achievements = [
    { icon: Trophy, label: "Level 12", color: "text-yellow-500" },
    { icon: Star, label: "890 XP", color: "text-purple-500" },
    { icon: Zap, label: "23 Streak", color: "text-orange-500" },
  ];

  // your menuItems same as before ...
  const menuItems = [
    {
      section: "MAIN",
      items: [
        {
          name: "Dashboard",
          icon: Home,
          color: "from-blue-500 to-cyan-500",
          bgAccent: "bg-gradient-to-r from-blue-50 to-cyan-50",
        },
        {
          name: "Upload PDFs",
          icon: Upload,
          color: "from-emerald-500 to-green-500",
          bgAccent: "bg-gradient-to-r from-emerald-50 to-green-50",
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
        },
        {
          name: "Flashcards",
          icon: CreditCard,
          color: "from-teal-500 to-cyan-500",
          bgAccent: "bg-gradient-to-r from-teal-50 to-cyan-50",
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
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-20">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="w-8 h-8" />
          <h1 className="font-bold text-lg">Recallr</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <SidebarUserNav
            user={user}
            trigger={
              <div className="cursor-pointer">
                <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* Desktop sidebar (always visible on md+) */}
      <div className="hidden md:flex w-72 bg-gradient-to-br from-slate-50 to-blue-50/30 border-r border-gray-200 h-screen flex-col">
        {/* put your original sidebar UI here (logo, achievements, menu, usernav) */}
        {/* --- unchanged from your code --- */}
        {/* ...header code stays same */}

        {/* Header */}
        <div className="p-6 relative z-10">
          <div className="flex items-center space-x-1 ">
            <div className="relative">
              <div className="w-14 h-12 pb-4  rounded-2xl flex items-center justify-center shadow-lg">
                {/* <BookOpen className="w-7 h-7 text-white" /> */}
                <img src={logo} alt="" />
              </div>
              {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div> */}
            </div>
            <div className="">
              <h1 className="font-bold text-xl text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Recallr
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-600">Don’t store. Recall</p>
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

        {/* Menu Items */}
        <div className="flex-1 px-3 overflow-y-auto scrollbar-hide">
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
                      {/* same button content as your original */}
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

        {/* User Profile remains same */}
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

      {/* Mobile drawer sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* drawer content */}
          <div className="relative w-72 bg-gradient-to-br from-slate-50 to-blue-50/30 border-r border-gray-200 h-full flex flex-col z-50">
            {/* copy your sidebar content here (logo, achievements, menu, usernav) */}
          </div>
        </div>
      )}
    </>
  );
}
