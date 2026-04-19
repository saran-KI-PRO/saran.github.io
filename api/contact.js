import { promises as fs } from "fs";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const CSV_PATH = process.env.CONTACT_STORE_PATH || path.join(process.cwd(), "contacts.csv");

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

async function ensureCsvHeader() {
  try {
    await fs.access(CSV_PATH);
  } catch {
    await fs.writeFile(CSV_PATH, "timestamp,name,email,message\n", "utf8");
  }
}

function createTransporter() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 465),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const timestamp = new Date().toISOString();
  const row = [timestamp, name || "", email, message].map(escapeCsv).join(",") + "\n";

  try {
    await ensureCsvHeader();
    await fs.appendFile(CSV_PATH, row, "utf8");
  } catch (error) {
    console.error("Failed to store contact:", error);
    return res.status(500).json({ error: "Unable to save contact information." });
  }

  const transporter = createTransporter();
  if (!transporter) {
    return res.status(500).json({ error: "Email configuration is missing. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS." });
  }

  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error("SMTP verification failed:", verifyError);
    return res.status(500).json({ error: "Email server configuration is invalid. Check SMTP settings." });
  }

  const replySubject = process.env.EMAIL_REPLY_SUBJECT || "Thank you for connecting";
  const replyBody = `Hi ${name || "there"},\n\nThank you for connecting with me. I appreciate you reaching out and I look forward to future collaboration.\n\nBest regards,\n${process.env.EMAIL_FROM_NAME || "Saran R K"}`;

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Saran R K"}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: replySubject,
      text: replyBody,
    });
  } catch (error) {
    console.error("Failed to send reply email:", error);
    return res.status(500).json({ error: "Contact saved but failed to send reply email." });
  }

  return res.status(200).json({ success: true });
}
