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
} from "lucide-react";
import RecallrAnimation from "../components/home/RecallrAnimation";
import Navbar from "../components/Navabar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RecallrActionAnimation from "@/components/home/RecallrActionAnimation";

const Home = () => {
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const navigate = useNavigate();

  
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
      // {
      //   icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
      //   title: "Search Inside PDFs",
      //   description: "Find specific concepts and information across all your documents",
      //   gradient: "from-purple-500 to-pink-500"
      // },
      // {
      //   icon: <Bell className="w-6 h-6 sm:w-8 sm:h-8" />,
      //   title: "Smart Reminders",
      //   description: "Never forget about unread files with intelligent notifications",
      //   gradient: "from-red-400 to-pink-500"
      // },
      // {
      //   icon: <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
      //   title: "Chat with PDFs",
      //   description: "Ask questions and get answers directly from your documents",
      //   gradient: "from-indigo-500 to-purple-600"
      // },
    ],
    []
  );
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 p-4">
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
      <Navbar toggleMenu={toggleMenu} />
      {/* Hero Section */}
      <section className="min-h-screen pt-16 lg:pt-24 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                {/* Recallr – Your AI-powered{" "} */}
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Recallr
                </span>{" "}
                – Smarter PDFs, Smarter You
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
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
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  See How It Works
                </a>
              </div>
            </div>

            <div className="flex justify-center">
              <RecallrAnimation />
            </div>
          </div>
        </div>
      </section>
      {/* Problem → Solution Section */}
      {/* Problem → Solution Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Problem */}
            <div className="bg-red-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-3 sm:mb-4">
                The Problem
              </h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                You download countless PDFs from LinkedIn, Telegram, and other
                sources, hoping to study them later. But when the time comes,
                the files are scattered, unorganized, and hard to find. As a
                result, most of your valuable study material is left untouched,
                and your learning never reaches its full potential.
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-red-500">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-sm font-medium">
                  Scattered files, wasted study time
                </span>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-green-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">
                The Solution
              </h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This platform keeps all your PDFs in one organized space with
                proper categories, so you never lose track of your study
                materials. On top of that, AI-powered summaries, flashcards, and
                quizzes transform static documents into interactive learning
                experiences — accessible anytime, anywhere.
              </p>
              <div className="mt-4 sm:mt-6 flex items-center text-green-500">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
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
      {/* Features Section */}
      {/* <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Powerful Features for Smarter Learning
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your PDF collection into an intelligent knowledge system
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Smart Organization",
                description:
                  "Auto-categorize PDFs into topics and subjects for easy navigation",
              },
              {
                icon: <Brain className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "AI Summaries",
                description:
                  "Get instant key points and insights from lengthy documents",
              },
              {
                icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Flashcards & Quizzes",
                description:
                  "Learn actively with auto-generated questions and answers",
              },
              {
                icon: <Search className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Search Inside PDFs",
                description:
                  "Find specific concepts and information across all your documents",
              },
              {
                icon: <Bell className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Smart Reminders",
                description:
                  "Never forget about unread files with intelligent notifications",
              },
              {
                icon: <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
                title: "Chat with PDFs",
                description:
                  "Ask questions and get answers directly from your documents",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Smarter Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your PDF collection into an intelligent knowledge system
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
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
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
              How Recallr Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
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
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xs mx-auto">
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
      <RecallrActionAnimation />
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Turn your PDF pile into knowledge — for free
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8">
            Join thousands of students and professionals who never forget what
            they learn
          </p>
          <button
            onClick={() => {
              token ? navigate("/dashboard") : navigate("/signup");
            }}
            className="bg-white text-blue-600 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Get Started Now
          </button>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <Brain className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">Recallr</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                AI-powered PDF study assistant that helps you organize,
                summarize, and quiz yourself on your learning materials.
              </p>
              <p className="text-gray-400 text-sm sm:text-base">
                Contact: hello@recallr.app
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">
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
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-4">
                Legal
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <p onClick={()=>navigate("/privacy")} className= " cursor-pointer hover:text-white transition-colors">
                    Privacy Policy
                  </p>
                </li>
                <li>
                  <a onClick={()=>navigate("/terms")} className="hover:text-white  cursor-pointer transition-colors">
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

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2025 Recallr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
