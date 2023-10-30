const nodemailer = require("nodemailer");

const reviewLink = "https://example.com/review"; // Replace with your review link

const emailContent = (
  receiver,
  sender,
  startDate,
  endDate,
  sentAt,
  reason,
  backupContact
) => {
  return `
<h1>Hi ${receiver}</h1>
<p>You have a new pending leave document to review. Please Review it at Syaco Leave Management.</p>
<p>Sender: ${sender}</p>
<p>Date: ${startDate.toLocaleDateString(
    "en-GB"
  )} - ${endDate.toLocaleDateString("en-GB")}</p>
<p>Sent at: ${sentAt.toLocaleString("en-GB")}</p>
<p>Reason: ${reason}</p>
<p>Backup Contact: ${backupContact}</p>
`;
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "syaco.leave.management@gmail.com",
    pass: "gnkc hvsm qjkz ikou",
  },
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: "Syaco Leave Management<syaco.leave.management@gmail.com>",
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendEmail, emailContent };
