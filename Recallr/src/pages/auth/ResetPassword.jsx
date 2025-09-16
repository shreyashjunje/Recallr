import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Settings } from "lucide-react";
import logo from "../../assets/logoR.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [valid, setValid] = useState(null); // null=loading, true=valid, false=invalid
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: validate token when page loads
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.post(`${API_URL}/auth/validate-reset-token`, {
          token,
        });
        console.log("ressss->", res);
        setValid(true);
      } catch (err) {
        setValid(false);
      }
    };
    if (token) validateToken();
  }, [token]);

  // const [createPassword, setCreatePassword] = useState("");
  // const [reenterPassword, setReenterPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);

  const handleReset = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    console.log("password-->", password);
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      toast.success("Password reset successful. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl shadow-2xl w-full rounded-2xl overflow-hidden mx-auto">
        {/* Main Container with Blue Border */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border-2 border-blue-400 dark:border-blue-600 overflow-hidden">
          <div className="flex">
            {/* Left Side - Form */}
            <div className="w-1/2 p-12">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <div className="w-10 h-8 flex items-center justify-center">
                  <img src={logo} alt="recallr logo" />
                </div>
                <span className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">
                  Recallr
                </span>
              </div>

              {/* Main Content */}
              <div className="max-w-sm">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Set a password
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Your previous password has been reset. Please set a new
                  password for your account.
                </p>

                {/* Create Password Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {showCreatePassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Re-enter Password Input */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Re-enter Password
                  </label>
                  <div className="relative">
                    <input
                      type={showReenterPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowReenterPassword(!showReenterPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {showReenterPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Set Password Button */}
                <button
                  onClick={handleReset}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Set password"
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="w-1/2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center p-12">
              <div className="relative">
                {/* Security Icons Illustration */}
                <div className="relative w-80 h-80">
                  {/* Main Lock */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-24 h-32 bg-blue-600 dark:bg-blue-500 rounded-lg relative shadow-lg">
                      {/* Lock shackle */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-12 border-4 border-gray-400 dark:border-gray-500 rounded-t-full bg-transparent"></div>
                      {/* Lock keyhole */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-200 rounded-full"></div>
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-white dark:bg-gray-200"></div>
                    </div>
                  </div>

                  {/* Email Icon */}
                  <div className="absolute top-16 left-8">
                    <div className="w-16 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-lg relative shadow-md transform rotate-12">
                      <div className="absolute inset-2 border-2 border-yellow-600 dark:border-yellow-400 rounded"></div>
                      <div className="absolute top-2 left-2 right-2 h-0 border-t-2 border-yellow-600 dark:border-yellow-400"></div>
                    </div>
                  </div>

                  {/* Key Icon */}
                  <div className="absolute bottom-20 left-12">
                    <div className="w-20 h-6 bg-gray-400 dark:bg-gray-600 rounded-full relative shadow-md transform -rotate-12">
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-400 dark:bg-gray-500 rounded-sm"></div>
                      <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-200 dark:bg-gray-400 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-8 right-8">
                    <div className="w-32 h-8 bg-yellow-400 dark:bg-yellow-500 rounded-lg shadow-md relative">
                      <div className="w-3/4 h-full bg-blue-600 dark:bg-blue-500 rounded-lg"></div>
                    </div>
                  </div>

                  {/* Password Field with Stars */}
                  <div className="absolute bottom-16 right-12">
                    <div className="w-28 h-6 bg-yellow-400 dark:bg-yellow-500 rounded-lg shadow-md flex items-center justify-center">
                      <div className="flex gap-1">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 text-blue-600 dark:text-blue-500 font-bold text-xs"
                          >
                            ★
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Settings Gears */}
                  <div className="absolute top-8 right-16">
                    <Settings
                      className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-spin"
                      style={{ animationDuration: "10s" }}
                    />
                  </div>

                  <div className="absolute top-20 right-8">
                    <Settings
                      className="w-6 h-6 text-gray-300 dark:text-gray-400 animate-spin"
                      style={{
                        animationDuration: "15s",
                        animationDirection: "reverse",
                      }}
                    />
                  </div>

                  {/* Warning Triangle */}
                  <div className="absolute bottom-4 right-4">
                    <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-500 rounded-lg flex items-center justify-center shadow-md transform rotate-12">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-orange-600 dark:border-b-orange-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
