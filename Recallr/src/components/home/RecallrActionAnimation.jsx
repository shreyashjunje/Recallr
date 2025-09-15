import React, { useEffect, useState } from 'react';

const RecallrActionAnimation = ({isDark}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const questions = [
    "What is the time complexity of binary search?",
    "Which data structure uses LIFO?",
    "What does CSS stand for?",
    "Which is not a JavaScript framework?",
    "What is React's virtual DOM?"
  ];

  const options = [
    ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    ["Queue", "Stack", "Array", "Tree"],
    ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"],
    ["React", "Vue", "Angular", "Java"],
    ["A lightweight version of DOM", "A database object model", "A browser extension", "A security protocol"]
  ];

  const correctAnswers = [1, 1, 2, 3, 0];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questions.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [questions.length]);

  return (
    <section id="demo" className={`py-12 sm:py-16 lg:py-20 ${isDark ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-blue-50 to-purple-50"} relative overflow-hidden transition-colors duration-500`}>
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: isDark 
                ? `linear-gradient(45deg, ${i % 3 === 0 ? '#1e40af' : i % 3 === 1 ? '#5b21b6' : '#831843'})`
                : `linear-gradient(45deg, ${i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#ec4899'})`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"} mb-3 sm:mb-4 transition-colors duration-300`}>
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">Recallr</span> in Action
          </h2>
          <p className={`text-lg sm:text-xl ${isDark ? "text-gray-300" : "text-gray-600"} transition-colors duration-300`}>
            Clean, intuitive interface designed for focused learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Dashboard Screenshot */}
          <div className={`rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Dashboard
              </h3>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Data Structures", icon: "📊", color: isDark ? "bg-blue-900/30" : "bg-blue-100" },
                  { name: "Web Development", icon: "💻", color: isDark ? "bg-green-900/30" : "bg-green-100" },
                  { name: "Machine Learning", icon: "🤖", color: isDark ? "bg-purple-900/30" : "bg-purple-100" },
                  { name: "UI Design", icon: "🎨", color: isDark ? "bg-pink-900/30" : "bg-pink-100" },
                ].map((topic, i) => (
                  <div key={i} className={`${topic.color} p-4 rounded-xl transition-all duration-300 hover:shadow-md ${isDark ? "hover:bg-opacity-50" : ""}`}>
                    <div className="text-2xl mb-2 animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                      {topic.icon}
                    </div>
                    <div className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      {topic.name}
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {Math.floor(Math.random() * 10) + 1} PDFs
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-6 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Storage Usage</span>
                  <span className="text-sm font-medium text-blue-500">65%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                    style={{width: '65%'}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary View Screenshot */}
          <div className={`rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                AI Summary
              </h3>
            </div>
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center animate-pulse ${isDark ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20" : "bg-gradient-to-r from-blue-100 to-purple-100"}`}>
                  <svg className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className={`text-sm font-medium mb-2 flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Key Points:
                  </div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${isDark ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30" : "bg-gradient-to-r from-blue-100 to-purple-100"}`}
                          style={{ width: `${100 - i * 15}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3">
                  <div className={`text-sm font-medium mb-2 flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                    <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                    Insights:
                  </div>
                  <div className={`p-3 rounded-lg border-l-4 border-yellow-400 animate-pulse ${isDark ? "bg-yellow-900/20" : "bg-yellow-50"}`}>
                    <div className={`h-2 rounded-full w-4/5 mb-2 ${isDark ? "bg-yellow-800/40" : "bg-yellow-100"}`}></div>
                    <div className={`h-2 rounded-full w-3/5 ${isDark ? "bg-yellow-800/40" : "bg-yellow-100"}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Interface Screenshot */}
          <div className={`rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Interactive Quiz
              </h3>
              <div className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs text-white flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                Live
              </div>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Question <span className="font-medium">{currentQuestion + 1}</span> of {questions.length}
                  </div>
                  <div className="text-xs font-medium text-blue-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    0:45
                  </div>
                </div>
                <div className={`w-full rounded-full h-1.5 mb-4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className={`text-sm font-medium mb-4 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                  {questions[currentQuestion]}
                </div>
                <div className="space-y-2">
                  {options[currentQuestion].map((option, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl text-sm flex items-center transition-all duration-300 ${
                        i === correctAnswers[currentQuestion] 
                          ? `${isDark ? "bg-green-900/30 border-green-700" : "bg-green-100 border-green-200"} border shadow-md transform scale-105` 
                          : `${isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"} hover:shadow-sm`
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        i === correctAnswers[currentQuestion] 
                          ? "border-green-500 bg-green-50" 
                          : isDark ? "border-gray-600" : "border-gray-300"
                      }`}>
                        {i === correctAnswers[currentQuestion] && (
                          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className={isDark ? "text-gray-200" : "text-gray-800"}>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`flex justify-between pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <button className={`text-xs flex items-center transition-colors ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-800"}`}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                  </svg>
                  Flag Question
                </button>
                <button className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:shadow-md transition-shadow">
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecallrActionAnimation;