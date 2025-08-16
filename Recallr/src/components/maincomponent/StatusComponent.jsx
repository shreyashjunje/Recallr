import { useState, useEffect } from "react";
import { Construction, Clock, Zap, Star, Rocket, Code } from "lucide-react";
import logo from "../../assets/logoR.png";
// Base component for shared functionality
const StatusPageBase = ({ 
  title, 
  message, 
  estimatedDate, 
  bgGradient,
  borderColor,
  iconColor,
  titleColor,
  textColor,
  IconComponent,
  statusText,
  progress = 65
}) => {
  const [dots, setDots] = useState("");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className={`max-w-md w-full bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg ${borderColor} border-2 p-8 text-center transform hover:scale-105 transition-transform duration-300`}>
        
        {/* Animated Icon */}
        <div className="mb-6 flex justify-center">
          <div className={`${iconColor} p-4 bg-white rounded-full shadow-md animate-pulse`}>
            {/* <IconComponent size={48} />
             */}
             <img src={logo} alt="" width={48} className=""/>
          </div>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold ${titleColor} mb-4`}>
          {title}
        </h1>

        {/* Message with animated dots */}
        <p className={`${textColor} text-lg mb-6 pl-4`}>
          {message}
          <span className="inline-block w-8 text-center">{dots}</span>
        </p>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Clock className={`${iconColor} w-5 h-5`} />
            <span className={`${textColor} font-medium`}>{statusText}</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 shadow-inner">
            <div className={`bg-gradient-to-r ${iconColor.replace('text-', 'from-').replace('-500', '-400')} to-${iconColor.split('-')[1]}-500 h-2 rounded-full animate-pulse`} 
                 style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Estimated Date */}
        {estimatedDate && (
          <div className={`${textColor} text-sm bg-white rounded-lg p-3 shadow-sm`}>
            <strong>Estimated Launch:</strong> {estimatedDate}
          </div>
        )}

        {/* REcallr branding */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Part of <span className="font-semibold text-gray-700">Recallr</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Coming Soon Component - For future features
export const ComingSoon = ({ 
  title = "Coming Soon", 
  message = "We're working hard to bring you this feature!",
  estimatedDate = null,
  progress = 45
}) => {
  return (
    <StatusPageBase
      title={title}
      message={message}
      estimatedDate={estimatedDate}
      progress={progress}
      bgGradient="from-purple-50 to-pink-50"
      borderColor="border-purple-200"
      iconColor="text-purple-500"
      titleColor="text-purple-800"
      textColor="text-purple-600"
      IconComponent={Star}
      statusText="Coming Soon"
    />
  );
};

// Under Construction Component - For pages being rebuilt
export const UnderConstruction = ({ 
  title = "Under Construction", 
  message = "This page is being built from the ground up",
  estimatedDate = null,
  progress = 30
}) => {
  return (
    <StatusPageBase
      title={title}
      message={message}
      estimatedDate={estimatedDate}
      progress={progress}
      bgGradient="from-orange-50 to-yellow-50"
      borderColor="border-orange-200"
      iconColor="text-orange-500"
      titleColor="text-orange-800"
      textColor="text-orange-600"
      IconComponent={Construction}
      statusText="Under Construction"
    />
  );
};

// In Development Component - For features currently being coded
export const InDevelopment = ({ 
  title = "In Development", 
  message = "Our team is actively working on this feature",
  estimatedDate = null,
  progress = 75
}) => {
  return (
    <StatusPageBase
      title={title}
      message={message}
      estimatedDate={estimatedDate}
      progress={progress}
      bgGradient="from-blue-50 to-indigo-50"
      borderColor="border-blue-200"
      iconColor="text-blue-500"
      titleColor="text-blue-800"
      textColor="text-blue-600"
      IconComponent={Code}
      statusText="In Development"
    />
  );
};

// Processing Component - For dynamic content being generated
export const Processing = ({ 
  title = "Processing", 
  message = "We're processing your request",
  estimatedDate = "A few moments",
  progress = 85
}) => {
  return (
    <StatusPageBase
      title={title}
      message={message}
      estimatedDate={estimatedDate}
      progress={progress}
      bgGradient="from-green-50 to-emerald-50"
      borderColor="border-green-200"
      iconColor="text-green-500"
      titleColor="text-green-800"
      textColor="text-green-600"
      IconComponent={Zap}
      statusText="Processing"
    />
  );
};

// Launching Soon Component - For features almost ready
export const LaunchingSoon = ({ 
  title = "Launching Soon", 
  message = "Final touches are being added!",
  estimatedDate = null,
  progress = 95
}) => {
  return (
    <StatusPageBase
      title={title}
      message={message}
      estimatedDate={estimatedDate}
      progress={progress}
      bgGradient="from-red-50 to-pink-50"
      borderColor="border-red-200"
      iconColor="text-red-500"
      titleColor="text-red-800"
      textColor="text-red-600"
      IconComponent={Rocket}
      statusText="Launching Soon"
    />
  );
};

// Demo component showing all variants
const StatusComponentsDemo = () => {
  const [activeComponent, setActiveComponent] = useState("ComingSoon");

  const components = {
    ComingSoon: <ComingSoon title="Analytics Dashboard" message="Advanced reporting features coming your way!" estimatedDate="Q2 2025" />,
    UnderConstruction: <UnderConstruction title="Profile Settings" message="Redesigning the entire settings experience" estimatedDate="March 2025" />,
    InDevelopment: <InDevelopment title="AI Assistant" message="Building intelligent features for REcallr" estimatedDate="April 2025" />,
    Processing: <Processing title="Data Import" message="Processing your uploaded files" />,
    LaunchingSoon: <LaunchingSoon title="Mobile App" message="REcallr mobile is almost here!" estimatedDate="Next Week" />
  };

  return (
    <div className="relative">
      {/* Component Selector */}
      <div className="absolute top-4 left-4 z-10">
        <select 
          value={activeComponent}
          onChange={(e) => setActiveComponent(e.target.value)}
          className="bg-white rounded-lg shadow-md px-3 py-2 border border-gray-200 text-sm"
        >
          <option value="ComingSoon">Coming Soon</option>
          <option value="UnderConstruction">Under Construction</option>
          <option value="InDevelopment">In Development</option>
          <option value="Processing">Processing</option>
          <option value="LaunchingSoon">Launching Soon</option>
        </select>
      </div>

      {components[activeComponent]}
    </div>
  );
};

export default StatusComponentsDemo;