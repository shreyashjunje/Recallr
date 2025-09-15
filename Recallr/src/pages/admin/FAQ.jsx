import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    faqId: null,
  });
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteClick = (id) => {
    setConfirmModal({ open: true, faqId: id });
  };

  // Fetch FAQs data
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/faqs/get-all-faqs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setFaqs(res.data.data);
        toast.success("FAQs fetched successfully");
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFaq) {
        const res = await axios.put(
          `${API_URL}/faqs/update-faq/${editingFaq._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 200) {
          setFaqs(
            faqs?.map((faq) => (faq._id === editingFaq._id ? res.data : faq))
          );
          toast.success("FAQ updated successfully!");
        }
      } else {
        const res = await axios.post(`${API_URL}/faqs/create-faq`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setFaqs([res.data, ...faqs]);
        toast.success("FAQ created successfully!");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      toast.error(error.response?.data?.message || "Failed to save FAQ");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/faqs/delete-faq/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.status === 200) {
        setConfirmModal({ open: false, faqId: null });
        setFaqs(faqs.filter((faq) => faq._id !== id));

        toast.success("FAQ deleted successfully!");
      }
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
      alert("Failed to delete FAQ. Try again.");
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setIsModalOpen(true);
  };

  // const handleEdit=async (faq)=>{
  //   try{
  //     const res=await axios.put(`${API_URL}/faqs/update-faq/${faq._id}`,formData,{
  //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  //     });



  //   }catch(err){
  //     console.error("Error in handleEdit:", err);
  //   }
  // }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setFormData({ question: "", answer: "", category: "" });
  };

  const toggleExpand = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs?.filter(
    (faq) =>
      faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if screen is mobile
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Manage FAQs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Create and manage frequently asked questions
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={16} className="mr-2" />
          Add FAQ
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </motion.div>

      {/* FAQs Table/Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Loading FAQs...
            </p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            No FAQs found
          </div>
        ) : isMobile ? (
          // Mobile Cards View
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFaqs.map((faq) => (
              <div key={faq._id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                      <button
                        onClick={() => toggleExpand(faq._id)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {expandedFaqs[faq._id] ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {faq.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {(expandedFaqs[faq._id] || windowWidth >= 768) && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {faq.answer}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({ open: true, faqId: faq._id })
                        }
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : isTablet ? (
          // Tablet View - Simplified Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFaqs.map((faq) => (
                  <tr
                    key={faq._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-4 max-w-xs">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {faq.question}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {faq.answer}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(faq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmModal({ open: true, faqId: faq._id })
                          }
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Desktop View - Full Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFaqs.map((faq) => (
                  <tr
                    key={faq._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </p>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {faq.answer}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {faq.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(faq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmModal({ open: true, faqId: faq._id })
                          }
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add/Edit FAQ Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingFaq ? "Edit FAQ" : "Add New FAQ"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Answer
            </label>
            <textarea
              rows={4}
              required
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">-- Select Category --</option>
              <option value="Account & Settings">Account & Settings</option>
              <option value="File & Upload Issues">File & Upload Issues</option>
              <option value="AI Assistance & Features">
                AI Assistance & Features
              </option>
              <option value="Learning & Productivity Tips">
                Learning & Productivity Tips
              </option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingFaq ? "Update FAQ" : "Create FAQ"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Confirm Delete
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              This action is permanent. Are you sure you want to delete this
              FAQ?
            </p>

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, faqId: null })}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-200 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmModal.faqId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg order-1 sm:order-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQs;
