// src/components/QuizStatistics.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Line } from "react-chartjs-2";
import {
  Trophy,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight,
  Award,
  Zap
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

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

const formatSeconds = (sec) => {
  if (sec == null) return "-";
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
};

export default function QuizStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API_URL}/quiz/quiz-stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!mounted) return;

        setStats(res.data);
      } catch (err) {
        if (!mounted) return;

        setError(err.response?.data?.error || err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Quiz Statistics</h2>
          <p className="text-gray-500">We're gathering your performance data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Something Went Wrong</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  const labels = stats.scoresOverTime.map((s) =>
    new Date(s.date).toLocaleDateString()
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Score",
        data: stats.scoresOverTime.map((s) => s.score ?? 0),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { 
        display: true, 
        text: "Performance Trend",
        font: { size: 16, weight: 'bold' },
        color: '#374151'
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
          color: '#6B7280'
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            Quiz Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your learning progress and performance metrics</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 px-6 font-medium border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`py-3 px-6 font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard 
            title="Total Quizzes" 
            value={stats.totalAttempts} 
            icon={<Trophy className="w-6 h-6" />}
            gradient="from-blue-500 to-cyan-500"
            trend={{ value: 12.3, positive: true }}
          />
          <StatCard 
            title="Average Score" 
            value={`${stats.avgScore}%`} 
            icon={<Target className="w-6 h-6" />}
            gradient="from-green-500 to-emerald-500"
            trend={{ value: 5.7, positive: true }}
          />
          <StatCard 
            title="Accuracy" 
            value={`${stats.accuracyPercent}%`} 
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-purple-500 to-indigo-500"
            trend={{ value: 3.2, positive: true }}
          />
          <StatCard 
            title="Fastest Attempt" 
            value={formatSeconds(stats.fastestAttemptSeconds)} 
            icon={<Zap className="w-6 h-6" />}
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Performance Over Time
              </h2>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                Last 30 days
              </div>
            </div>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Progress Summary
            </h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quizzes Completed</span>
                  <span className="font-medium text-gray-900">{stats.totalAttempts}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-cyan-500 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(stats.totalAttempts / 50 * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Goal: 50 quizzes</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-medium text-gray-900">{stats.avgScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${stats.avgScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Target: 80% or higher</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Accuracy Rate</span>
                  <span className="font-medium text-gray-900">{stats.accuracyPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-500 h-2.5 rounded-full" 
                    style={{ width: `${stats.accuracyPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Industry benchmark: 75%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent attempts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Recent Quiz Attempts
            </h2>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {stats.recentAttempts.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No quiz attempts yet</h3>
              <p className="text-gray-500">Complete your first quiz to see statistics here.</p>
              <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Take a Quiz
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correct</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentAttempts.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(a.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${a.score >= 80 ? 'bg-green-100 text-green-800' : a.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {a.score ?? 0}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900 font-medium">{a.correct ?? 0}</span>
                        <span className="text-gray-500">/{a.totalQuestions ?? 0}</span>
                      </td>
                      <td className="py-4 px-4">
                        {formatSeconds(
                          a.durationSeconds ??
                            (a.startedAt && a.completedAt
                              ? (new Date(a.completedAt) - new Date(a.startedAt)) /
                                1000
                              : null)
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Strengths</h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Consistency improved by 15% last month
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Speed increased by 20% on recent quizzes
                </li>
              </ul>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Areas to Improve</h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                  Focus on advanced topics for higher scores
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                  Practice time management on longer quizzes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, trend }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? "-"}</p>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${trend.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}%
          </span>
          <span className="text-gray-500 text-xs ml-2">from last week</span>
        </div>
      )}
    </div>
  );
}