import React from 'react';
import { ChevronLeft, Shield, FileText, Scale } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function TermsOfService() {
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
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                <p className="text-gray-600">Last updated: August 31, 2025</p>
              </div>

              {/* Content */}
              <div className="space-y-8 max-w-none">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These terms of service may be updated from time to time without notice. Your continued use of the service 
                    constitutes acceptance of any changes to these terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Use License</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Permission is granted to temporarily download one copy of the materials on our website for personal, 
                    non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">Under this license you may not:</p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>modify or copy the materials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>use the materials for any commercial purpose or for any public display</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>attempt to reverse engineer any software contained on the website</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>remove any copyright or other proprietary notations from the materials</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                    You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You agree not to disclose your password to any third party and to take sole responsibility for any activities 
                    or actions under your account, whether or not you have authorized such activities or actions.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Prohibited Uses</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">You may not use our service:</p>
                  <ul className="space-y-2 text-gray-700 ml-6">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>for any unlawful purpose or to solicit others to perform such acts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>to infringe upon or violate our intellectual property rights or the intellectual property rights of others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Disclaimer</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, 
                    and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions 
                    of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitations of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    In no event shall our company or its suppliers be liable for any damages (including, without limitation, 
                    damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                    to use the materials on our website, even if we or our authorized representative has been notified orally 
                    or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on 
                    implied warranties, or limitations of liability for consequential or incidental damages, these limitations 
                    may not apply to you.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Termination</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, 
                    under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at legal@yourcompany.com
                  </p>
                </section>
              </div>

              {/* Contact Section */}
              <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                    <p className="text-gray-700 mb-2">
                      If you have any questions about these terms, please don't hesitate to reach out.
                    </p>
                    <a href="mailto:legal@yourcompany.com" className="text-blue-600 hover:text-blue-800 font-medium">
                      legal@yourcompany.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="w-1/3 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-12">
              <div className="relative">
                <div className="relative w-64 h-80">
                  {/* Legal Document */}
                  <div className="absolute top-12 left-8">
                    <div className="w-36 h-48 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div className="w-20 h-2 bg-blue-600 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-2 bg-gray-200 rounded"></div>
                          <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                          <div className="w-full h-2 bg-gray-200 rounded"></div>
                          <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-4 space-y-1">
                          <div className="w-full h-1 bg-gray-100 rounded"></div>
                          <div className="w-4/5 h-1 bg-gray-100 rounded"></div>
                          <div className="w-full h-1 bg-gray-100 rounded"></div>
                          <div className="w-3/5 h-1 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Legal Scale */}
                  <div className="absolute bottom-16 left-4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                      <Scale className="w-8 h-8 text-gray-700" />
                    </div>
                  </div>

                  {/* Shield with Checkmark */}
                  <div className="absolute top-8 right-8">
                    <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Floating Legal Icons */}
                  <div className="absolute bottom-8 right-12">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md transform -rotate-6">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="absolute top-32 left-2">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Signature Line */}
                  <div className="absolute bottom-32 right-4">
                    <div className="w-24 h-8 bg-white rounded border border-gray-300 shadow-sm">
                      <div className="h-full flex items-end p-1">
                        <div className="w-full h-1 bg-blue-600 rounded"></div>
                      </div>
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
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
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