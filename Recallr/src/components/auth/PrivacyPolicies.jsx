import React from 'react';
import { ChevronLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PrivacyPolicy() {
    const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            {/* Left Side - Content */}
            <div className="w-2/3 p-12">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-semibold text-gray-800">Your Logo</span>
              </div>

              {/* Back Button */}
              <button onClick={()=>navigate("/register")} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors">
                <ChevronLeft size={16} />
                <span className="text-sm">Back to home</span>
              </button>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: August 31, 2025</p>
              </div>

              {/* Content */}
              <div className="space-y-8 max-w-none">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We collect information you provide directly to us, such as when you create an account, 
                    make a purchase, or contact us for support. This may include:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Personal identification information (name, email address, phone number)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Payment and billing information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Usage data and preferences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Device and browser information</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We use the information we collect to provide, maintain, and improve our services. Specifically, we use your information to:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Provide and deliver the products and services you request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Process transactions and send you related information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Send you technical notices, updates, security alerts, and support messages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Respond to your comments, questions, and customer service requests</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                    except as described in this policy. We may share your information in the following circumstances:
                  </p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>With service providers who assist us in operating our website and conducting our business</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>When required by law or to respond to legal process</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>To protect our rights, property, or safety, or that of others</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic 
                    storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You have the right to access, update, or delete your personal information. You may also opt out of certain 
                    communications from us. To exercise these rights, please contact us using the information provided below.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                    privacy policy on this page and updating the "Last updated" date.
                  </p>
                </section>
              </div>

              {/* Contact Section */}
              <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <Lock className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Questions?</h3>
                    <p className="text-gray-700 mb-2">
                      We're committed to protecting your privacy. If you have any questions or concerns, please contact us.
                    </p>
                    <a href="mailto:privacy@yourcompany.com" className="text-green-600 hover:text-green-800 font-medium">
                      privacy@yourcompany.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="w-1/3 bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-12">
              <div className="relative">
                <div className="relative w-64 h-80">
                  {/* Privacy Shield */}
                  <div className="absolute top-16 left-8">
                    <div className="w-24 h-28 bg-green-500 rounded-lg relative shadow-lg">
                      <div className="absolute inset-4 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Data Database */}
                  <div className="absolute top-8 right-4">
                    <div className="w-20 h-16 bg-blue-600 rounded-lg relative shadow-lg">
                      <Database className="absolute inset-0 m-auto w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* User Icon */}
                  <div className="absolute bottom-20 left-4">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <UserCheck className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Eye Privacy Icon */}
                  <div className="absolute bottom-8 right-8">
                    <div className="w-14 h-14 bg-gray-600 rounded-lg flex items-center justify-center shadow-lg transform rotate-6">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Data Flow Lines */}
                  <div className="absolute top-24 left-16">
                    <div className="w-16 h-1 bg-green-400 rounded transform rotate-45"></div>
                  </div>

                  <div className="absolute top-32 right-12">
                    <div className="w-12 h-1 bg-blue-400 rounded transform -rotate-45"></div>
                  </div>

                  <div className="absolute bottom-24 left-12">
                    <div className="w-20 h-1 bg-purple-400 rounded transform rotate-12"></div>
                  </div>

                  {/* Privacy Badge */}
                  <div className="absolute bottom-4 left-16">
                    <div className="w-12 h-8 bg-yellow-400 rounded-lg shadow-md flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-800">SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Help Center</a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}