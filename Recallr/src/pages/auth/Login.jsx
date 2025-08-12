import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// import loginIMG from "../../assets/auth/loginIMG.png";/
import LoginAnimation from "../../components/auth/LoginAnimation";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setloginId] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
      toast.success("User logged in successfully..!");
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // Frontend validation
    // if (!loginId && !password) {
    //   toast.error("Please enter both LoginId and password.");
    //   return;

    // }
    const errors = {};
    if (!loginId) errors.loginId = "Login ID is required";
    if (!password) errors.password = "Password is required";

    setFormErrors(errors);

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        loginId,
        password,
      });

      console.log(res.data);

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        toast.success("User login successfully..!");
        navigate("/dashboard");
      }

      if (res.status == 400) {
        toast.error("All fields are required..!");
      } else if (res.status == 404) {
        toast.error("User not found..!");
      }
    } catch (err) {
      console.error("Login Error:", err.message);
      // toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLoginHandler = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("inbackendcall....");
      toast.success("Successfully logged in!");
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000); // 1 second
    } else {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl w-full max-w-6xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 w-full lg:w-1/2 flex flex-col">
          {/* Login Form */}
          <form onSubmit={handleSubmit} autoComplete="on">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Login
              </h1>
              <p className="text-gray-600 mb-6 sm:mb-8">
                Login to access your travelwise account
              </p>

              <div className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        : "border-gray-300 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Remember me
                    </span>
                  </label>
                  <button className="text-sm text-red-500 hover:text-red-600">
                    Forgot Password
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base sm:text-lg"
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
                  <span className="text-gray-600">Don't have an account? </span>
                  <button
                    onClick={handleSignUp}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Sign up
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or login with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex gap-3 sm:gap-4">
                  <button className="flex-1 border border-gray-300 rounded-lg py-2 sm:py-3 px-4 hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={googleLoginHandler}
                    className="flex-1 border border-gray-300 rounded-lg py-2 sm:py-3 px-4 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </button>
                  <button className="flex-1 border border-gray-300 rounded-lg py-2 sm:py-3 px-4 hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Animation/Image */}
        <div className="hidden lg:flex lg:w-1/2 p-8 xl:p-12 bg-gradient-to-br from-blue-100 to-indigo-200 items-center justify-center">
          <LoginAnimation />
        </div>
      </div>
    </div>
  );
}
