
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Ensure the upload directory exists
    }
    cb(null, uploadDir); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Generate a unique filename
  },
});

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
    SELECT id, Company_Name, Address, Email, Number, Desc_Title, Description, Twitter, Instagram, Linkedin, 
           Image_Path 
    FROM page;
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

  // Check if an image was uploaded
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  // Base query for INSERT
  let sql = `
    INSERT INTO page (id, Image_Path, Company_Name, Address, Email, Number, Desc_Title, Description, Twitter, Instagram, Linkedin)
    VALUES (0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
  `;

  // Dynamic UPDATE clause
  const updates = [];
  const values = [
    imagePath, // Save the relative path to the image
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

  if (imagePath) updates.push("Image_Path = VALUES(Image_Path)");
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


// handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // user exists + the password matches
  const sql = "SELECT * FROM customers WHERE Username = ? AND Password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
      return;
    }

    if (results.length > 0) {
      // user found 
      res.json({ success: true, message: "Login successful!", user: results[0] });
    } else {
      // invalid username or password
      res.status(401).json({ success: false, message: "Invalid credentials." });
    }
  });
});

// user registration
app.post("/register", (req, res) => {
  const { full_name, birthdate, email, address, username, password, confirm_password } = req.body;

  // password match
  if (password !== confirm_password) {
    res.status(400).json({ success: false, message: "Passwords do not match." });
    return;
  }

  // insert a new user
  const sql = `
    INSERT INTO customers (Name, DOB, Email, Address, Username, Password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [full_name, birthdate, email, address, username, password],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          // already exists
          res.status(409).json({ success: false, message: "Username or email already exists." });
        } else {
          console.error("Error during registration:", err);
          res.status(500).json({ success: false, message: "Internal server error." });
        }
        return;
      }
console.log("Registration successful!");
      // successful reg
      res.json({ success: true, message: "Registration successful!" });
    }
  );
});

