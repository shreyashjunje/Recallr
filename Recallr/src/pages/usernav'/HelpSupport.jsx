import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, MessageCircle, User, CreditCard, Settings, HelpCircle } from 'lucide-react';

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  const faqItems = [
    {
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. We\'ll send you an email with instructions to create a new password.'
    },
    {
      question: 'How can I change my email address?',
      answer: 'To change your email address, go to Settings > General > Account Information. Click "Edit" next to your email and follow the verification process.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription anytime from Settings > Billing. Your account will remain active until the end of your current billing period.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade encryption and security measures to protect your data. We are SOC 2 compliant and follow industry best practices.'
    }
  ];

  const supportCategories = [
    {
      icon: User,
      title: 'Account Issues',
      description: 'Login problems, account settings, profile management',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Settings,
      title: 'Technical Support',
      description: 'Bug reports, performance issues, feature requests',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: CreditCard,
      title: 'Billing & Payments',
      description: 'Subscription, invoices, payment methods',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HelpCircle,
      title: 'General Questions',
      description: 'Product information, getting started, best practices',
      color: 'from-orange-500 to-red-500'
    }
  ];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
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
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
              >
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between transition-colors duration-200"
                >
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
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
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
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
            className="fixed bottom-24 right-8 w-96 h-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Live Support</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="flex-1 bg-gray-50/50 rounded-xl p-4 mb-4 h-64">
              <p className="text-gray-600 text-center py-20">
                Start a conversation with our support team
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-2 rounded-xl"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpSupportPage;