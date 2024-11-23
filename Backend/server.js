const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "soen287project",
});


db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database.");
});


app.get("/Frontend/account-settings/:customer_ID", (req, res) => {
  const userId = req.params.customer_ID; // Use the ID passed in the URL
  const query = "SELECT Username, Name, Email, DOB, payment FROM customers WHERE customer_ID = ?";
  
  db.query(query, [userId], (err, result) => {
    if (err){
      console.error('Error accessing customer: ', err);
      res.status(500).send("Internal Server Error");
    }
    else{
      if (result.length > 0) {
        res.json(result[0]); // Return all fields
      } else {
        res.json({ Username: 'Guest',Name: "N/A", Email: "N/A", DOB: "N/A", payment: "N/A",}); // Fallback if user not found
      }
    }
  });
});


app.get("/data", (req, res) => {
  const sql = `
    SELECT * FROM page
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Failed to fetch data.");
      return;
    }
    res.send(result);
  });
});

app.post("/submit", upload.single("image"), (req, res) => {
  const {
    company_name,
    address,
    email,
    number,
    title,
    description,
    twitter,
    instagram,
    linkedin,
  } = req.body;
  const image = req.file ? req.file.buffer : null;

  // Base query for INSERT
  let sql = `
    INSERT INTO page (id, Image, Company_Name, Address, Email, Number, Desc_Title, Description, Twitter, Instagram, Linkedin)
    VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
  `;

  // Dynamic UPDATE clause
  const updates = [];
  const values = [
    image,
    company_name,
    address,
    email,
    number,
    title,
    description,
    twitter,
    instagram,
    linkedin,
  ];

  if (image !== null) updates.push("Image = VALUES(Image)");
  if (company_name) updates.push("Company_Name = VALUES(Company_Name)");
  if (address) updates.push("Address = VALUES(Address)");
  if (email) updates.push("Email = VALUES(Email)");
  if (number) updates.push("Number = VALUES(Number)");
  if (title) updates.push("Desc_Title = VALUES(Desc_Title)");
  if (description) updates.push("Description = VALUES(Description)");
  if (twitter) updates.push("Twitter = VALUES(Twitter)");
  if (instagram) updates.push("Instagram = VALUES(Instagram)");
  if (linkedin) updates.push("Linkedin = VALUES(Linkedin)");

  // Combine updates into the query
  sql += updates.join(", ");

  // Execute the query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting or updating data:", err);
      res.status(500).send("Failed to save data.");
      return;
    }
    res.send("Data saved or updated successfully!");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
