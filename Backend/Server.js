import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import validUrl from "valid-url";
import { pool } from "./db.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "*" // replace "*" with your frontend URL in production
}));
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

// Create a new link
app.post("/api/links", async (req, res) => {
  try {
    const { target_url, code } = req.body;

    if (!target_url || !validUrl.isWebUri(target_url)) {
      return res.status(400).json({ error: "Invalid target URL" });
    }

    let shortCode = code || Math.random().toString(36).substring(2, 8);

    const existing = await pool.query("SELECT * FROM links WHERE code = $1", [shortCode]);
    if (existing.rows.length > 0) return res.status(409).json({ error: "Code exists" });

    const result = await pool.query(
      "INSERT INTO links (code, target_url, clicks, last_clicked) VALUES ($1, $2, $3, $4) RETURNING *",
      [shortCode, target_url, 0, null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all links
app.get("/api/links", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get total links count
app.get("/api/total-links", async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM links");
    res.json({ total: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single link stats
app.get("/api/links/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a link
app.delete("/api/links/:code", async (req, res) => {
  try {
    const { code } = req.params;
    await pool.query("DELETE FROM links WHERE code = $1", [code]);
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect short code
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const result = await pool.query("SELECT * FROM links WHERE code = $1", [code]);
    if (result.rows.length === 0) return res.status(404).send("Not found");

    const link = result.rows[0];
    await pool.query(
      "UPDATE links SET clicks = clicks + 1, last_clicked = NOW() WHERE code = $1",
      [code]
    );

    res.redirect(302, link.target_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Render port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
