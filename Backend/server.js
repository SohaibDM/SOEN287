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
app.use(
  "/serviceImages",
  express.static(path.join(__dirname, "serviceImages"))
);





const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Ensure the upload directory exists
    }

    // Delete all files in the 'uploads' folder before saving the new file
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        console.error("Error reading uploads directory:", err);
        cb(err, uploadDir);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(uploadDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", filePath, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      });
      cb(null, uploadDir);
    });
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


// Configure storage specifically for service images
const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "serviceImages");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // Ensure the directory exists
    }
    cb(null, uploadDir); // Save files in 'serviceImages'
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Generate a unique filename
  },
});

// Use the updated storage configuration for service uploads
const serviceUpload = multer({ storage: serviceStorage });

// Correct the middleware in the '/addService' route
app.post("/addService", serviceUpload.single("serviceImage"), (req, res) => {
  const {
    serviceName,
    category,
    price,
    originalPrice,
    availability,
    description,
  } = req.body;

  // Check if an image was uploaded
  const imagePath = req.file ? `/serviceImages/${req.file.filename}` : null;

  // SQL query to insert the service details
  const sql = `
    INSERT INTO services (Title, Category, Price, originalPrice, Availability, Description, Image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Values to be inserted
  const values = [
    serviceName,
    category,
    price,
    originalPrice,
    availability,
    description,
    imagePath,
  ];

  // Execute the query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Failed to add the service.");
      return;
    }
    res.send("Service added successfully!");
  });
});



app.get("/services", (req, res) => {
  const sql = `
    SELECT service_ID, Title, Category, Price, originalPrice, Availability, Image
    FROM services;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching services:", err);
      res.status(500).send("Failed to fetch services.");
      return;
    }
    res.json(result); // Send the result as a JSON response
  });
});


app.delete("/deleteService/:id", (req, res) => {
  const serviceId = req.params.id;

  // Step 1: Get the image path for the service
  const selectQuery = `
    SELECT Image FROM services WHERE service_ID = ?;
  `;

  db.query(selectQuery, [serviceId], (err, result) => {
    if (err) {
      console.error("Error fetching service:", err);
      res.status(500).send("Failed to fetch service details.");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Service not found.");
      return;
    }

    const imagePath = result[0].Image;

    // Step 2: Delete the image file if it exists
    if (imagePath) {
      const absolutePath = path.join(__dirname, imagePath);
      fs.unlink(absolutePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.error("Error deleting image file:", unlinkErr);
          res.status(500).send("Failed to delete image file.");
          return;
        }
        console.log("Image file deleted successfully.");
      });
    }

    // Step 3: Delete the service record from the database
    const deleteQuery = `
      DELETE FROM services WHERE service_ID = ?;
    `;

    db.query(deleteQuery, [serviceId], (deleteErr) => {
      if (deleteErr) {
        console.error("Error deleting service:", deleteErr);
        res.status(500).send("Failed to delete service.");
        return;
      }

      res.send("Service and its image deleted successfully!");
    });
  });
});


app.get("/services/:id", (req, res) => {
  const serviceId = req.params.id;

  const sql = `
    SELECT service_ID, Title, Category, Price, originalPrice, Availability, Description, Image
    FROM services
    WHERE service_ID = ?;
  `;

  db.query(sql, [serviceId], (err, result) => {
    if (err) {
      console.error("Error fetching service details:", err);
      res.status(500).send("Failed to fetch service details.");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Service not found.");
      return;
    }

    res.json(result[0]); // Return the first matching service
  });
});


// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: "Username and password are required." });
    return;
  }

  const sql = "SELECT * FROM customers WHERE Username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error during login query:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, message: "Invalid username or password." });
      return;
    }

    const user = results[0];
    if (user.Password !== password) {
      res.status(401).json({ success: false, message: "Invalid username or password." });
    } else {
      res.json({
        success: true,
        message: "Login successful!",
        user: {
          id: user.customer_ID,
          username: user.Username,
          email: user.Email,
          name: user.Name,
        },
      });
    }
  });
});

// Registration route
app.post("/register", (req, res) => {
  const { fullName, birthdate, email, address, username, password, confirmPassword } = req.body;

  if ( !username || !password || !confirmPassword) {
    console.log(username, password, confirmPassword);
    res.status(400).json({ success: false, message: "username and password are required." });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ success: false, message: "Passwords do not match." });
    return;
  }

  const sql = `
    INSERT INTO customers (Name, DOB, Email, Address, Username, Password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullName, birthdate, email, address, username, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(409).json({ success: false, message: "Username or email already exists." });
      } else {
        console.error("Error during registration query:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
      return;
    }

    console.log("Registration successful!");
    res.json({ success: true, message: "Registration successful!" });
  });
});


// Endpoint to add a service to the cart (boughtServices table)
app.post("/addToCart", (req, res) => {
  const service_id = req.body.service_id; // The service ID passed in the body
  const customerId = req.body.customer_id;
  const purchaseDate = req.body.purchaseDate; // The customer ID from the session

  if (!customerId) {
    return res.status(400).json({ success: false, message: "Customer not logged in." });
  }

  // Insert the data into the boughtServices table
  const sql = `
    INSERT INTO bought_services (customer_ID, service_ID, purchaseDate, isPaid)
    VALUES (?, ?, ?, ?)
  `;

  // Set default value for isPaid as false (service is added to cart, not purchased yet)
  const values = [customerId, service_id, purchaseDate, false];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding service to cart:", err);
      return res.status(500).json({ success: false, message: "Failed to add service to cart." });
    }

    res.json({ success: true, message: "Service added to cart successfully!" });
  });
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
