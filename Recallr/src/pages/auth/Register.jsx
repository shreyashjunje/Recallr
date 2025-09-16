import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import RegisterAnimation from "../../components/auth/RegisterAnimation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logoR.png"; // Make sure to import your logo
import useAuth from "../../hooks/useAuth";

export default function SignUpPage() {
  const { login } = useAuth(); // 👈 get login function from context

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("in the handle submit function");
    e.preventDefault();
    const errors = {};
    if (!formData.userName) errors.userName = "Username ID is required";
    if (!formData.email) errors.email = "email ID is required";
    if (!formData.phoneNumber)
      errors.phoneNumber = "Phone number ID is required";
    if (!formData.password) errors.password = "Password ID is required";
    if (!formData.confirmPassword)
      errors.confirmPassword = "ConfirmPassword is required";
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms)
      errors.agreeToTerms = "You must agree to the terms and policies";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return; // Stop the form from submitting
    }

    console.log(errors);

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        userName: formData.userName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (res.status === 201) {
        login(res.data.token); // 👈 updates context + localStorage
        toast.success("user logged in successfully..!");
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
      <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-6xl flex flex-col lg:flex-row lg:h-[90vh]">
        {/* Mobile Header with Back Button and Logo */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back
          </button>
          <div className="flex items-center">
            <img src={logo} alt="Recallr Logo" className="h-8 w-auto mr-2" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Recallr
            </span>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        <div className="max-w-6xl w-full flex overflow-hidden">
          {/* Left side - Animation (hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 p-8 xl:p-12 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-800 dark:to-gray-700 items-center justify-center">
            <RegisterAnimation />
          </div>

          {/* Right side - Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex justify-center items-center">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center lg:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Sign up
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
                    Sign up in seconds and explore everything we’ve built for
                    you.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Name fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="userName"
                        placeholder="Enter your username"
                        value={formData.userName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                      ${
                        formErrors.userName
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                        required
                      />
                      {formErrors.userName && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.userName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="Enter your email"
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                      ${
                        formErrors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        placeholder="Enter your phone number"
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                      ${
                        formErrors.phoneNumber
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                      }`}
                      />
                      {formErrors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter the password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                        ${
                          formErrors.password
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        {formErrors.password && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.password}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Enter the confirm password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                        ${
                          formErrors.confirmPassword
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                        }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        {formErrors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <div className="flex items-start space-x-2 mt-4">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
                      />
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        I agree to all the{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/terms")}
                          className="text-blue-600 hover:underline"
                        >
                          Terms
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/privacy")}
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policies
                        </button>
                      </label>
                    </div>

                    {formErrors.agreeToTerms && (
                      <p className="text-red-500 text-sm">
                        {formErrors.agreeToTerms}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center">
                        <div className="w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </button>

                  {/* Login link */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Login
                    </a>
                  </p>
                </div>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
