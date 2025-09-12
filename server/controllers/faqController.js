const  FAQ  = require("../models/FAQ");

const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });

    if (!faqs) {
      return res.status(404).json({ message: "No FAQs found" });
    }

    res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      data: faqs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new FAQ
const createFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!question || !answer || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFAQ = await FAQ.create({ question, answer, category });
    res.status(201).json({ message: "FAQ created successfully", faq: newFAQ });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update an existing FAQ
const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer, category } = req.body;

  try {
    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.category = category || faq.category;

    const updatedFAQ = await faq.save();
    res
      .status(200)
      .json({ message: "FAQ updated successfully", faq: updatedFAQ });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an FAQ
const deleteFAQ = async (req, res) => {
  const { id } = req.params;

  try {
    const faq = await FAQ.findById(id);
    if (!faq) return res.status(404).json({ message: "FAQ not found" });

    await faq.remove();
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getAllFAQs, createFAQ, updateFAQ, deleteFAQ   };
