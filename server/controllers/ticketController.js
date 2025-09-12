const Ticket = require("../models/Ticket");
const sendEmail = require("../services/sendEmail");
require("dotenv").config(); // make sure this is at the very top!

// const createTicket = async (req, res) => {
//   try {
//     const { subject, message, name, email } = req.body;

//     let ticketData = {
//       subject,
//       message,
//     };

//     if (req.user) {
//       // logged-in user
//       ticketData.user = req.user._id;
//     } else {
//       // guest user
//       if (!name || !email) {
//         return res
//           .status(400)
//           .json({ message: "Name and Email are required for guests" });
//       }
//       ticketData.name = name;
//       ticketData.email = email;
//     }

//     const ticket = await Ticket.create(ticketData);

//     // ✅ Send acknowledgment email
//     await sendEmail(
//       email,
//       `🎫 Ticket Created: ${subject}`,
//       `
//   <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #333;">
//     <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">

//       <!-- Header -->
//       <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 20px; text-align: center; color: #fff;">
//         <h1 style="margin: 0; font-size: 22px;">Support Ticket Created</h1>
//       </div>

//       <!-- Body -->
//       <div style="padding: 25px;">
//         <h2 style="margin-top: 0; font-size: 20px; color: #111;">Hi ${name},</h2>
//         <p style="font-size: 15px; line-height: 1.6;">
//           Thank you for reaching out to us. Your support ticket has been created successfully.
//           Our team will review it and get back to you shortly.
//         </p>

//         <div style="margin: 20px 0; padding: 15px; background: #f3f4f6; border-left: 4px solid #4f46e5; border-radius: 6px;">
//           <p style="margin: 0; font-size: 15px;">
//             <strong>Ticket ID:</strong> <span style="color: #4f46e5;">${ticket._id}</span>
//           </p>
//           <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">
//             <strong>Subject:</strong> ${subject}
//           </p>
//         </div>

//         <p style="font-size: 15px; line-height: 1.6;">
//           We truly appreciate your patience while we assist you.
//         </p>

//         <!-- Button -->
//         <div style="text-align: center; margin-top: 25px;">
//           <a href="https://your-support-portal.com/tickets/${ticket._id}"
//              style="background: #4f46e5; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-size: 15px; font-weight: bold; display: inline-block;">
//             View Your Ticket
//           </a>
//         </div>
//       </div>

//       <!-- Footer -->
//       <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 13px; color: #777;">
//         <p style="margin: 0;">Regards,<br/><strong>Support Team</strong></p>
//         <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
//       </div>
//     </div>
//   </div>
//   `
//     );

//     res.status(201).json({
//       message: "Ticket created successfully",
//       ticket,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createTicket = async (req, res) => {
  try {
    const { subject, message, name, email } = req.body;

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
const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { name, email, subject, message, status } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Ticket ID is required" });
  }

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      {
        name,
        email,
        subject,
        message,
        status,
      },
      { new: true }
    );

    if (updatedTicket) {
      return res.status(200).json({
        message: "Ticket updated successfully",
        data: updatedTicket,
      });
    } else {
      return res.status(404).json({ message: "Ticket not found" });
    }
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ message: "Server error" });
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

module.exports = {
  createTicket,
  getTicketById,
  getAllTickets,
  deleteTicket,
  updateTicket,
  getMyAllTickets,
  trackTicket,
};
