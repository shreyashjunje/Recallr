import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, User } from "lucide-react";
import logo from "../assets/newLogo.png";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import SidebarUserNav from "./dashboard/helper/SidebarUserNav";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  console.log("isLOGGEDIN-->", isLoggedIn);

  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Handle scroll effect for navbar
  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 10);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // useEffect(() => {
  //   if (user) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, [user]);
  // 🔑 Whenever user or route changes, sync auth state
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

  // const loginHandler = () => {
  //   if (isLoggedIn) {
  //     // If already on dashboard, go to home, otherwise go to dashboard
  //     if (window.location.pathname === "/dashboard") {
  //       navigate("/", { replace: true });
  //     } else {
  //       navigate("/dashboard", { replace: true });
  //     }
  //   } else {
  //     navigate("/login");
  //   }
  //   setIsMenuOpen(false);
  // };

  //   const loginHandler = () => {
  //     if (isLoggedIn) {
  //       // If already on dashboard or any dashboard sub-route, go to home
  //       if (location.pathname.startsWith("/dashboard") ||
  //           location.pathname === "/dashboard") {
  //         navigate("/", { replace: true });
  //       } else {
  //         navigate("/dashboard", { replace: true });
  //       }
  //     } else {
  //       navigate("/login");
  //     }
  //     setIsMenuOpen(false);
  //   };
  // // Update button text dynamically
  // const getButtonText = () => {
  //   if (!isLoggedIn) return "Login";
  //   return (location.pathname.startsWith("/dashboard") ||
  //           location.pathname === "/dashboard") ? "Home" : "Dashboard";
  // };
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
      className={`sticky top-0 z-50 py-2 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <img
              src={logo}
              alt="Recallr logo"
              className="h-10 w-auto md:h-12 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Recallr
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base font-medium"
            >
              How it works
            </a>
            <a
              href="#demo"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base font-medium"
            >
              Demo
            </a>
            <div className="flex gap-2">
              {/* <button
                onClick={loginHandler}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 text-sm lg:text-base font-medium hover:from-blue-600 hover:to-purple-700"
              >
                {!isLoggedIn ? "Login" : "Dashboard"}
              </button> */}
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
                              {user?.profilePicture ? (
                                <img
                                  src={user.profilePicture}
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
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved UI */}
      {isMenuOpen && (
        <div className="mobile-menu-container fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img src={logo} alt="Recallr logo" className="h-8 w-auto" />
                <h2 className="text-xl font-bold text-gray-900">Recallr</h2>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4">
              <div className="space-y-2">
                <a
                  href="#features"
                  className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                  onClick={closeMenu}
                >
                  <span className="font-medium">Features</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
                  onClick={closeMenu}
                >
                  <span className="font-medium">How it works</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a
                  href="#demo"
                  className="flex items-center justify-between p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 group"
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

              {/* Footer text */}
              <p className="text-center text-sm text-gray-500 mt-8">
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
