import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

import {
  FileText,
  Brain,
  Search,
  MessageCircle,
  Bell,
  Zap,
  Upload,
  BookOpen,
  Target,
  ArrowRight,
  Menu,
  X,
  Play,
  CheckCircle,
  FileQuestion,
  Sparkles,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import RecallrAnimation from "../components/home/RecallrAnimation";
import Navbar from "../components/Navabar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RecallrActionAnimation from "@/components/home/RecallrActionAnimation";
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/logoR.png";
import { useTheme } from "../context/AdminThemeContext"; // Adjust path as needed

const Home = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme(); // Get theme state and toggle function

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [trackForm, setTrackForm] = useState({ email: "", ticketId: "" });

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.email) {
          setContactForm((prev) => ({
            ...prev,
            email: decoded.email,
          }));
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [token, setContactForm]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (token) {
        res = await axios.post(
          `${API_URL}/ticket/create-ticket`,
          {
            name: contactForm.name,
            email: contactForm.email,
            subject: contactForm.subject,
            message: contactForm.message,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
      } else {
        res = await axios.post(`${API_URL}/ticket/create-ticket`, {
          name: contactForm.name,
          email: contactForm.email,
          subject: contactForm.subject,
          message: contactForm.message,
        });
      }

      if (res.status === 201) {
        toast.success(
          "Your ticket has been created! We'll get back to you soon."
        );
        setContactForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 8);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Memoized feature data
  const features = useMemo(
    () => [
      {
        icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "Smart Organization",
        description:
          "Auto-categorize PDFs into topics and subjects for easy navigation",
        gradient: "from-yellow-400 to-orange-500",
      },
      {
        icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "AI Summaries",
        description:
          "Get instant key points and insights from lengthy documents",
        gradient: "from-blue-500 to-purple-600",
      },
      {
        icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
        title: "Flashcards & Quizzes",
        description: "Learn actively with auto-generated questions and answers",
        gradient: "from-green-400 to-blue-500",
      },
    ],
    []
  );
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`w-full min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 ${
            isDark ? "bg-gray-900" : "bg-white"
          } z-50 p-4`}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-xl font-bold">Recallr</span>
            </div>
            <button onClick={toggleMenu}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-4">
            <a href="#features" className="block text-lg" onClick={toggleMenu}>
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-lg"
              onClick={toggleMenu}
            >
              How It Works
            </a>
            <a href="#demo" className="block text-lg" onClick={toggleMenu}>
              Demo
            </a>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold mt-4">
              Get Started
            </button>
          </nav>
        </div>
      )}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`fixed top-4 right-4 z-50 p-2 rounded-full ${
          isDark ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"
        }`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <Navbar
        toggleMenu={toggleMenu}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Hero Section */}
      <section
        className={`min-h-screen pt-16 lg:pt-24 ${
          isDark
            ? "bg-gradient-to-br from-gray-800 to-gray-900"
            : "bg-gradient-to-br from-blue-50 to-purple-50"
        } overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1
                className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Recallr
                </span>{" "}
                – Smarter PDFs, Smarter You
              </h1>
              <p
                className={`text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Upload, organize, and learn. Summaries, flashcards, and quizzes
                — all in one platform
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => {
                    token ? navigate("/dashboard") : navigate("/register");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Get Started Free
                </button>
                <a
                  href="#how-it-works"
                  className={`border-2 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold transition-all flex items-center justify-center ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                      : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500"
                  }`}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  See How It Works
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <RecallrAnimation isDark={isDark} />
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Problem */}
            <div
              className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${
                isDark ? "bg-red-900/20" : "bg-red-50"
              }`}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
                The Problem
              </h3>
              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                You download countless PDFs from LinkedIn, Telegram, and other
                sources, hoping to study them later. But when the time comes,
                the files are scattered, unorganized, and hard to find. As a
                result, most of your valuable study material is left untouched,
                and your learning never reaches its full potential.
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-red-500">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4 ${
                    isDark ? "bg-red-800/30" : "bg-red-100"
                  }`}
                >
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-sm font-medium">
                  Scattered files, wasted study time
                </span>
              </div>
            </div>

            {/* Solution */}
            <div
              className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl ${
                isDark ? "bg-green-900/20" : "bg-green-50"
              }`}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">
                The Solution
              </h3>
              <p
                className={`text-base sm:text-lg leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                This platform keeps all your PDFs in one organized space with
                proper categories, so you never lose track of your study
                materials. On top of that, AI-powered summaries, flashcards, and
                quizzes transform static documents into interactive learning
                experiences — accessible anytime, anywhere.
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-green-500">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mr-3 sm:mr-4 ${
                    isDark ? "bg-green-800/30" : "bg-green-100"
                  }`}
                >
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-sm font-medium">
                  One place for smarter learning
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className={`py-16 lg:py-24 ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-3xl lg:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Powerful Features for Smarter Learning
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Transform your PDF collection into an intelligent knowledge system
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                    : "bg-white border-gray-100 hover:border-gray-200"
                } border`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className={`py-16 sm:py-20 lg:py-24 ${
          isDark
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-b from-white via-gray-50 to-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-20">
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              How Recallr Works
            </h2>
            <p
              className={`text-lg sm:text-xl max-w-2xl mx-auto ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              In just three steps, turn scattered PDFs into organized,
              interactive learning.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-3 gap-10 relative">
            {[
              {
                step: "01",
                title: "Upload Your PDFs",
                description:
                  "Bring in files from your device, Gmail, Drive, or even WhatsApp — all in one place.",
                icon: <Upload className="w-7 h-7 sm:w-9 sm:h-9" />,
                color: "from-pink-500 to-red-500",
              },
              {
                step: "02",
                title: "AI Supercharge",
                description:
                  "Our AI extracts key ideas, builds summaries, and organizes content for easy access.",
                icon: <Brain className="w-7 h-7 sm:w-9 sm:h-9" />,
                color: "from-indigo-500 to-blue-600",
              },
              {
                step: "03",
                title: "Learn Smarter",
                description:
                  "Review with summaries, create flashcards, test yourself with quizzes — anytime, anywhere.",
                icon: <BookOpen className="w-7 h-7 sm:w-9 sm:h-9" />,
                color: "from-green-500 to-emerald-600",
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative group">
                {/* Icon with gradient */}
                <div
                  className={`relative mb-6 sm:mb-8 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white mx-auto shadow-lg group-hover:scale-105 transform transition`}
                >
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-gray-900 shadow">
                    {step.step}
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  className={`text-xl sm:text-2xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-base sm:text-lg leading-relaxed max-w-xs mx-auto ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {step.description}
                </p>

                {/* Connector Arrows */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <RecallrActionAnimation isDark={isDark} />

      {/* CTA Section */}
      <section
        className={`py-16 sm:py-20 lg:py-24 ${
          isDark
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
            : "bg-gradient-to-br from-blue-500 to-purple-600"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading & Subtitle */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Get in Touch ✨
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`text-lg sm:text-xl mb-10 ${
              isDark ? "text-gray-300" : "text-blue-100"
            }`}
          >
            Have questions, feedback, suggestions or faces issues? Drop us a
            message and we'll get back to you soon.
          </motion.p>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleContactSubmit}
            className={`max-w-2xl mx-auto backdrop-blur-md rounded-2xl shadow-xl border p-8 space-y-5 text-left transition-all duration-300 ${
              isDark
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-white/30"
            }`}
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={contactForm.email}
                onChange={handleInputChange}
                disabled={!!token}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900"
                } ${token ? "opacity-70 cursor-not-allowed" : ""}`}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                placeholder="What is this regarding?"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className={`block text-sm font-medium mb-1 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={contactForm.message}
                onChange={handleInputChange}
                required
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-3 px-6 rounded-lg transition-all font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105"
              } ${isDark ? "shadow-lg" : "shadow-md"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>

            {/* Additional contact information */}
            <div
              className={`text-center pt-4 border-t ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Prefer to email directly?{" "}
                <a
                  href="mailto:recallr1825@gmail.com"
                  className={`font-medium hover:underline ${
                    isDark ? "text-indigo-400" : "text-indigo-600"
                  }`}
                >
                  recallr1825@gmail.com
                </a>
              </p>
            </div>
          </motion.form>

          {/* Success/Error Messages (optional) */}
          {/* You can add toast notifications or inline messages here */}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 sm:py-12 ${
          isDark ? "bg-gray-800 text-white" : "bg-gray-900 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <img
                    src={logo}
                    className="w-6 h-6 sm:w-5 sm:h-5 text-white"
                    alt=""
                  />
                </div>
                <span className="text-lg sm:text-xl font-bold">Recallr</span>
              </div>
              <p
                className={`text-sm sm:text-base mb-3 sm:mb-4 ${
                  isDark ? "text-gray-400" : "text-gray-400"
                }`}
              >
                AI-powered PDF study assistant that helps you organize,
                summarize, and quiz yourself on your learning materials.
              </p>
              <p
                className={`text-sm sm:text-base ${
                  isDark ? "text-gray-400" : "text-gray-400"
                }`}
              >
                Contact: recallr1825@gmail.com
              </p>
            </div>

            <div>
              <h4
                className={`font-semibold text-sm sm:text-base mb-2 sm:mb-4 ${
                  isDark ? "text-white" : "text-white"
                }`}
              >
                Product
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#demo"
                    className="hover:text-white transition-colors"
                  >
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className={`font-semibold text-sm sm:text-base mb-2 sm:mb-4 ${
                  isDark ? "text-white" : "text-white"
                }`}
              >
                Legal
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <p
                    onClick={() => navigate("/privacy")}
                    className=" cursor-pointer hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </p>
                </li>
                <li>
                  <a
                    onClick={() => navigate("/terms")}
                    className="hover:text-white  cursor-pointer transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Recallr
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base ${
              isDark
                ? "border-gray-700 text-gray-400"
                : "border-gray-800 text-gray-400"
            }`}
          >
            <p>&copy; 2025 Recallr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
