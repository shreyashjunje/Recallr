import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/ticket/get-all-tickets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.status === 200) {
        setTickets(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;

    try {
      const payload = {
        status: selectedTicket.status,
        useremail: selectedTicket.user?.email,
        subject: selectedTicket.subject,
        ticketId: selectedTicket.ticketId,
        message: newNote?.trim() ? newNote : "Status updated",
        ...(newNote?.trim() && {
          note: {
            content: newNote,
            author: "admin",
            createdAt: new Date().toISOString(),
          },
        }),
      };

      const res = await axios.put(
        `${API_URL}/ticket/update-ticket/${selectedTicket._id}`,
        payload,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSelectedTicket(res.data.ticket);
      setTickets((prev) =>
        prev.map((t) => (t._id === res.data.ticket._id ? res.data.ticket : t))
      );

      setNewNote("");
      setIsModalOpen(false);
      toast.success("Ticket updated successfully!");
    } catch (err) {
      console.error("Ticket update failed:", err);
      toast.error("Failed to update ticket. Try again.");
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedTicket) return;
    try {
      const note = {
        content: newNote.trim(),
        author: "admin",
        createdAt: new Date().toISOString(),
      };

      const res = await axios.put(
        `${API_URL}/ticket/update-ticket/${selectedTicket._id}`,
        {
          status: selectedTicket.status,
          useremail: selectedTicket.user?.email,
          subject: selectedTicket.subject,
          ticketId: selectedTicket.ticketId,
          message: "New note added",
          note,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setSelectedTicket(res.data.ticket);
      setTickets((prev) =>
        prev.map((t) => (t._id === res.data.ticket._id ? res.data.ticket : t))
      );

      setNewNote("");
      toast.success("Note added successfully!");
    } catch (err) {
      console.error("Failed to add note:", err);
      toast.error("Failed to add note. Try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Clock size={16} className="text-yellow-500" />;
      case "in-progress":
        return <AlertCircle size={16} className="text-blue-500" />;
      case "closed":
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage customer support tickets
          </p>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </motion.div>

      {/* Tickets - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden"
      >
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto rounded-full"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Loading tickets...
            </p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tickets found
          </div>
        ) : (
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {["Ticket ID", "Subject", "Status", "Email", "User", "Created", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase text-xs"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredTickets.map((ticket) => (
                  <motion.tr
                    key={ticket._id}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-3 font-medium text-blue-600">
                      {ticket.ticketId}
                    </td>
                    <td className="px-6 py-3">{ticket.subject}</td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      {getStatusIcon(ticket.status)}
                      {ticket.status}
                    </td>
                    <td className="px-6 py-3">{ticket.user?.email}</td>
                    <td className="px-6 py-3">{ticket.user?.userName}</td>
                    <td className="px-6 py-3">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleViewTicket(ticket)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        <div className="grid gap-4 p-4 md:hidden">
          {filteredTickets.map((ticket) => (
            <motion.div
              key={ticket._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">
                  {ticket.ticketId}
                </span>
                <button
                  onClick={() => handleViewTicket(ticket)}
                  className="text-blue-600"
                >
                  <Eye size={16} />
                </button>
              </div>
              <p className="mt-1 text-gray-900 dark:text-white font-medium">
                {ticket.subject}
              </p>
              <p className="text-sm text-gray-500">{ticket.user?.email}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                {getStatusIcon(ticket.status)}
                <span>{ticket.status}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Ticket Details - ${selectedTicket?.ticketId}`}
            size="xl"
          >
            {selectedTicket && (
              <div className="space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Subject</label>
                    <p className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                      {selectedTicket.subject}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) =>
                        setSelectedTicket({
                          ...selectedTicket,
                          status: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-700"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">User</label>
                    <p className="p-2 rounded bg-gray-50 dark:bg-gray-700">
                      {selectedTicket.user?.userName} (
                      {selectedTicket.user?.email})
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <div className="p-3 rounded bg-gray-50 dark:bg-gray-700">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Internal Notes
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {selectedTicket.notes?.map((note, index) => (
                      <div
                        key={note._id || index}
                        className="p-3 rounded bg-gray-100 dark:bg-gray-800"
                      >
                        <div className="flex justify-between text-xs text-gray-500">
                          <span className="font-medium">{note.author}</span>
                          <span>
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{note.content}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Add internal note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleUpdateTicket}
                    className="bg-blue-600 text-white"
                  >
                    Update Ticket
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tickets;
