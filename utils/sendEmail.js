import transporter from "../config/mail.js";

const sendEmail = async ({ to, subject, message }) => {
  try {
    const mailOptions = {
      from: `"Unicode App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
