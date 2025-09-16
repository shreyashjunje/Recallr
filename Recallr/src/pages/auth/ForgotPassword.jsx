import React, { useState } from "react";
import { ChevronLeft, Mail, Lock, Key, Settings, Shield } from "lucide-react";
import logo from "../../assets/logoR.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ForgotPasswordAnimation from "@/components/auth/ForgotPasswordAnimation";
const API_URL = import.meta.env.VITE_API_URL;
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      if (res.status === 200) {
        toast.success(
          "If this email exists, a reset link has been sent to your inbox."
        );
        // don't navigate manually, wait for user to click the email link
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl shadow-2xl w-full rounded-2xl overflow-hidden mx-auto">
        {/* Main Container */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 p-12">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <div className="w-10 h-8 flex items-center justify-center">
                  <img src={logo} alt="recallr logo" />
                </div>
                <span className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-200">
                  Recallr
                </span>
              </div>

              {/* Back to login */}
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-8 transition-colors"
              >
                <ChevronLeft size={16} />
                <span className="text-sm">Back to login</span>
              </button>

              {/* Main Content */}
              <div className="max-w-sm">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Forgot your password?
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Don't worry, happens to all of us. Enter your email below to
                  recover your password
                </p>

                {/* Email Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 outline-none transition-colors"
                    placeholder="Enter the email"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors mb-8"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Illustration */}
            {/* <div className="w-full  md:w-1/2"> */}
            <ForgotPasswordAnimation darkMode={true} />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
