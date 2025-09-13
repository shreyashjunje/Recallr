import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  CheckCircle,
  Clock,
  HelpCircle,
  PlusCircle,
  Edit,
  BookOpen,
  LogIn,
  LogOut,
  StickyNote,
  Trash2,
  AlertCircle,
} from "lucide-react";

import StatCard from "@/components/admin/StatCard";
import TicketChart from "@/components/admin/TicketChart";
import { toast } from "react-toastify";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    closedTickets: 0,
    pendingTickets: 0,
    totalFaqs: 0,
  });

  const [tickets, setTickets] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalTickets: 1247,
        openTickets: 87,
        closedTickets: 1089,
        pendingTickets: 71,
        totalFaqs: 156,
      });
    }, 500);
  }, []);

  const ticketsByStatus = [
    {
      name: "Open",
      value: tickets.filter((ticket) => ticket.status === "open").length,
      color: "#3B82F6",
    },
    {
      name: "in-progress",
      value: tickets.filter((ticket) => ticket.status === "in-progress").length,
      color: "#F59E0B",
    },
    {
      name: "Closed",
      value: tickets.filter((ticket) => ticket.status === "closed").length,
      color: "#10B981",
    },
    {
      name: "Resolved",
      value: tickets.filter((ticket) => ticket.status === "resolved").length,
      color: "#8B5CF6",
    },
  ];

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API_URL}/ticket/get-all-tickets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 200) setTickets(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch tickets. Please try again later.");
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API_URL}/faqs/get-all-faqs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 200) setFaqs(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch FAQs. Please try again later.");
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const res = await axios.get(`${API_URL}/ticket/tickets-weekly`);
      if (res.status === 200) setWeeklyData(res.data.data);
    } catch (err) {
      console.error("Error fetching weekly data", err);
    }
  };

  const fetchActivityLog = async () => {
    try {
      const res = await axios.get(`${API_URL}/activity/get-activity-log`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.status === 200) setActivityLog(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch activity log. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchFaqs();
    fetchWeeklyData();
    fetchActivityLog();
  }, []);

  const getActivityIcon = (action) => {
    switch (action) {
      case "ticket_created":
        return <PlusCircle className="w-5 h-5 text-blue-500" />;
      case "ticket_updated":
        return <Edit className="w-5 h-5 text-yellow-500" />;
      case "ticket_resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "ticket_in_progress":
        return <Clock className="w-5 h-5 text-purple-500" />;
      case "faq_created":
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case "faq_updated":
        return <Edit className="w-5 h-5 text-indigo-500" />;
      case "user_login":
        return <LogIn className="w-5 h-5 text-emerald-500" />;
      case "user_logout":
        return <LogOut className="w-5 h-5 text-red-500" />;
      case "note_added":
        return <StickyNote className="w-5 h-5 text-pink-500" />;
      case "faq_deleted":
      case "ticket_deleted":
        return <Trash2 className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const statCards = [
    {
      title: "Total Tickets",
      value: tickets.length,
      icon: Ticket,
      color: "blue",
    },
    {
      title: "Open Tickets",
      value: tickets.filter((ticket) => ticket.status === "open").length,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Closed Tickets",
      value: tickets.filter((ticket) => ticket.status === "closed").length,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Total FAQs",
      value: faqs.length,
      icon: HelpCircle,
      color: "blue",
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-2">
          Overview of your admin panel statistics
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            index={index}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="w-full overflow-x-auto">
        <TicketChart ticketsByStatus={ticketsByStatus} weeklyData={weeklyData} />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3 max-h-[350px] overflow-y-auto">
          {activityLog?.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              {/* Left side: Icon + Text */}
              <div className="flex items-center space-x-3">
                {getActivityIcon(activity?.action)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity?.description || activity?.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity?.userEmail || activity?.user || "System"}
                  </p>
                </div>
              </div>

              {/* Right side: Time */}
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {new Date(activity.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
