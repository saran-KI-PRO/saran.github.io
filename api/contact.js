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

async function saveContacts(contacts) {
  await fs.writeFile(DB_PATH, JSON.stringify(contacts, null, 2), "utf8");
}

async function saveContact(contact) {
  await ensureDbFile();
  const contacts = await readContacts();
  const id = Date.now().toString();
  contacts.push({
    id,
    ...contact,
    timestamp: new Date().toISOString(),
  });
  await saveContacts(contacts);
}

async function updateContact(updatedContact) {
  const contacts = await readContacts();
  const index = contacts.findIndex((c) => c.id === updatedContact.id);
  if (index === -1) {
    throw new Error("Contact not found");
  }
  contacts[index] = { ...updatedContact, timestamp: contacts[index].timestamp };
  await saveContacts(contacts);
}

async function deleteContact(id) {
  const contacts = await readContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) {
    throw new Error("Contact not found");
  }
  await saveContacts(filtered);
}

export default async function handler(req, res) {
  // GET - retrieve all contacts
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

  // POST - create new contact
  if (req.method === "POST") {
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

  // PUT - update existing contact
  if (req.method === "PUT") {
    const contact = req.body;

    if (!contact.id || !contact.email || !contact.message) {
      return res.status(400).json({ error: "ID, email, and message are required." });
    }

    try {
      await updateContact(contact);
      return res.status(200).json({ success: true, message: "Contact updated successfully." });
    } catch (error) {
      console.error("Failed to update contact:", error);
      return res.status(error.message === "Contact not found" ? 404 : 500).json({ error: error.message });
    }
  }

  // DELETE - delete a contact
  if (req.method === "DELETE") {
    const id = req.query?.id || new URL(req.url || "", "http://localhost").searchParams.get("id");

    if (!id) {
      return res.status(400).json({ error: "ID is required." });
    }

    try {
      await deleteContact(id);
      return res.status(200).json({ success: true, message: "Contact deleted successfully." });
    } catch (error) {
      console.error("Failed to delete contact:", error);
      return res.status(error.message === "Contact not found" ? 404 : 500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
