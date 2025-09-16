import React, { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import LoginAnimation from "../../components/auth/LoginAnimation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logoR.png";
import useAuth from "@/hooks/useAuth";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const { login, user, authChecked } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setloginId] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!loginId) errors.loginId = "Login ID is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        loginId,
        password,
      });

      console.log(res.data);

      if (res.status === 200) {
        // console.log("toekn9999",res.data.token)
        login(res.data.token); // 👈 use context login
        toast.success("User login successfully..!");

        const token = res.data.token;

        const decoded = jwtDecode(res.data.token);
        localStorage.setItem("role", decoded.role); // 👈 save role

        if (rememberMe) {
          localStorage.setItem("token", token); // persists until manually cleared
        } else {
          sessionStorage.setItem("token", token); // clears when browser is closed
        }

        // 🚀 redirect based on role
        if (decoded.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }

      if (res.status == 400) {
        toast.error("All fields are required..!");
      } else if (res.status == 404) {
        toast.error("User not found..!");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      toast.error(err.data?.message || "Login failed due to server error");
    } finally {
      setLoading(false);
    }
  };

  const handleforgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      {isMobile && (
        <button
          onClick={handleBack}
          className="absolute top-5 left-4 z-10 p-2 rounded-full bg-white shadow-md lg:hidden dark:bg-gray-800 dark:text-gray-200"
        >
          <ArrowLeft size={20} className="" />
        </button>
      )}

      {isMobile && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex items-center">
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="Recallr Logo"
              className="w-9 h-12 sm:w-7 sm:h-7 md:w-8 md:h-8"
            />
          </div>
          <span className="font-bold text-gray-800 dark:text-gray-100 text-2xl sm:text-xl md:text-2xl mt-2">
            Recallr
          </span>
        </div>
      )}

      <div className="bg-white shadow-2xl dark:bg-gray-900 w-full max-w-6xl rounded-2xl overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left Side - Login Form */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 w-full lg:w-1/2 flex flex-col">
          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 mt-6 lg:mt-0">
                Login
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                Login to access your Recallr account
              </p>

              <div className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Login ID
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    autoComplete="loginId"
                    onChange={(e) => setloginId(e.target.value)}
                    className={`w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 outline-none transition-colors 
                  ${
                    formErrors.loginId
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-blue-500"
                  }`}
                    placeholder="email/phone/username"
                  />
                  {formErrors.loginId && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.loginId}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      autoComplete="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 outline-none transition-colors pr-12
                    ${
                      formErrors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:ring-blue-500"
                    }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleforgotPassword}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Forgot Password
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base sm:text-lg disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignUp}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Animation/Image */}
        <div className="hidden lg:flex lg:w-1/2 p-8 xl:p-12 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 items-center justify-center">
          <LoginAnimation />
        </div>
      </div>
    </div>
  );
}
