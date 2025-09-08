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

const QuizStatisticsCard = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Quiz Performance</h3>
            <p className="text-gray-600 text-sm">Your quiz statistics</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Quiz Performance</h3>
            <p className="text-gray-600 text-sm">Your quiz statistics</p>
          </div>
        </div>
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No quiz data available yet</p>
          <p className="text-gray-400 text-sm mt-1">
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
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        font: { size: 14, weight: 'bold' },
        color: '#374151',
        padding: { top: 10, bottom: 10 }
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
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
          color: 'rgba(229, 231, 235, 0.5)'
        },
        ticks: {
          color: '#6B7280',
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
          color: '#6B7280',
          maxRotation: 0,
          callback: function(value, index) {
            // Show only every other label to prevent crowding
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
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg">
          <BarChart2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Quiz Performance</h3>
          <p className="text-gray-600 text-sm">Your quiz statistics</p>
        </div>
      </div>

      {/* Performance Chart */}
      {stats.scoresOverTime && stats.scoresOverTime.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Performance Over Time
            </h4>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              Last {stats.scoresOverTime.length} attempts
            </div>
          </div>
          <div className="h-64">
            <Line data={performanceChartData} options={performanceChartOptions} />
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Average Score</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.avgScore || 0}%</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.accuracyPercent || 0}%</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">Total Attempts</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalAttempts || 0}</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Fastest Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatSeconds(stats.fastestAttemptSeconds)}
          </p>
        </div>
      </div>

      {/* Category Performance */}
      {/* <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Performance by Category</h4>
        <div className="space-y-2">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{category.category}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${category.score}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700 w-8">{category.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Recent Attempts */}
      {stats.recentAttempts && stats.recentAttempts.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Recent Attempts
          </h4>
          <div className="space-y-3">
            {stats.recentAttempts.slice(0, 3).map((attempt) => (
              <div key={attempt.quiz._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attempt.quiz?.title || "Quiz"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Score: {attempt.score || 0}% • {formatSeconds(attempt.durationSeconds)}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  attempt.score >= 80 
                    ? "bg-green-100 text-green-800" 
                    : attempt.score >= 60 
                    ? "bg-yellow-100 text-yellow-800" 
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
      {/* <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
        <h4 className="font-medium text-indigo-900 mb-2">Improvement Tips</h4>
        <ul className="text-xs text-indigo-700 space-y-1">
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
      </div> */}
    </div>
  );
};

export default QuizStatisticsCard;