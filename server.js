const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// SQLite setup
const db = new sqlite3.Database("./database.db");

db.run("CREATE TABLE IF NOT EXISTS votes (choice TEXT)");

// API: get results
app.get("/results", (req, res) => {
    db.all("SELECT choice, COUNT(*) as count FROM votes GROUP BY choice", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

    const results = { samsung: 0, iphone: 0, google: 0 };
    rows.forEach(r => results[r.choice] = r.count);

    res.json(results);
    });
});

// API: vote
app.post("/vote", (req, res) => {
    const { choice } = req.body;
    db.run("INSERT INTO votes(choice) VALUES(?)", [choice], err => {
        if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Vote recorded!" });
    });
});

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));