import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, User, Moon, Sun } from "lucide-react";
import logo from "../assets/newLogo.png";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import SidebarUserNav from "./dashboard/helper/SidebarUserNav";

const Navbar = ({ isDark, toggleTheme }) => {
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  // console.log("isLOGGEDIN-->", isLoggedIn);
  // console.log("Profile picture URL:", user?.profilePicture);

  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!(user || token));
  }, [user, location]);
  const loginHandler = () => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login");
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".mobile-menu-container")) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 py-2 ${
        isDark ? "bg-gray-600" : "bg-white"
      } transition-all duration-300 ${isScrolled ? "shadow-md" : "shadow-sm"}`}
    >
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-1">
            <img
              src={logo}
              alt="Recallr logo"
              className="h-10 w-auto md:h-12 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1
              className={`text-2xl sm:text-4xl mt-2 font-bold ${
                isDark ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Recallr
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className={`text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base font-medium ${
                isDark ? "text-white" : "text-gray-600"
              }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base font-medium ${
                isDark ? "text-white" : "text-gray-600"
              }`}
            >
              How it works
            </a>
            <a
              href="#demo"
              className={`text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base font-medium ${
                isDark ? "text-white" : "text-gray-600"
              }`}
            >
              Demo
            </a>
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md transition"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-800" />
                )}
              </button>

              <button
                onClick={loginHandler}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 text-sm lg:text-base font-medium hover:from-blue-600 hover:to-purple-700"
              >
                {!isLoggedIn ? "Login" : "Dashboard"}
              </button>
              {isLoggedIn && (
                <SidebarUserNav
                  user={user}
                  trigger={
                    <div className="relative z-10 cursor-pointer">
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl  border border-white/20 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                              {user.profilePicture ? (
                                <img
                                  src={user?.profilePicture}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                          {/* <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.userName}
                        </p>
                        
                      </div> */}
                        </div>
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md transition"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-800" />
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved UI */}
      {isMenuOpen && (
        <div className="mobile-menu-container fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Recallr logo" className="h-8 w-auto" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Recallr
                </h2>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              <div className="space-y-2">
                <a
                  href="#features"
                  className="flex items-center justify-between p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                  onClick={closeMenu}
                >
                  <span className="font-medium">Features</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-between p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                  onClick={closeMenu}
                >
                  <span className="font-medium">How it works</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="#demo"
                  className="flex items-center justify-between p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
                  onClick={closeMenu}
                >
                  <span className="font-medium">Demo</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              {/* Login Button */}
              <button
                onClick={loginHandler}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 font-medium hover:from-blue-600 hover:to-purple-700"
              >
                Login to Your Account
              </button>

              {/* Close button at bottom (extra) */}
              <button
                onClick={closeMenu}
                className="w-full mt-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 font-medium"
              >
                Close Menu
              </button>

              {/* Footer text */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                Don't store. Recall.
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
