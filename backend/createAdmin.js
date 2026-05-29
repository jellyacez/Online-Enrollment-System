const pool = require("./config/db");
const bcrypt = require("bcrypt");

const createAdmin = async () => {
  try {
    const email = "admin@example.com";
    const password = "password123";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Delete existing admin if exists to avoid conflicts
    await pool.query("DELETE FROM users WHERE email = ?", [email]);

    // Insert new admin
    await pool.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      ["System Admin", email, hashedPassword, "admin"],
    );

    console.log(`Admin user created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
