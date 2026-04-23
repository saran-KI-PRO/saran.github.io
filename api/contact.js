import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "contacts.json");

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify([]), "utf8");
  }
}

async function readContacts() {
  await ensureDbFile();
  const data = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(data || "[]");
}

async function saveContact(contact) {
  await ensureDbFile();
  const contacts = await readContacts();
  contacts.push({
    ...contact,
    timestamp: new Date().toISOString(),
  });
  await fs.writeFile(DB_PATH, JSON.stringify(contacts, null, 2), "utf8");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const contacts = await readContacts();
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ contacts });
    } catch (error) {
      console.error("Failed to load contacts:", error);
      return res.status(500).json({ error: "Unable to load contacts." });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  try {
    await saveContact({ name: name || "", email, message });
    return res.status(200).json({ success: true, message: "Contact saved successfully." });
  } catch (error) {
    console.error("Failed to save contact:", error);
    return res.status(500).json({ error: "Unable to save contact." });
  }
}
