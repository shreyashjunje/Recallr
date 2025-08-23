import React, { useState } from "react";
import {
  Heart,
  Share2,
  Copy,
  Download,
  BookOpen,
  Star,
  Calendar,
  User,
  Tag,
  Bookmark,
  ArrowLeft,
  Check,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { useLocation, useParams } from "react-router";

const AiSummaryDisplay = () => {
  const { id } = useParams(); // <-- this will give you _id from URL
  const location = useLocation(); 
  const summary = location.state?.summary; // <-- this will give you the passed object

  console.log("id from URL:", id);
  console.log("summary from state:", summary); 

  console.log("summary::::->",summary.data)
  const summaryinfo=summary.data;
  console.log("title:",summaryinfo.title)



  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Sample data - replace with your actual data
  const summaryData = {
    title: "The Future of Artificial Intelligence in Healthcare",
    category: "Technology",
    tags: [
      "AI",
      "Healthcare",
      "Machine Learning",
      "Medical Technology",
      "Innovation",
    ],
    dateCreated: "2024-01-15",
    author: "Dr. Sarah Johnson",
    readTime: "8 min read",
    summary: [
      "Artificial Intelligence is revolutionizing healthcare by enabling faster diagnosis, personalized treatment plans, and improved patient outcomes through advanced data analysis and pattern recognition.",
      "Machine learning algorithms are being deployed across various medical specialties, from radiology to oncology, helping doctors make more accurate decisions and reducing human error in critical situations.",
      "The integration of AI in healthcare systems promises to reduce costs, improve efficiency, and make quality healthcare more accessible to underserved populations worldwide.",
    ],
    keyPoints: [
      {
        point:
          "AI-powered diagnostic tools can detect diseases 90% faster than traditional methods",
        important: true,
      },
      {
        point:
          "Machine learning models analyze medical images with 95% accuracy",
        important: true,
      },
      {
        point:
          "Predictive analytics help prevent medical emergencies before they occur",
        important: false,
      },
      {
        point: "Natural language processing streamlines medical documentation",
        important: false,
      },
      {
        point:
          "Robotic surgery systems enhance precision and reduce recovery time",
        important: true,
      },
      {
        point: "AI chatbots provide 24/7 patient support and triage services",
        important: false,
      },
      {
        point:
          "Drug discovery processes accelerated by 50% using AI algorithms",
        important: true,
      },
    ],
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleCopy = async () => {
    const textToCopy = `${
      summaryinfo.title
    }\n\nSummary:\n${summaryinfo.summary.join(
      "\n\n"
    )}\n\nKey Points:\n${summaryinfo.keyPoints
      .map((kp) => `• ${kp.point}`)
      .join("\n")}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this summary: ${summaryinfo.title}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      default:
        handleCopy();
    }
    setShowShareMenu(false);
  };

  const handlePDFDownload = () => {
    // In a real implementation, you'd use a PDF generation library
    alert(
      "PDF download feature would be implemented here using libraries like jsPDF or Puppeteer"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Summaries</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite
                    ? "bg-red-100 text-red-600 scale-110"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <Share2 size={20} />
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      Share on LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      Share on Facebook
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleCopy}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleCopy}
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors relative"
              >
                {copied ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <Copy size={20} />
                )}
              </button>
              <button
                onClick={handlePDFDownload}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
                {summaryinfo.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {/* <div className="flex items-center gap-1">
                  <BookOpen  size={16} />
                  <span>{summaryinfo.category}</span>
                </div> */}
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>
                    {new Date(summaryinfo.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{summaryData.readTime}</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Category and Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Bookmark className="text-blue-600" size={16} />
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {summaryinfo.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="text-slate-500" size={16} />
              <div className="flex flex-wrap gap-2">
                {summaryinfo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <BookOpen className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
          </div>
          <div className="space-y-4">
            {summaryinfo.summary.map((paragraph, index) => (
              <p key={index} className="text-slate-700 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Key Points Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
              <Star className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Key Points</h2>
          </div>
          <div className="space-y-3">
            {summaryinfo.keyPoints.map((keyPoint, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-200 ${
                  keyPoint.important
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400"
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    keyPoint.important ? "bg-amber-500" : "bg-slate-400"
                  }`}
                />
                <p className="text-slate-700 leading-relaxed">
                  {keyPoint.point}
                </p>
                {keyPoint.important && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Important
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isFavorite
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
            </div>
            <button
              onClick={handlePDFDownload}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Download size={18} />
              Export as PDF
            </button>
          </div>
        </div>

        {/* Copy Success Toast */}
        {copied && (
          <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Check size={18} />
            Copied to clipboard!
          </div>
        )}
      </main>
    </div>
  );
};

export default AiSummaryDisplay;
