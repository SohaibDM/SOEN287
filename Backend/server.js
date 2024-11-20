const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json()); 

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

app.post("/submit", (req, res) => {
  const {
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
    title,
    description,
    twitter,
    instagram,
    linkedin,
  ];

  console.log(values)

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Failed to save data.");
      return;
    }
    res.send("Data saved successfully!");
  });
});

app.get("/pages", (req, res) => {
  const sql = "SELECT * FROM page";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Failed to retrieve data.");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});