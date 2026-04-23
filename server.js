import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import contactHandler from "./api/contact.js";

const app = express();
const port = Number(process.env.PORT || 3000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");

app.use(express.json());

// API routes - MUST come before static files
app.get("/api/contact", async (req, res) => {
  await contactHandler(req, res);
});

app.post("/api/contact", async (req, res) => {
  await contactHandler(req, res);
});

app.put("/api/contact/update", async (req, res) => {
  await contactHandler(req, res);
});

app.delete("/api/contact/delete", async (req, res) => {
  await contactHandler(req, res);
});

// Serve static files
app.use(express.static(distPath));

// Fallback for SPA - serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
