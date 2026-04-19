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
    await fs.writeFile(CSV_PATH, "timestamp,name,email,message,status\n", "utf8");
  }
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

async function readContactsCsv() {
  await ensureCsvHeader();
  const csv = await fs.readFile(CSV_PATH, "utf8");
  const rows = csv.split(/\r?\n/).filter((row) => row.trim() !== "");
  const header = rows.shift()?.split(",") || [];

  return rows.map((row) => {
    const values = parseCsvLine(row);
    return header.reduce((acc, key, index) => {
      acc[key.replace(/"/g, "")] = values[index]?.replace(/^"|"$/g, "") || "";
      return acc;
    }, {});
  });
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
  const url = new URL(req.url || "", "http://localhost");
  const query = url.searchParams;

  if (req.method === "GET") {
    try {
      await ensureCsvHeader();
      if (query.get("download") === "csv" || query.get("format") === "csv") {
        const csv = await fs.readFile(CSV_PATH, "utf8");
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
        res.statusCode = 200;
        return res.end(csv);
      }

      const contacts = await readContactsCsv();
      return res.status(200).json({ contacts });
    } catch (error) {
      console.error("Failed to load contact history:", error);
      return res.status(500).json({ error: "Unable to load contact history." });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const timestamp = new Date().toISOString();
  let status = "failed";
  let sendError = null;
  const transporter = createTransporter();

  if (!transporter) {
    sendError = new Error("Email configuration is missing.");
  } else {
    try {
      await transporter.verify();
      const replySubject = process.env.EMAIL_REPLY_SUBJECT || "Thank you for connecting";
      const replyBody = `Hi ${name || "there"},\n\nThank you for connecting with me. I appreciate you reaching out and I look forward to future collaboration.\n\nBest regards,\n${process.env.EMAIL_FROM_NAME || "Saran R K"}`;
      await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "Saran R K"}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: replySubject,
        text: replyBody,
      });
      status = "sent";
    } catch (error) {
      console.error("Failed to send reply email:", error);
      sendError = error;
    }
  }

  const row = [timestamp, name || "", email, message, status].map(escapeCsv).join(",") + "\n";

  try {
    await ensureCsvHeader();
    await fs.appendFile(CSV_PATH, row, "utf8");
  } catch (error) {
    console.error("Failed to store contact:", error);
    return res.status(500).json({ error: "Unable to save contact information." });
  }

  if (sendError) {
    return res.status(500).json({ error: "Contact saved but failed to send reply email." });
  }

  return res.status(200).json({ success: true });
}
