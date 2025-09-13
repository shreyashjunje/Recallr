const express = require("express");
const {
  getAllTickets,
  createTicket,
  getTicketById,
  deleteTicket,
  updateTicket,
  getMyAllTickets,
  trackTicket,
  getWeeklyTicketVolume,
} = require("../controllers/ticketController");
const router = express.Router();

const { protect, authMiddleware } = require("../middlewares/auth");


router.get("/get-all-tickets",authMiddleware, getAllTickets);
router.post("/create-ticket", protect, createTicket);
router.get("/get-ticket/:id", getTicketById);
router.delete("/delete-ticket/:id", deleteTicket);
router.put("/update-ticket/:id", updateTicket);
router.get("/my-tickets", authMiddleware, getMyAllTickets);
router.post("/track-ticket", trackTicket);
router.get("/tickets-weekly", getWeeklyTicketVolume);


module.exports = router;
