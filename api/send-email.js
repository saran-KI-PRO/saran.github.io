import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 465),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, subject, text } = req.body || {};

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing email payload" });
  }

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Portfolio"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
