const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const nodemailer = require("nodemailer");
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/serviceImages",
  express.static(path.join(__dirname, "serviceImages"))
);
app.use("/Frontend", express.static(path.join(__dirname, "Frontend")));




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
  const query_order = "SELECT * FROM bought_services WHERE customer_ID = ?";
  const query_service = "SELECT * FROM services WHERE service_ID IN (?)"; // Query for full service details

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



app.get("/Frontend/bought-services.html", (req, res) => {
  const query_bought =
    "SELECT transaction_ID, customer_ID, service_ID, isPaid, isExecuted, purchaseDate FROM bought_services";
  const query_customers =
    "SELECT customer_ID, Username, Name, Email, DOB, payment FROM customers";
  const query_services = "SELECT * FROM services";

  db.query(query_bought, (err, boughtServices) => {
    if (err) {
      console.error("Error accessing bought_services: ", err);
      return res.status(500).send("Internal Server Error");
    }

    if (boughtServices.length === 0) {
      return res.json({
        customers: [],
        boughtServices: [],
        serviceDetails: [],
      });
    } else {
      const customerIds = [
        ...new Set(boughtServices.map((service) => service.customer_ID)),
      ];
      const serviceIds = [
        ...new Set(boughtServices.map((service) => service.service_ID)),
      ];

      db.query(query_customers, [customerIds], (err, customers) => {
        if (err) {
          console.error("Error accessing customers: ", err);
          return res.status(500).send("Internal Server Error");
        }

        db.query(query_services, [serviceIds], (err, services) => {
          if (err) {
            console.error("Error accessing services: ", err);
            return res.status(500).send("Internal Server Error");
          }

          res.json({
            boughtServices: boughtServices,
            customers: customers,
            serviceDetails: services,
          });
        });
      });
    }
  });
});


app.get("/Frontend/ServicesPage.html", (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request

  if (!searchQuery) {
    return res.json([]); // Return an empty array if no query is provided
  }

  // Query to search for services by title
  const query = "SELECT * FROM services WHERE Title LIKE ? LIMIT 10";

  // Use wildcards for partial matching
  db.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Error accessing services: ", err);
      return res.status(500).send("Internal Server Error");
    }

    res.json(results); // Send matching services as JSON
  });
});

app.get("/Frontend/productPage1.html", (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request

  if (!searchQuery) {
    return res.json([]); // Return an empty array if no query is provided
  }

  // Query to search for services by title
  const query = "SELECT * FROM services WHERE Title LIKE ? LIMIT 10";

  // Use wildcards for partial matching
  db.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Error accessing services: ", err);
      return res.status(500).send("Internal Server Error");
    }

    res.json(results); // Send matching services as JSON
  });
});

app.get("/Frontend/home-page.html", (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request

  if (!searchQuery) {
    return res.json([]); // Return an empty array if no query is provided
  }

  // Query to search for services by title
  const query = "SELECT * FROM services WHERE Title LIKE ? LIMIT 10";

  // Use wildcards for partial matching
  db.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Error accessing services: ", err);
      return res.status(500).send("Internal Server Error");
    }

    res.json(results); // Send matching services as JSON
  });
});

app.get("/Frontend/account-settings.html", (req, res) => {
  const searchQuery = req.query.q; // Get the search query from the request

  if (!searchQuery) {
    return res.json([]); // Return an empty array if no query is provided
  }

  // Query to search for services by title
  const query = "SELECT * FROM services WHERE Title LIKE ? LIMIT 10";

  // Use wildcards for partial matching
  db.query(query, [`%${searchQuery}%`], (err, results) => {
    if (err) {
      console.error("Error accessing services: ", err);
      return res.status(500).send("Internal Server Error");
    }

    res.json(results); // Send matching services as JSON
  });
});



