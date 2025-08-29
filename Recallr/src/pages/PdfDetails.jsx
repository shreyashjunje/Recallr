import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Heart, 
  Download, 
  Share2, 
  RefreshCw, 
  Trash2,
  Calendar,
  User,
  HardDrive,
  BookOpen,
  Eye,
  Clock,
  Copy,
  FileDown,
  Brain,
  Target,
  CheckCircle,
  XCircle,
  Play,
  BarChart3,
  Tag,
  Folder,
  Info
} from 'lucide-react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import axios from 'axios';
const API_URL=import.meta.env.VITE_API_URL

// interface PDFDetails {
//   id: string;
//   title: string;
//   category: string;
//   tags: string[];
//   description: string;
//   uploadedAt: string;
//   uploadedBy: string;
//   fileSize: string;
//   pagesCount: number;
//   accessCount: number;
//   lastOpenedAt: string;
//   isFavorite: boolean;
//   hasSummary: boolean;
//   hasFlashcards: boolean;
//   hasQuiz: boolean;
//   progress: {
//     completedPercentage: number;
//     currentPage: number;
//     timeSpent: string;
//   };
//   summary?: string;
//   flashcardsCount?: number;
//   quizQuestionsCount?: number;
// }

const mockPDFData= {
  id: '1',
  title: 'Introduction to Machine Learning and Artificial Intelligence',
  category: 'Science',
  tags: ['AI', 'Machine Learning', 'Technology', 'Computer Science', 'Research'],
  description: 'A comprehensive guide covering the fundamentals of machine learning algorithms, neural networks, and their practical applications in modern technology.',
  uploadedAt: '2024-12-10T10:30:00Z',
  uploadedBy: 'Dr. Sarah Johnson',
  fileSize: '15.7 MB',
  pagesCount: 247,
  accessCount: 23,
  lastOpenedAt: '2024-12-15T14:22:00Z',
  isFavorite: true,
  hasSummary: true,
  hasFlashcards: true,
  hasQuiz: false,
  progress: {
    completedPercentage: 68,
    currentPage: 168,
    timeSpent: '4h 32m'
  },
  summary: 'This comprehensive document introduces fundamental concepts in machine learning and artificial intelligence, covering supervised and unsupervised learning, neural networks, deep learning architectures, and their real-world applications across various industries.',
  flashcardsCount: 45,
  quizQuestionsCount: 0
};

