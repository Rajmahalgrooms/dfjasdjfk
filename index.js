const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const upload = multer();

// ENV vars (set in Railway/Render/Vercel dashboard)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "YOUR_TOKEN";
const CHAT_ID = process.env.CHAT_ID || "YOUR_CHAT_ID";

// Allow CORS for your frontend domain
app.use(cors({
  origin: ['https://your-frontend-domain.netlify.app', 'http://localhost:8888']
}));

app.post("/uploadVideo", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).send("No video uploaded");
  try {
    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("video", req.file.buffer, {
      filename: "girlfriend_day_recording.webm",
      contentType: req.file.mimetype
    });
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendVideo`,
      { method: "POST", body: formData, headers: formData.getHeaders() }
    );
    if (!response.ok) {
      console.error(await response.text());
      return res.status(500).send("Telegram API error");
    }
    res.send("Video sent to Telegram!");
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