app.delete("/Frontend/account-settings.html", (req, res) => {
  const customerId = req.body.customer_ID; // Extract the customer ID from the request body

  if (!customerId) {
    return res.status(400).send("Customer ID is required");
  }

  // SQL query to delete the customer by ID
  const query = "DELETE FROM customers WHERE customer_ID = ?";

  db.query(query, [customerId], (err, result) => {
    if (err) {
      console.error("Error deleting customer: ", err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Customer not found");
    }

    res.status(200).send("Customer deleted successfully");
  });
});

app.delete("/Frontend/account-settings.html/cancel", (req, res) => {
  const bought_ser_id = req.body.BS_id; // Extract the customer ID from the request body

  if (!bought_ser_id) {
    return res.status(400).send("bought service id is required");
  }

  // SQL query to delete the customer by ID
  const query = "DELETE FROM bought_services WHERE transaction_ID = ?";

  db.query(query, [bought_ser_id], (err, result) => {
    if (err) {
      console.error("Error deleting bought service: ", err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("bought service not found");
    }
    res.status(200).send("bought service deleted successfully");
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

// Endpoint to update availability after adding to cart
app.patch("/updateAvailability/:serviceId", (req, res) => {
  const serviceId = req.params.serviceId;
  const { availability } = req.body;

  if (typeof availability !== "number" || availability < 0) {
    return res.status(400).json({ success: false, message: "Invalid availability value." });
  }

  const sql = `UPDATE services SET Availability = ? WHERE service_ID = ?`;

  db.query(sql, [availability, serviceId], (err, result) => {
    if (err) {
      console.error("Error updating availability:", err);
      return res.status(500).json({ success: false, message: "Failed to update availability." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    res.json({ success: true, message: "Availability updated successfully!" });
  });
});



// Admin registration route
app.post("/admin/register", (req, res) => {
  const { fullName, birthdate, email, address, username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    res.status(400).json({ success: false, message: "Username, password, and confirmation are required." });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ success: false, message: "Passwords do not match." });
    return;
  }

  const sql = `
    INSERT INTO admins (Name, DOB, Email, Address, Username, Password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullName, birthdate, email, address, username, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(409).json({ success: false, message: "Username or email already exists." });
      } else {
        console.error("Error during admin registration query:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
      }
      return;
    }

    res.json({ success: true, message: "Admin registration successful!" });
  });
});


// Admin login route
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: "Username and password are required." });
    return;
  }

  const sql = "SELECT * FROM admins WHERE Username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error("Error during admin login query:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ success: false, message: "Invalid username or password." });
      return;
    }

    const admin = results[0];
    if (admin.Password !== password) {
      res.status(401).json({ success: false, message: "Invalid username or password." });
    } else {
      res.json({
        success: true,
        message: "Admin login successful!",
        admin: {
          id: admin.admin_ID,
          username: admin.Username,
          email: admin.Email,
          name: admin.Name,
        },
      });
    }
  });
});


// Endpoint to fetch unpaid services using transaction_ID
app.get("/customer/:customerId/unpaid-services", (req, res) => {
  const customerId = req.params.customerId;
  const sql = `
    SELECT bs.transaction_ID, s.Title, s.Price
    FROM services s
    JOIN bought_services bs ON s.service_ID = bs.service_ID
    WHERE bs.customer_ID = ? AND bs.isPaid = 0;
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      console.error("Error fetching unpaid services:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(results);
  });
});

// Payment endpoint updated to use transaction_ID
app.post("/Frontend/pay-service", (req, res) => {
  const { transactionId } = req.body;
  const sql = `UPDATE bought_services SET isPaid = 1 WHERE transaction_ID = ?`;

  db.query(sql, [transactionId], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ success: false, message: "Payment failed" });
    }
    res.json({ success: true, message: "Payment successful" });
  });
});

// PUT endpoint to update a service with correct image storage handling
app.put("/services/:id", serviceUpload.single('serviceImage'), (req, res) => {
  const serviceId = req.params.id;
  let serviceData = req.body;

  // Parse service data if it's sent as a JSON string under the 'data' form field
  if (req.body.data) {
    serviceData = JSON.parse(req.body.data);
  }

  // Values to update
  const updateValues = [
    serviceData.Title,
    serviceData.Category,
    serviceData.Price,
    serviceData.originalPrice,
    serviceData.Availability,
    serviceData.Description,
    serviceId
  ];

  // Prepare the SQL query to update service details
  let sqlUpdate = `
    UPDATE services SET
      Title = ?,
      Category = ?,
      Price = ?,
      originalPrice = ?,
      Availability = ?,
      Description = ?
    WHERE service_ID = ?;
  `;

  // Execute the update query
  db.query(sqlUpdate, updateValues, (err, result) => {
    if (err) {
      console.error("Failed to update service details:", err);
      return res.status(500).send("Failed to update service.");
    }

    // Check if an image file was uploaded and update the image path in the database
    if (req.file) {
      const imagePath = `/serviceImages/${req.file.filename}`;
      const sqlUpdateImage = `UPDATE services SET Image = ? WHERE service_ID = ?`;

      db.query(sqlUpdateImage, [imagePath, serviceId], (imgErr, imgResult) => {
        if (imgErr) {
          console.error("Failed to update service image:", imgErr);
          return res.status(500).send("Failed to update service image.");
        }
        res.send("Service updated successfully with new image!");
      });
    } else {
      res.send("Service updated successfully without image change.");
    }
  });
});


// Endpoint to update isExecuted status
// Endpoint to update isExecuted status
app.patch("/executeTransaction/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  const { isExecuted } = req.body;

  if (typeof isExecuted !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid isExecuted value." });
  }

  const sql = `UPDATE bought_services SET isExecuted = ? WHERE transaction_ID = ?`;

  db.query(sql, [isExecuted, transactionId], (err, result) => {
    if (err) {
      console.error("Error updating isExecuted status:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to update isExecuted status.",
        });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found." });
    }

    res.json({ success: true, message: "Transaction executed successfully!" });
  });
});







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
