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

const { optionalAuth, authMiddleware } = require("../middlewares/auth");


router.get("/get-all-tickets",authMiddleware, getAllTickets);//checked
router.post("/create-ticket", optionalAuth, createTicket);//checked
router.get("/get-ticket/:id", getTicketById); //notused 
router.delete("/delete-ticket/:id", deleteTicket); //checked
router.put("/update-ticket/:id", updateTicket); //checked
router.get("/my-tickets", authMiddleware, getMyAllTickets); //checked
router.post("/track-ticket", trackTicket);
router.get("/tickets-weekly", getWeeklyTicketVolume);


module.exports = router;
