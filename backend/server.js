const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const setupDatabase = require("./config/setup");
const pool = require("./config/db");

setupDatabase()
  .then(() => {
    console.log("Server ready");
  })
  .catch((err) => {
    console.error(err);
  });

// Existing Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/sections", require("./routes/sectionRoutes"));
app.use("/api/enrollments", require("./routes/enrollmentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/audit", require("./routes/auditRoutes"));

// New route to count audit logs for the dashboard <---
app.get("/api/audit-logs/count", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as total FROM audit_logs");
    res.json({ total: rows[0].total });
  } catch (error) {
    console.error("Error fetching audit logs count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/active-users/count", async (req, res) => {
  try {
    // Counts unique user_ids that have an audit log entry in the last 15 minutes.
    const [rows] = await pool.query(`
            SELECT COUNT(DISTINCT user_id) as total 
            FROM audit_logs 
            WHERE created_at >= NOW() - INTERVAL 15 MINUTE
        `);
    res.json({ total: rows[0].total });
  } catch (error) {
    console.error("Error fetching active users count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Online Enrollment System API is running");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
