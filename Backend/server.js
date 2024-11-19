const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // To allow cross-origin requests
app.use(bodyParser.json()); // To parse JSON data from the frontend

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Default username for XAMPP
  password: "", // Default password for XAMPP is empty
  database: "soen287project", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Route to handle form submission
//admin_ID	Image	Company_Name	Address	Email	Number	Desc_Title	Description	Twitter	Instagram	Linkedi
app.post("/submit", (req, res) => {
  const {
    image, // Add file upload handling logic here later
    company_name,
    address,
    email,
    number,
    desc_title,
    description,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  const sql = `
        INSERT INTO page 
        (Image, Company_Name, Address, Email, Number, Desc_Title, Description, Twitter, Instagram, Linkedin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    image,
    company_name,
    address,
    email,
    number,
    desc_title,
    description,
    twitter,
    instagram,
    linkedin,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Failed to save data.");
      return;
    }
    res.send("Data saved successfully!");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});