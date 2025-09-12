const express = require("express");
const {
  getAllTickets,
  createTicket,
  getTicketById,
  deleteTicket,
  updateTicket,
  getMyAllTickets,
  trackTicket,
} = require("../controllers/ticketController");
const router = express.Router();

const { protect, authMiddleware } = require("../middlewares/auth");

router.get("/get-all-tickets", getAllTickets);
router.post("/create-ticket", protect, createTicket);
router.get("/get-ticket/:id", getTicketById);
router.delete("/delete-ticket/:id", deleteTicket);
router.put("/update-ticket/:id", updateTicket);
router.get("/my-tickets", authMiddleware, getMyAllTickets);
router.post("/track-ticket", trackTicket);

module.exports = router;
