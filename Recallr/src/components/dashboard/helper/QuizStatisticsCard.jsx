import { Award, BarChart2, CheckCircle, RefreshCw, Trophy, Zap, TrendingUp, Calendar, Clock } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const QuizStatisticsCard = ({ stats, loading, isDark = false }) => {
  if (loading) {
    return (
      <div className={`rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-6 border transition-colors duration-300 ${
        isDark 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl text-white shadow-md md:shadow-lg">
            <BarChart2 className="w-4 h-4 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Quiz Performance
            </h3>
            <p className={`text-xs md:text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Your quiz statistics
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center h-32 md:h-40">
          <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-6 border transition-colors duration-300 ${
        isDark 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-gray-100"
      }`}>
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl text-white shadow-md md:shadow-lg">
            <BarChart2 className="w-4 h-4 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className={`text-lg md:text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}>
              Quiz Performance
            </h3>
            <p className={`text-xs md:text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              Your quiz statistics
            </p>
          </div>
        </div>
        <div className="text-center py-6 md:py-8">
          <Award className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 ${
            isDark ? "text-gray-600" : "text-gray-300"
          }`} />
          <p className={`text-sm md:text-base ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            No quiz data available yet
          </p>
          <p className={`text-xs md:text-sm mt-1 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}>
            Complete quizzes to see your statistics
          </p>
        </div>
      </div>
    );
  }

  const formatSeconds = (sec) => {
    if (sec == null) return "-";
    const s = Math.round(sec);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}m ${r}s` : `${r}s`;
  };

  // Prepare data for the performance chart
  const performanceChartData = {
    labels: stats.scoresOverTime?.map((s) => 
      new Date(s.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: "Score",
        data: stats.scoresOverTime?.map((s) => s.score ?? 0) || [],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: isDark 
          ? "rgba(99, 102, 241, 0.2)" 
          : "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: isDark ? "#1f2937" : "#fff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const performanceChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: "Performance Trend",
        font: { size: window.innerWidth < 768 ? 12 : 14, weight: 'bold' },
        color: isDark ? '#e5e7eb' : '#374151',
        padding: { top: 8, bottom: 8 }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f3f4f6' : '#1F2937',
        bodyColor: isDark ? '#d1d5db' : '#4B5563',
        borderColor: isDark ? '#4b5563' : '#E5E7EB',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `Score: ${context.raw}%`;
          }
        }
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        suggestedMax: 100,
        grid: {
          color: isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6B7280',
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6B7280',
          maxRotation: 45,
          font: {
            size: window.innerWidth < 768 ? 10 : 12
          },
          callback: function(value, index) {
            // Show fewer labels on small screens
            if (window.innerWidth < 768) {
              return index % 3 === 0 ? this.getLabelForValue(value) : '';
            }
            return index % 2 === 0 ? this.getLabelForValue(value) : '';
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  // Prepare data for category performance (if available)
  const categoryData = stats.categoryPerformance || [
    { category: "General", score: 75 },
    { category: "Science", score: 82 },
    { category: "History", score: 68 },
    { category: "Mathematics", score: 90 }
  ];

  return (
    <div className={`rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl p-4 md:p-6 border transition-colors duration-300 hover:shadow-xl md:hover:shadow-2xl ${
      isDark 
        ? "bg-gray-800 border-gray-700" 
        : "bg-white border-gray-100"
    }`}>
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl md:rounded-2xl text-white shadow-md md:shadow-lg">
          <BarChart2 className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <div>
          <h3 className={`text-lg md:text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Quiz Performance
          </h3>
          <p className={`text-xs md:text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            Your quiz statistics
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      {stats.scoresOverTime && stats.scoresOverTime.length > 0 && (
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 md:mb-4">
            <h4 className={`font-medium flex items-center gap-1 md:gap-2 text-sm md:text-base ${
              isDark ? "text-gray-200" : "text-gray-900"
            }`}>
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-indigo-600" />
              Performance Over Time
            </h4>
            <div className={`flex items-center text-xs ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              <Calendar className="w-3 h-3 mr-1" />
              Last {stats.scoresOverTime.length} attempts
            </div>
          </div>
          <div className="h-48 sm:h-56 md:h-64">
            <Line data={performanceChartData} options={performanceChartOptions} />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className={`p-3 md:p-4 rounded-lg md:rounded-xl ${
          isDark ? "bg-purple-900/30" : "bg-purple-50"
        }`}>
          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
            <Trophy className={`w-4 h-4 md:w-5 md:h-5 ${
              isDark ? "text-purple-400" : "text-purple-600"
            }`} />
            <span className={`text-xs md:text-sm font-medium ${
              isDark ? "text-purple-300" : "text-purple-800"
            }`}>
              Average Score
            </span>
          </div>
          <p className={`text-xl md:text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {stats.avgScore || 0}%
          </p>
        </div>

        <div className={`p-3 md:p-4 rounded-lg md:rounded-xl ${
          isDark ? "bg-blue-900/30" : "bg-blue-50"
        }`}>
          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
            <CheckCircle className={`w-4 h-4 md:w-5 md:h-5 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`} />
            <span className={`text-xs md:text-sm font-medium ${
              isDark ? "text-blue-300" : "text-blue-800"
            }`}>
              Accuracy
            </span>
          </div>
          <p className={`text-xl md:text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {stats.accuracyPercent || 0}%
          </p>
        </div>

        <div className={`p-3 md:p-4 rounded-lg md:rounded-xl ${
          isDark ? "bg-green-900/30" : "bg-green-50"
        }`}>
          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
            <BarChart2 className={`w-4 h-4 md:w-5 md:h-5 ${
              isDark ? "text-green-400" : "text-green-600"
            }`} />
            <span className={`text-xs md:text-sm font-medium ${
              isDark ? "text-green-300" : "text-green-800"
            }`}>
              Total Attempts
            </span>
          </div>
          <p className={`text-xl md:text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {stats.totalAttempts || 0}
          </p>
        </div>

        <div className={`p-3 md:p-4 rounded-lg md:rounded-xl ${
          isDark ? "bg-orange-900/30" : "bg-orange-50"
        }`}>
          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
            <Zap className={`w-4 h-4 md:w-5 md:h-5 ${
              isDark ? "text-orange-400" : "text-orange-600"
            }`} />
            <span className={`text-xs md:text-sm font-medium ${
              isDark ? "text-orange-300" : "text-orange-800"
            }`}>
              Fastest Time
            </span>
          </div>
          <p className={`text-lg md:text-xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {formatSeconds(stats.fastestAttemptSeconds)}
          </p>
        </div>
      </div>

      {/* Category Performance */}
      {stats.categoryPerformance && stats.categoryPerformance.length > 0 && (
        <div className="mb-4 md:mb-6">
          <h4 className={`font-medium mb-2 md:mb-3 text-sm md:text-base ${
            isDark ? "text-gray-200" : "text-gray-900"
          }`}>
            Performance by Category
          </h4>
          <div className="space-y-2">
            {categoryData.slice(0, window.innerWidth < 768 ? 3 : 4).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-xs md:text-sm truncate mr-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`} style={{maxWidth: '40%'}}>
                  {category.category}
                </span>
                <div className="flex items-center gap-2 flex-1 max-w-48 md:max-w-56">
                  <div className={`w-full rounded-full h-2 ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}>
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium w-6 md:w-8 text-right ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {category.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Attempts */}
      {stats.recentAttempts && stats.recentAttempts.length > 0 && (
        <div>
          <h4 className={`font-medium mb-2 md:mb-3 text-sm md:text-base flex items-center gap-1 md:gap-2 ${
            isDark ? "text-gray-200" : "text-gray-900"
          }`}>
            <Clock className={`w-3 h-3 md:w-4 md:h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            Recent Attempts
          </h4>
          <div className="space-y-2 md:space-y-3">
            {stats.recentAttempts.slice(0, window.innerWidth < 768 ? 2 : 3).map((attempt, index) => (
              <div key={index} className={`flex items-center justify-between p-2 md:p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-gray-50"
              }`}>
                <div className="flex-1 min-w-0 mr-2">
                  <p className={`text-xs md:text-sm font-medium truncate ${
                    isDark ? "text-gray-200" : "text-gray-900"
                  }`}>
                    {attempt.quiz?.title || "Quiz"}
                  </p>
                  <p className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Score: {attempt.score || 0}% • {formatSeconds(attempt.durationSeconds)}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  attempt.score >= 80 
                    ? isDark 
                      ? "bg-green-900/40 text-green-300" 
                      : "bg-green-100 text-green-800"
                    : attempt.score >= 60 
                    ? isDark 
                      ? "bg-yellow-900/40 text-yellow-300" 
                      : "bg-yellow-100 text-yellow-800"
                    : isDark 
                    ? "bg-red-900/40 text-red-300" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {attempt.score || 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Tips */}
      {stats.avgScore && (
        <div className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg md:rounded-xl ${
          isDark ? "bg-indigo-900/30" : "bg-indigo-50"
        }`}>
          <h4 className={`font-medium mb-1 md:mb-2 text-sm md:text-base ${
            isDark ? "text-indigo-200" : "text-indigo-900"
          }`}>
            Improvement Tips
          </h4>
          <ul className={`text-xs space-y-1 ${
            isDark ? "text-indigo-300" : "text-indigo-700"
          }`}>
            {stats.avgScore < 70 && (
              <li>• Focus on weaker categories to improve overall score</li>
            )}
            {stats.accuracyPercent < 75 && (
              <li>• Take more time to read questions carefully</li>
            )}
            {stats.recentAttempts && stats.recentAttempts.length > 2 && (
              <li>• Your consistency is improving - keep it up!</li>
            )}
            <li>• Review incorrect answers to avoid repeating mistakes</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuizStatisticsCard;