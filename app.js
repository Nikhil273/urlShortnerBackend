const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortid = require("shortid");
const URL = require("./models/url");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3001",  // You can specify the frontend origin here
  methods: "GET,POST",              // Allow only GET and POST methods
  allowedHeaders: "Content-Type",   // Allow only Content-Type header
}));
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads




mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a short URL
  app.post("/shorten", async (req, res) => {
  console.log("Request Body:", req.body); // Check if data is coming through
  const { long_url } = req.body;
  const short_code = shortid.generate();
  const newURL = new URL({ long_url, short_code });
  
  try {
    await newURL.save();
    res.json({ short_url: `http://localhost:3000/${short_code}` });
  } catch (err) {
    console.error("Error while saving to DB:", err);
    res.status(500).json({ error: "An error occurred while creating the short URL." });
  }
});


// Redirect to the original URL
app.get("/:short_code", async (req, res) => {
  const { short_code } = req.params;

  try {
    const url = await URL.findOne({ short_code });

    if (url) {
      return res.redirect(url.long_url);
    } else {
      return res.status(404).json({ error: "Short URL not found" });
    }
  } catch (err) {
    console.error("Error finding URL:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// Start the server
app.listen( process.env.PORT||3000, () => {
  console.log("Server running on http://localhost:3000");
});
