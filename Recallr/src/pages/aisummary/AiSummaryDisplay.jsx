import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  Share2,
  Copy,
  Download,
  BookOpen,
  Star,
  Calendar,
  Tag,
  Bookmark,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";

const API_URL = import.meta.env.VITE_API_URL;

const AiSummaryDisplay = () => {
  const { id } = useParams();
  const pdfRef = useRef();

  const location = useLocation();
  const summary = location.state?.summary;

  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [summaryinfo, setSummaryinfo] = useState({});

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/summary/get-summary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setSummaryinfo(res.data.data);
        toast.success("Summary fetched successfully");
      }
    } catch (err) {
      toast.error("Failed to fetch summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleFavorite = () => setIsFavorite(!isFavorite);

  const handleCopy = async () => {
    if (!summaryinfo?.summary) return;
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

  // const handlePDFDownload = () => {
  //   const element = pdfRef.current;
  //   const options = {
  //     margin: 0.3,
  //     filename: "summary.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  //   };

  //   html2pdf().set(options).from(element).save();
  // };
  // const handlePDFDownload = () => {
  //   const doc = new jsPDF();

  //   // Title
  //   doc.setFontSize(18);
  //   doc.text(`${summaryinfo.title}`, 10, 15);

  //   // Section: Summary
  //   doc.setFontSize(14);
  //   doc.text("Summary:", 10, 30);
  //   doc.setFontSize(12);
  //   doc.text(summaryinfo.summary, 10, 40, { maxWidth: 180 });

  //   // Section: Key Points
  //   doc.setFontSize(14);
  //   doc.text("Key Points:", 10, 80);

  //   doc.setFontSize(12);
  //   summaryinfo.keyPoints.forEach((point, index) => {
  //     doc.text(`• ${point}`, 12, 90 + index * 10, { maxWidth: 180 });
  //   });

  //   // Save PDF
  //   doc.save("summary.pdf");
  // };
  const handlePDFDownload = () => {
    const element = pdfRef.current;
    const options = {
      margin: 0.3,
      filename: "mern-roadmap.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base">
              <ArrowLeft size={18} />
              <span>Back to Summaries</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite
                    ? "bg-red-100 text-red-600 scale-110"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
              <button
                onClick={handlePDFDownload}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div ref={pdfRef}>
          {/* Title Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-4">
              {summaryinfo.title}
            </h1>
            <div className="flex lg:flex-col lg:items-start flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>
                  {summaryinfo.uploadedAt &&
                    new Date(summaryinfo.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bookmark className="text-blue-600" size={14} />
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                  {summaryinfo.category}
                </span>
              </div>
              {summaryinfo?.tags?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="text-slate-500" size={14} />
                  <div className="flex flex-wrap gap-2">
                    {summaryinfo.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-600" size={18} />
              Summary
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {summaryinfo.summary?.map((para, i) => (
                <p
                  key={i}
                  className="text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 lg:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="text-amber-500" size={18} />
              Key Points
            </h2>
            <div className="space-y-3">
              {summaryinfo?.keyPoints?.map((kp, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl ${
                    kp.important
                      ? "bg-amber-50 border-l-4 border-amber-400"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      kp.important ? "bg-amber-500" : "bg-slate-400"
                    }`}
                  />
                  <p className="text-slate-700 text-sm sm:text-base lg:text-lg flex-1">
                    {kp.point}
                  </p>
                  {kp.important && (
                    <span className="hidden sm:inline px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Important
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleFavorite}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
                isFavorite
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 text-sm sm:text-base"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <button
            onClick={handlePDFDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
          >
            <Download size={16} />
            Export as PDF
          </button>
        </div>
      </main>
    </div>
  );
};

export default AiSummaryDisplay;
