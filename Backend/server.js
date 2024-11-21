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

  const sql = `
    INSERT INTO page
    (id, Image, Company_Name, Address, Email, Number, Desc_Title, Description, Twitter, Instagram, Linkedin)
    VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      Image = VALUES(Image),
      Company_Name = VALUES(Company_Name),
      Address = VALUES(Address),
      Email = VALUES(Email),
      Number = VALUES(Number),
      Desc_Title = VALUES(Desc_Title),
      Description = VALUES(Description),
      Twitter = VALUES(Twitter),
      Instagram = VALUES(Instagram),
      Linkedin = VALUES(Linkedin)
  `;

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