const PDFDetailsPage = () => {
    const {id}=useParams();
  const [pdfData, setPdfData] = useState(mockPDFData);
  const [isGenerating, setIsGenerating] = useState(null);
  const [expandedSummary, setExpandedSummary] = useState(false);
  const [pdf,setPdf]=useState({});

  const fetchPdfDetails=async ()=>{
    try{
        const res=await axios.get(`${API_URL}/pdf/pdfs/${id}`)
        console.log("pdf details:",res.data.data)
        if(res.status===200){
            setPdf(res.data?.data)
            toast.success("pdf details fetched successfully")
        }

    }catch(err){
        console.log("Error:",err);
        toast.error(err.message)
    }
  }

  useEffect(()=>{
    fetchPdfDetails();
  },[])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleFavorite = () => {
    setPdfData(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleGenerate = async (type) => {
    setIsGenerating(type);
    // Simulate API call
    setTimeout(() => {
      setPdfData(prev => ({
        ...prev,
        [type === 'summary' ? 'hasSummary' : type === 'flashcards' ? 'hasFlashcards' : 'hasQuiz']: true,
        ...(type === 'flashcards' && { flashcardsCount: 45 }),
        ...(type === 'quiz' && { quizQuestionsCount: 20 })
      }));
      setIsGenerating(null);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* PDF Preview */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl border-2 border-dashed border-blue-200 flex items-center justify-center group hover:from-blue-200 hover:to-indigo-200 transition-all duration-300">
                <FileText size={64} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>

            {/* PDF Information */}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {pdf.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Folder size={16} className="text-gray-500" />
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {pdf.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      pdf.isFavorite 
                        ? 'bg-red-500 text-white shadow-lg hover:bg-red-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={18} className={pdf.isFavorite ? 'fill-current' : ''} />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200">
                    <Download size={18} />
                  </button>
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200">
                    <Share2 size={18} />
                  </button>
                  <button className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-lg">
                    <RefreshCw size={18} />
                  </button>
                  <button className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pdf.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <Tag size={12} className="inline mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">
                    {pdf.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - File Details & Progress */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* File Metadata */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <HardDrive size={20} className="text-blue-500" />
                File Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Uploaded At</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatDate(pdf.uploadedAt)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={16} />
                    <span>Uploaded By</span>
                  </div>
                  <span className="font-medium text-gray-900">{pdf.user?.userName}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <HardDrive size={16} />
                    <span>File Size</span>
                  </div>
                  <span className="font-medium text-gray-900">{pdfData.fileSize} dummy</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen size={16} />
                    <span>Pages</span>
                  </div>
                  <span className="font-medium text-gray-900">{pdfData.pagesCount} dummy</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye size={16} />
                    <span>Access Count</span>
                  </div>
                  <span className="font-medium text-gray-900">{pdfData.accessCount} dummy</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span>Last Opened</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatDate(pdfData.lastOpenedAt)} dummy</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-emerald-500" />
                Reading Progress
              </h2>
              
              <div className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="font-bold text-emerald-600">{pdfData.progress.completedPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${pdfData.progress.completedPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current Page */}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-700 font-medium">Current Page</span>
                    <span className="text-emerald-800 font-bold text-lg">
                      {pdfData.progress.currentPage} / {pdfData.pagesCount}
                    </span>
                  </div>
                </div>

                {/* Time Spent */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-medium">Time Spent</span>
                    <span className="text-blue-800 font-bold text-lg">{pdfData.progress.timeSpent}</span>
                  </div>
                </div>

                {/* Continue Reading Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                  <Play size={18} />
                  Continue Reading
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - AI Features */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Summary Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Brain size={20} className="text-purple-500" />
                  AI Summary
                </h2>
                {pdf.isSummarized ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(pdf.summary || '')}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Copy Summary"
                    >
                      <Copy size={16} />
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors" title="Download as PDF">
                      <FileDown size={16} />
                    </button>
                  </div>
                ) : null}
              </div>
              
              {pdf.isSummarized ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 mb-4">
                    <CheckCircle size={18} />
                    <span className="font-medium">Summary Available</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <p className={`text-gray-700 leading-relaxed ${expandedSummary ? '' : 'line-clamp-3'}`}>
                      {pdf.summary}
                    </p>
                    <button 
                      onClick={() => setExpandedSummary(!expandedSummary)}
                      className="text-blue-600 hover:text-blue-700 font-medium mt-2 transition-colors"
                    >
                      {expandedSummary ? 'Show Less' : 'Read More'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <XCircle size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No summary generated yet</p>
                  <button 
                    onClick={() => handleGenerate('summary')}
                    disabled={isGenerating === 'summary'}
                    className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {isGenerating === 'summary' ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={18} />
                        Generate Summary
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Flashcards & Quiz Section */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Flashcards */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target size={18} className="text-orange-500" />
                  Flashcards
                </h3>
                
                {pdf.isFlashcardGenerated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-4">
                      <CheckCircle size={18} />
                      <span className="font-medium">Ready to Study</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                          {pdf.flashcards?.length}
                        </div>
                        <div className="text-orange-700 font-medium">Cards Available</div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Start Studying
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <XCircle size={40} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No flashcards created</p>
                    <button 
                      onClick={() => handleGenerate('flashcards')}
                      disabled={isGenerating === 'flashcards'}
                      className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {isGenerating === 'flashcards' ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Target size={16} />
                          Generate Flashcards
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Quiz */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Brain size={18} className="text-indigo-500" />
                  Quiz
                </h3>
                
                {pdf.isQuizGenerated ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 mb-4">
                      <CheckCircle size={18} />
                      <span className="font-medium">Quiz Ready</span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-indigo-600 mb-1">
                          {pdf.quizzes.length}
                        </div>
                        <div className="text-indigo-700 font-medium">Questions</div>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Take Quiz
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <XCircle size={40} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">No quiz available</p>
                    <button 
                      onClick={() => handleGenerate('quiz')}
                      disabled={isGenerating === 'quiz'}
                      className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      {isGenerating === 'quiz' ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Brain size={16} />
                          Generate Quiz
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Learning Statistics */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-500" />
                Learning Stats
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {pdf.isSummarized ? '✓' : '—'}
                  </div>
                  <div className="text-blue-700 text-sm font-medium">Summary</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {pdf.isFlashcardGenerated ? pdfData.flashcards?.length : '—'}
                  </div>
                  <div className="text-orange-700 text-sm font-medium">Flashcards</div>
                </div>
                
                <div className="text-center p-4 bg-indigo-50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {pdfData.hasQuiz ? pdfData.quizQuestionsCount : '—'}
                  </div>
                  <div className="text-indigo-700 text-sm font-medium">Quiz Questions</div>
                </div>
                
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">
                    {pdfData.progress.timeSpent}
                  </div>
                  <div className="text-emerald-700 text-sm font-medium">Time Spent</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - AI Learning Features */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Brain size={20} className="text-purple-500" />
                AI Learning Features
              </h2>

              <div className="grid gap-6">
                {/* Feature Status Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    pdf.isSummarized 
                      ? 'border-emerald-200 bg-emerald-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {pdf.isSummarized ? (
                        <CheckCircle size={20} className="text-emerald-600" />
                      ) : (
                        <XCircle size={20} className="text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        pdf.hasSummary ? 'text-emerald-700' : 'text-gray-500'
                      }`}>
                        Summary
                      </span>
                    </div>
                    <p className={`text-sm ${
                      pdfData.hasSummary ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {pdfData.hasSummary ? 'Available' : 'Not Generated'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    pdfData.hasFlashcards 
                      ? 'border-emerald-200 bg-emerald-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {pdf.isFlashcardGenerated ? (
                        <CheckCircle size={20} className="text-emerald-600" />
                      ) : (
                        <XCircle size={20} className="text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        pdfData.hasFlashcards ? 'text-emerald-700' : 'text-gray-500'
                      }`}>
                        Flashcards
                      </span>
                    </div>
                    <p className={`text-sm ${
                      pdfData.hasFlashcards ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {pdfData.hasFlashcards ? `${pdfData.flashcardsCount} Cards` : 'Not Generated'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    pdfData.hasQuiz 
                      ? 'border-emerald-200 bg-emerald-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {pdfData.hasQuiz ? (
                        <CheckCircle size={20} className="text-emerald-600" />
                      ) : (
                        <XCircle size={20} className="text-gray-400" />
                      )}
                      <span className={`font-medium ${
                        pdfData.hasQuiz ? 'text-emerald-700' : 'text-gray-500'
                      }`}>
                        Quiz
                      </span>
                    </div>
                    <p className={`text-sm ${
                      pdfData.hasQuiz ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {pdfData.hasQuiz ? `${pdfData.quizQuestionsCount} Questions` : 'Not Generated'}
                    </p>
                  </div>
                </div>

                {/* Generate All Button */}
                {(!pdf.isSummarized || !pdf.isFlashcardGenerated || !pdf.isQuizGenerated) && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Generate All Learning Materials</h4>
                    <p className="text-gray-600 mb-4">
                      Let our AI analyze your PDF and create comprehensive study materials including summary, flashcards, and quiz questions.
                    </p>
                    <button 
                      disabled={isGenerating !== null}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Brain size={18} />
                          Generate All Materials
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Learning Actions */}
                {(pdf?.isSummarized || pdf?.isFlashcardGenerated || pdf?.isQuizGenerated) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {pdf?.isFlashcardGenerated && (
                      <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <Target size={18} />
                        Study Flashcards
                      </button>
                    )}
                    
                    {pdf?.isQuizGenerated && (
                      <button className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <Brain size={18} />
                        Take Quiz
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDetailsPage;