import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/newLogo.png";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loginHandler = () => {
    navigate("/login");
    setIsMenuOpen(false); // Close menu when navigating
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex justify-center items-center">
            <img
              src={logo}
              alt="Recallr logo"
              className="h-10 w-auto md:h-12"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
            <h1 className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mt-2">
              Recallr
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
            >
              How it works
            </a>
            <a
              href="#demo"
              className="text-gray-600 hover:text-gray-900 transition-colors text-sm lg:text-base"
            >
              Demo
            </a>
            <button
              onClick={loginHandler}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm lg:text-base lg:px-6"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-16 px-4">
          <div className="flex flex-col space-y-4 py-4">
            <a
              href="#features"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              How it works
            </a>
            <a
              href="#demo"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Demo
            </a>
            <button
              onClick={loginHandler}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all mt-4 mx-3"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
