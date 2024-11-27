const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelectorAll(".login-link");
const registerLink = document.querySelectorAll(".register-link");
const adminLink = document.querySelectorAll(".admin-link");
const adminPopupBtn = document.querySelector(".btnAdmin-popup");
const loginButton = document.querySelector(".login-button");
const adminButton = document.querySelector(".admin-button");

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const displayUsername = document.getElementById("displayUsername");
const logoutButton = document.querySelector(".logout-button");

const companyName = document.getElementById("companyName");
const descriptionTitle = document.getElementById("descriptionTitle");
const description = document.getElementById("description");
const address = document.querySelector("#footer .col:nth-child(3) .nav-link");
const email = document.querySelector("#footer .col:nth-child(2) .nav-link");
const phoneNumber = document.querySelector(
  "#footer .col:nth-child(4) .nav-link"
);
const twitterLink = document.getElementById("twitter-link");
const instagramLink = document.getElementById("instagram-link");
const linkedinLink = document.getElementById("linkedin-link");
const imageSrc = document.getElementById("companyImageDisplay");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded and parsed.");

  // Fetch data from the backend
  fetch("http://localhost:3000/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend.");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        const record = data[0]; // Assuming there's only one row in the `page` table
        console.log("Data fetched from the backend:", record);

        // Populate the form fields with the retrieved data
        if (companyName) {
          companyName.textContent = record.Company_Name;
        }
        if (address) {
          address.textContent = record.Address;
        }
        if (email) {
          email.textContent = record.Email;
        }
        if (phoneNumber) {
          phoneNumber.textContent = record.Number;
        }
        if (descriptionTitle) {
          descriptionTitle.textContent = record.Desc_Title;
        }
        if (description) {
          description.textContent = record.Description;
        }
        if (twitterLink) {
          twitterLink.href = record.Twitter;
        }
        if (instagramLink) {
          instagramLink.href = record.Instagram;
        }
        if (linkedinLink) {
          linkedinLink.href = record.Linkedin;
        }

        if (imageSrc) {
          if (record.Image_Path) {
            const imageUrl = `http://localhost:3000${record.Image_Path}`; // Full URL for the image
            imageSrc.src = imageUrl;
            imageSrc.alt = "Company Image";
          }
        }

        console.log("Form fields populated with backend data.");
      } else {
        console.warn("No data available to populate the form.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Check if the user is logged in
  const username = sessionStorage.getItem("user");
  const displayUsername = document.getElementById("displayUsername");

  // Update the displayUsername text
  if (displayUsername) {
    displayUsername.textContent = username || "Guest"; // Fallback to "Guest" if username is missing
  }

  // Check if the user is logged in and adjust the header accordingly
  if (username) {
    // Hide login button and show logout button
    if (loginButton) {
      loginButton.style.display = "none"; // Hide the login button
    }

    if (logoutButton) {
      logoutButton.style.display = "block"; // Show the logout button
    }
  } else {
    // Show login button if not logged in
    if (loginButton) {
      loginButton.style.display = "block"; // Show the login button
    }

    if (logoutButton) {
      logoutButton.style.display = "none"; // Hide the logout button
    }
  }

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      sessionStorage.removeItem("customer_id"); // Remove customer_id from sessionStorage
      sessionStorage.removeItem("user"); // Remove username from sessionStorage
      window.location.href = "login.html"; // Redirect to login page
    });
  }
});

function resetForms() {
  loginForm.classList.remove("active");
  registerForm.classList.remove("active");
  adminForm.classList.remove("active");
}

loginLink.forEach((link) => {
  link.addEventListener("click", (event) => {
    wrapper.classList.add("login-active");
    wrapper.classList.remove("active");
    wrapper.classList.remove("admin-active");
    resetForms();
    event.preventDefault();
  });
});

registerLink.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    wrapper.classList.add("active");
    wrapper.classList.remove("admin-active");
    wrapper.classList.remove("login-active");
    resetForms();
  });
});

adminLink.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    wrapper.classList.add("admin-active");
    wrapper.classList.remove("active");
    wrapper.classList.remove("login-active");
  });
});

adminPopupBtn.addEventListener("click", (event) => {
  event.preventDefault();
  wrapper.classList.add("admin-active");
});

function checkUser() {
  const customerId = sessionStorage.getItem("customer_id");

  if (!customerId) {
    alert("You need to be logged in to access this page.");
    window.location.href = "login.html";
  } else {
    console.log("User is logged in with ID:", customerId);
    window.location.href = "account-settings.html";
    const displayUsername = document.getElementById("displayUsername");
    if (displayUsername) {
      const username = sessionStorage.getItem("user"); 
      displayUsername.textContent = username || "guest"; 
    }
  }
}
