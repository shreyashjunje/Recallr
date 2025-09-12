import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  MessageCircle,
  User,
  CreditCard,
  Settings,
  HelpCircle,
  Mail,
  Phone,
  X,
  Cpu,
  BookOpen,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;
import axios from "axios";
import { toast } from "react-toastify";

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [tickets, setTickets] = useState([]);
  const [trackForm, setTrackForm] = useState({ email: "", ticketId: "" });
  const [trackedTicket, setTrackedTicket] = useState(null);

  const token = localStorage.getItem("token"); // Check if user is logged in

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [faqs, setFaqs] = useState([]);

  // const faqItems = [
  //   {
  //     question: "How do I reset my password?",
  //     answer:
  //       'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you an email with instructions to create a new password.',
  //   },
  //   {
  //     question: "How can I change my email address?",
  //     answer:
  //       'To change your email address, go to Settings > General > Account Information. Click "Edit" next to your email and follow the verification process.',
  //   },
  //   {
  //     question: "What payment methods do you accept?",
  //     answer:
  //       "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.",
  //   },
  //   {
  //     question: "How do I cancel my subscription?",
  //     answer:
  //       "You can cancel your subscription anytime from Settings > Billing. Your account will remain active until the end of your current billing period.",
  //   },
  //   {
  //     question: "Is my data secure?",
  //     answer:
  //       "Yes, we use enterprise-grade encryption and security measures to protect your data. We are SOC 2 compliant and follow industry best practices.",
  //   },
  // ];

  const supportCategories = [
    {
      icon: User,
      title: "Account & Settings",
      description: "Login problems, profile management, reminders setup",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Settings,
      title: "File & Upload Issues",
      description: "PDF upload errors, storage, and file organization",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Cpu,
      title: "AI Assistance & Features",
      description: "Summaries, quizzes, flashcards, and content extraction",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BookOpen,
      title: "Learning & Productivity Tips",
      description:
        "Guides, study practices, and getting the best out of Recallr",
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleTrackTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/ticket/track-ticket`, trackForm);
      setTrackedTicket(res.data.data);
    } catch (err) {
      console.error("Ticket not found:", err);
      alert("Ticket not found. Please check your email and ticket ID.");
    }
  };

  const fetchFAQS = async () => {
    try {
      const res = await axios.get(`${API_URL}/faqs/get-all-faqs`);
      if (res.status === 200) {
        setFaqs(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };
  const fetchMyTickets = async () => {
    try {
      const token = localStorage.getItem("token"); // assuming you store JWT
      const res = await axios.get(`${API_URL}/ticket/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  useEffect(() => {
    fetchFAQS();
  }, []);

  const filteredFaqItems = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message
      setChatMessages((prev) => [...prev, { text: message, sender: "user" }]);

      // Simulate bot response after a short delay
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            text: "Thanks for your message. Our support team will respond shortly.",
            sender: "bot",
          },
        ]);
      }, 1000);

      setMessage("");
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
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

      if (res.status === 201) {
        toast.success(
          "Your ticket has been created! We'll get back to you soon."
        );
        setContactForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch "My Tickets" if logged in
  useEffect(() => {
    if (token && activeTab === "my-tickets") {
      fetchMyTickets();
    }
  }, [token, activeTab]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Hero Banner */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            How can we help you today?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Search our knowledge base or get in touch with our support team
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, guides, and more..."
              className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
          </motion.div>
        </div>

        {/* Support Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 cursor-pointer hover:shadow-2xl transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tabs for FAQ and Contact */}
        <div className="max-w-3xl mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "faq"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "contact"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Support
            </button>

            {token ? (
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "my-tickets"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("my-tickets")}
              >
                My Tickets
              </button>
            ) : (
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "track-ticket"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("track-ticket")}
              >
                Track Ticket
              </button>
            )}
          </div>

          {activeTab === "faq" && (
            /* FAQ Section */
            <div className="space-y-4">
              {filteredFaqItems.length > 0 ? (
                filteredFaqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
                  >
                    <motion.button
                      whileHover={{
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      }}
                      onClick={() =>
                        setOpenFAQ(openFAQ === index ? null : index)
                      }
                      className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {item.question}
                      </h3>
                      <motion.div
                        animate={{ rotate: openFAQ === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {openFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-gray-500 mt-2">
                    Try different keywords or contact our support team
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            /* Contact Form */
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleContactSubmit}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Send Message
              </button>
            </motion.form>
          )}

          {/* My Tickets (only if logged in) */}
          {activeTab === "my-tickets" && token && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">
                🎫 My Tickets
              </h2>

              {tickets.length > 0 ? (
                <div className="grid gap-4">
                  {tickets.map((t) => (
                    <div
                      key={t._id}
                      className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer"
                    >
                      {/* Ticket Subject */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">
                          {t.subject}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            t.status === "Open"
                              ? "bg-green-100 text-green-700"
                              : t.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>

                      {/* Extra Info */}
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          <span className="font-medium">Ticket ID:</span>{" "}
                          {t._id}
                        </p>
                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border">
                  <p className="text-gray-500">No tickets found.</p>
                </div>
              )}
            </div>
          )}

          {/* Track Ticket (only if NOT logged in) */}
          {activeTab === "track-ticket" && !token && (
            <div>
              <h2 className="text-lg font-bold mb-3">Track Your Ticket</h2>
              <form onSubmit={handleTrackTicket} className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border p-2 rounded"
                  value={trackForm.email}
                  onChange={(e) =>
                    setTrackForm({ ...trackForm, email: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Enter Ticket ID"
                  className="w-full border p-2 rounded"
                  value={trackForm.ticketId}
                  onChange={(e) =>
                    setTrackForm({ ...trackForm, ticketId: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Track
                </button>
              </form>

              {trackedTicket && (
                <div className="mt-4 p-3 border rounded bg-green-50">
                  <p>
                    <strong>Subject:</strong> {trackedTicket.subject}
                  </p>
                  <p>
                    <strong>Status:</strong> {trackedTicket.status}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(trackedTicket.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)",
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-indigo-500/25 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-24 right-8 w-96 h-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Live Support
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-xl p-4 mb-4 overflow-y-auto h-48">
              {chatMessages.length === 0 ? (
                <p className="text-gray-600 text-center py-14">
                  Start a conversation with our support team
                </p>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 ${
                      msg.sender === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-xl"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpSupportPage;
