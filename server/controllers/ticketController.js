const Activity = require("../models/Activity");
const Ticket = require("../models/Ticket");
const sendEmail = require("../services/sendEmail");
require("dotenv").config(); // make sure this is at the very top!

const createTicket = async (req, res) => {
  
  try {
    const { subject, message, name, email } = req.body;
    console.log("email:", email);

    let ticketData = { subject, message };
    let finalName, finalEmail;

    if (req.user) {
      ticketData.user = req.user._id;
      finalName = req.user.userName;
      finalEmail = req.user.email;
    } else {
      if (!name || !email) {
        return res
          .status(400)
          .json({ message: "Name and Email are required for guests" });
      }
      ticketData.name = name;
      ticketData.email = email;
      finalName = name;
      finalEmail = email;
    }

    const ticket = await Ticket.create(ticketData);

    await Activity.create({
      action: "ticket_created",
      description: "New ticket created",
      userEmail: email,
      ticketId: ticket._id,
      meta: { subject: subject, status: ticket.status },
    });

    // ✅ Send acknowledgment email (safe)
    try {
      await sendEmail(
        finalEmail,
        `🎫 Ticket Created: ${subject}`,
        `Hi ${finalName},\nYour support ticket ${ticket._id} has been created successfully.`,
        `
          <!-- Your full HTML email template here -->
           <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
      
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 20px; text-align: center; color: #fff;">
        <h1 style="margin: 0; font-size: 22px;">Support Ticket Created</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="margin-top: 0; font-size: 20px; color: #111;">Hi ${name},</h2>
        <p style="font-size: 15px; line-height: 1.6;">
          Thank you for reaching out to us. Your support ticket has been created successfully. 
          Our team will review it and get back to you shortly.
        </p>

        <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-left: 4px solid #4f46e5; border-radius: 6px;">
          <p style="margin: 0; font-size: 15px;">
            <strong>Ticket ID:</strong> <span style="color: #4f46e5;">${ticket._id}</span>
          </p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">
            <strong>Subject:</strong> ${subject}
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          We truly appreciate your patience while we assist you.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin-top: 25px;">
          <a href="https://your-support-portal.com/tickets/${ticket._id}" 
             style="background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 15px; font-weight: bold; display: inline-block;">
            View Your Ticket
          </a>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 13px; color: #777;">
        <p style="margin: 0;">Regards,<br/><strong>Support Team</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
      </div>
    </div>
  </div>
        `
      );
    } catch (emailErr) {
      console.error("Failed to send acknowledgment email:", emailErr.message);
      // Do not fail ticket creation if email fails
    }

    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `📩 New Support Ticket: ${subject}`,
        // plain text fallback
        `New Ticket Received\n\nFrom: ${finalName} (${finalEmail})\nSubject: ${subject}\nMessage: ${message}\nTicket ID: ${ticket._id}\n\nCheck the admin panel for details.`,
        // HTML version
        `
    <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px; color:#333;">
      <div style="max-width:600px; margin:auto; background:#fff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
        
        <div style="background: linear-gradient(135deg, #e11d48, #f97316); padding:20px; text-align:center; color:#fff;">
          <h1 style="margin:0; font-size:22px;">New Support Ticket</h1>
        </div>
        
        <div style="padding:25px;">
          <h2 style="margin-top:0; font-size:18px; color:#111;">Ticket Details</h2>
          <table style="width:100%; border-collapse:collapse; margin-top:10px;">
            <tr>
              <td style="padding:8px; font-weight:bold; width:120px;">From:</td>
              <td style="padding:8px; background:#f9fafb; border-radius:6px;">${finalName} (${finalEmail})</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Subject:</td>
              <td style="padding:8px; background:#f9fafb; border-radius:6px;">${subject}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; vertical-align:top;">Message:</td>
              <td style="padding:12px; background:#f3f4f6; border-radius:6px; line-height:1.5;">
                ${message}
              </td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Ticket ID:</td>
              <td style="padding:8px; background:#f9fafb; border-radius:6px;">${ticket._id}</td>
            </tr>
          </table>

          <div style="text-align:center; margin-top:25px;">
            <a href="https://your-support-portal.com/admin/tickets/${ticket._id}" 
               style="background:#e11d48; color:#fff; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:15px; font-weight:bold; display:inline-block;">
              View Ticket
            </a>
          </div>
        </div>

        <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#777;">
          <p style="margin:0;">This is an automated notification from <strong>Recallr Support System</strong>.</p>
        </div>
      </div>
    </div>
    `
      );
    } catch (err) {
      console.error("Failed to send admin notification email:", err.message);
    }

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTicketById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "user",
      "userName email"
    );
    if (ticket) {
      return res.status(200).json({
        message: "Ticket fetched successfully",
        data: ticket,
      });
    } else {
      return res.status(404).json({ message: "Ticket not found" });
    }
  } catch (err) {
    console.error("Error fetching ticket by ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "userName email");
    return res.status(200).json({
      message: "Tickets fetched successfully",
      data: tickets,
    });
  } catch (err) {
    console.error("Error fetching all tickets:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (deletedTicket) {
      return res.status(200).json({
        message: "Ticket deleted successfully",
        data: deletedTicket,
      });
    } else {
      return res.status(404).json({ message: "Ticket not found" });
    }
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// const updateTicket = async (req, res) => {
//   const { id } = req.params;
//   const { status, useremail, subject, ticketId, message, note } = req.body;

//   console.log("note:", note);
//   console.log("message:", message);
//   console.log("useremail:", useremail);

//   console.log("Update request for ticket ID:", id, "with status:", status);

//   if (!id) {
//     return res.status(400).json({ message: "Ticket ID is required" });
//   }

//   if (!["open", "in-progress", "resolved", "closed"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   try {
//     const ticket = await Ticket.findById(id).populate("user", "name email");
//     if (!ticket) return res.status(404).json({ message: "Ticket not found" });

//     // ✅ Update status
//     ticket.status = status;

//     // ✅ Add note if provided
//     if (note) {
//       ticket.notes.push(note);
//     }

//     // ✅ Add automatic reply
//     const replyMessage = `Your ticket status has been updated to "${status}".`;
//     ticket.replies.push({ sender: "admin", message: replyMessage });

//     await ticket.save();

//     // ✅ Send email notification
//     try {
//       await sendEmail(
//         useremail || ticket.user.email, // fallback if frontend doesn’t send
//         `🎫 Ticket Update: ${subject || ticket.subject}`,
//         `Hi ${ticket.user.name},\nYour support ticket ${
//           ticketId || ticket._id
//         } has been updated.`,
//         `
//         <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
//           <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">

//             <!-- Header -->
//             <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 20px; text-align: center; color: #fff;">
//               <h1 style="margin: 0; font-size: 22px;">Support Ticket Updated</h1>
//             </div>

//             <!-- Body -->
//             <div style="padding: 25px;">
//               <h2 style="margin-top: 0; font-size: 20px; color: #111;">Hi ${
//                 ticket.user.name
//               },</h2>
//               <p style="font-size: 15px; line-height: 1.6;">
//                 Your support ticket has been updated by our support team. Please see the details below:
//               </p>

//               <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-left: 4px solid #4f46e5; border-radius: 6px;">
//                 <p style="margin: 0; font-size: 15px;"><strong>Ticket ID:</strong> <span style="color: #4f46e5;">${
//                   ticketId || ticket._id
//                 }</span></p>
//                 <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;"><strong>Subject:</strong> ${
//                   subject || ticket.subject
//                 }</p>
//                 <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;"><strong>Status:</strong> ${status}</p>
//                 ${
//                   message
//                     ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #555;"><strong>Admin Message:</strong> ${message}</p>`
//                     : ""
//                 }
//               </div>

//               <p style="font-size: 15px; line-height: 1.6;">
//                 You can view the latest updates and respond to your ticket by clicking the button below.
//               </p>

//               <!-- Button -->
//               <div style="text-align: center; margin-top: 25px;">
//                 <a href="https://your-support-portal.com/tickets/${
//                   ticketId || ticket._id
//                 }"
//                   style="background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 15px; font-weight: bold; display: inline-block;">
//                   View Ticket
//                 </a>
//               </div>
//             </div>

//             <!-- Footer -->
//             <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 13px; color: #777;">
//               <p style="margin: 0;">Regards,<br/><strong>Support Team</strong></p>
//               <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
//             </div>
//           </div>
//         </div>
//         `
//       );
//     } catch (emailErr) {
//       console.error("Failed to send ticket update email:", emailErr.message);
//     }

//     res
//       .status(200)
//       .json({ message: "Ticket updated and user notified", ticket });
//   } catch (err) {
//     console.error("Ticket update failed:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { status, useremail, subject, ticketId, message, note } = req.body;
  console.log("useremail:", useremail);
  console.log("ticketId:", ticketId);

  if (!id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const ticket = await Ticket.findById(id).populate("user", "name email");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    let didUpdateStatus = false;

    // ✅ Update status only if provided and actually changed
    if (status) {
      if (!["open", "in-progress", "resolved", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      if (ticket.status !== status) {
        ticket.status = status;
        didUpdateStatus = true;
      }
    }

    // ✅ Add note if provided
    if (note) {
      ticket.notes.push(note);

      // also log it in replies timeline
      ticket.replies.push({
        sender: note.author || "admin",
        message: note.content,
        createdAt: note.createdAt || new Date(),
      });
    }

    // ✅ Add automatic reply if status actually changed
    if (didUpdateStatus) {
      const replyMessage = `Your ticket status has been updated to "${status}".`;
      ticket.replies.push({ sender: "admin", message: replyMessage });
    }

    await ticket.save();

    // await Activity.create({
    //   action: "ticket_updated",
    //   description: "Ticket updated",
    //   userEmail: req.body.useremail || "Admin",
    //   ticketId: ticketId || ticket._id,
    //   // meta: { oldStatus, newStatus },
    // });
    await Activity.create({
      action: "ticket_updated",
      description: "Ticket updated",
      userEmail: req.body.useremail || "Admin",
      ticket: ticket._id, // Mongo ObjectId reference
      ticketCode: ticketId || ticket.ticketId, // custom string
    });

    // ✅ Send email notification (for note or status update)
    if (didUpdateStatus || note) {
      try {
        await sendEmail(
          useremail || ticket.user.email,
          `🎫 Ticket Update: ${subject || ticket.subject}`,
          `Hi ${ticket.user.name},\nYour support ticket ${
            ticketId || ticket._id
          } has been updated.`,
          `
            <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
                <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 20px; text-align: center; color: #fff;">
                  <h1 style="margin: 0; font-size: 22px;">Support Ticket Updated</h1>
                </div>
                <div style="padding: 25px;">
                  <h2 style="margin-top: 0; font-size: 20px; color: #111;">Hi ${
                    ticket.user.name
                  },</h2>
                  <p>Your support ticket has been updated:</p>
                  <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-left: 4px solid #4f46e5; border-radius: 6px;">
                    <p><strong>Ticket ID:</strong> ${ticketId || ticket._id}</p>
                    <p><strong>Subject:</strong> ${
                      subject || ticket.subject
                    }</p>
                    ${
                      didUpdateStatus
                        ? `<p><strong>Status:</strong> ${status}</p>`
                        : ""
                    }
                    ${
                      note
                        ? `<p><strong>Admin Note:</strong> ${note.content}</p>`
                        : ""
                    }
                  </div>
                </div>
              </div>
            </div>
            `
        );
      } catch (emailErr) {
        console.error("Failed to send ticket update email:", emailErr.message);
      }
    }

    res.status(200).json({ message: "Ticket updated", ticket });
  } catch (err) {
    console.error("Ticket update failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getMyAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id });
    return res.status(200).json({
      message: "User's tickets fetched successfully",
      data: tickets,
    });
  } catch (err) {
    console.error("Error fetching user's tickets:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const trackTicket = async (req, res) => {
  try {
    const { email, ticketId } = req.body;
    const ticket = await Ticket.findOne({ _id: ticketId, email });

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const getWeeklyTicketVolume = async (req, res) => {
//   try {
//     const now = new Date();
//     const lastWeek = new Date();
//     lastWeek.setDate(now.getDate() - 6); // last 7 days including today

//     const tickets = await Ticket.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: lastWeek, $lte: now },
//         },
//       },
//       {
//         $group: {
//           _id: { $dayOfWeek: "$createdAt" }, // 1=Sunday, 7=Saturday
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     // Map results into fixed Mon-Sun order
//     const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     const weeklyData = days.map((day, i) => {
//       const dayData = tickets.find((t) => t._id === i + 1);
//       return { day, tickets: dayData ? dayData.count : 0 };
//     });

//     // res.json(weeklyData);
//     res
//       .status(200)
//       .json({ message: "Weekly ticket volume fetched", data: weeklyData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch weekly tickets" });
//   }
// };
const getWeeklyTicketVolume = async (req, res) => {
  try {
    const now = new Date();

    // Choose week start day: 0 = Sunday, 1 = Monday
    const weekStartDay = 1; // 👈 change to 0 if you want Sunday start

    const startOfWeek = new Date(now);
    const day = now.getDay(); // 0=Sunday ... 6=Saturday
    const diff =
      day >= weekStartDay ? day - weekStartDay : 7 - (weekStartDay - day);

    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0); // set to 00:00:00

    // Aggregate tickets within current week
    const tickets = await Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: now },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1=Sunday ... 7=Saturday
          count: { $sum: 1 },
        },
      },
    ]);

    // Fixed order for labels
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyData = days.map((day, i) => {
      const dayData = tickets.find((t) => t._id === i + 1);
      return { day, tickets: dayData ? dayData.count : 0 };
    });

    res
      .status(200)
      .json({ message: "Weekly ticket volume fetched", data: weeklyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch weekly tickets" });
  }
};

module.exports = {
  createTicket,
  getTicketById,
  getAllTickets,
  deleteTicket,
  updateTicket,
  getMyAllTickets,
  trackTicket,
  getWeeklyTicketVolume,
};
