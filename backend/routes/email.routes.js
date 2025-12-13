// backend/routes/emailRoute.js
const express = require("express");
const nodemailer = require("nodemailer");

const {transporter}  = require('../config/emailConfig')

const router = express.Router();


// sendEmail function
const sendEmail = async ({ to, subject, text, html }) => {
  try {
   
    const info = await transporter.sendMail({
      from: '"HealthMate AI" <projectemail500023@gmail.com>',
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("Email send error:", err);
    return false;
  }
};

// Single test route
router.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;
   console.log(message)

  if (!to || !subject )
    return res.status(400).json({ success: false, message: "Missing fields" });
  
  const success = await sendEmail({
    to,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  });


  if (success) {
    res.json({ success: true, message: "Email sent successfully" });
  } else {
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;


