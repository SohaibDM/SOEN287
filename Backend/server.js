const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { isMap } = require("util/types");
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
/*
const ser = {
  service_ID: 1,
  Title: "web programming",
  Category: "coding",
  Price: 289,
  Availability: 2,
  Image: "https://images.unsplash.com/photo-1732194094697-b7ef66fa2c9d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
 }; 
 const insert_ser = 'INSERT INTO services (service_ID,Title,Category,Price,Availability,Image) VALUES (?,?,?,?,?,?)';

 db.query(insert_ser, [ser.service_ID, ser.Title, ser.Category, ser.Price, ser.Availability, ser.Image], (error, results) => {
  if(error){
    console.error('Error inserting bought service: ', error);
  }
  else{
    console.log('bought service added successfully! ', results);
  }
});
*/
app.get("/Frontend/account-settings/:customer_ID", (req, res) => {
  const userId = req.params.customer_ID; // Use the ID passed in the URL
  console.log("Received customer_ID:", userId);
  const query = "SELECT Username, Name, Email, DOB, payment FROM customers WHERE customer_ID = ?";
  const query_order = "SELECT service_ID, isPaid, purchaseDate FROM bought_services WHERE customer_ID = ?";
  const query_service = "SELECT * FROM services WHERE service_ID = ?"; // Query for full service details

  // Fetch customer details
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error accessing customer: ', err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.length > 0) {
        // Fetch bought services
        db.query(query_order, [userId], (err2, result2) => {
          if (err2) {
            console.error('Error accessing the bought services:', err2);
            res.status(500).send("Internal Server Error");
          } else {
            if (result2.length > 0) {
              const serviceIds = result2.map((service) => service.service_ID); // Extract all service IDs

              // Fetch full service info for bought services
              db.query(query_service, [serviceIds], (err3, result3) => {
                if (err3) {
                  console.error('Error accessing service details:', err3);
                  res.status(500).send("Internal Server Error");
                } else {
                  res.json({
                    customer: result[0],
                    boughtServices: result2,
                    serviceDetails: result3,
                  });
                }
              });
            } else {
              res.json({
                customer: result[0],
                boughtServices: [],
                serviceDetails: [],
                message: "You did not buy any services yet!",
              });
            }
          }
        });
      } else {
        res.json({
          customer: { Username: 'Guest', Name: "N/A", Email: "N/A", DOB: "N/A", payment: "N/A" },
          boughtServices: [],
          serviceDetails: [],
        });
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
