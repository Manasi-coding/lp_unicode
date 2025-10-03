// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Unicode App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: message,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email sending failed:", err.message);
    throw new Error("Email could not be sent");
  }
};
