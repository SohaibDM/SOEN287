const API_BASE_URL = "https://soen287-2j07.onrender.com";

async function handleAdminLogin(event) {
  event.preventDefault();

  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!username || !password) {
    alert("Please enter your admin username and password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Admin login successful!");
      window.location.href = "admin-customization.html";
    } else {
      alert("Failed to login as admin. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error logging in as admin:", error);
    alert("An error occurred. Please try again.");
  }
}

document
  .getElementById("adminLoginForm")
  .addEventListener("submit", handleAdminLogin);

async function handleAdminRegistration(event) {
  event.preventDefault();

  const form = event.target;
  const fullName = form
    .querySelector("input[placeholder='Full Name']")
    .value.trim();
  const birthdate = form
    .querySelector("input[placeholder='Birthdate']")
    .value.trim();
  const email = form.querySelector("input[placeholder='Email']").value.trim();
  const address = form.querySelector("input[placeholder='Address']").value.trim();
  const username = form
    .querySelector("input[placeholder='Admin Username']")
    .value.trim();
  const password = form
    .querySelector("input[placeholder='Password']")
    .value.trim();
  const confirmPassword = form
    .querySelector("input[placeholder='Confirm Password']")
    .value.trim();
  const termsChecked = form.querySelector("input[type='checkbox']").checked;

  if (!termsChecked) {
    alert("You must agree to the terms and conditions.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const adminData = {
    fullName,
    birthdate,
    email,
    address,
    username,
    password,
    confirmPassword,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Admin registration successful!");
      window.location.href = "admin.html";
    } else {
      alert(result.message || "Failed to register admin. Please try again.");
    }
  } catch (error) {
    console.error("Error registering admin:", error);
    alert("An error occurred. Please try again.");
  }
}

const adminRegisterForm = document.getElementById("adminRegisterForm");
if (adminRegisterForm) {
  adminRegisterForm.addEventListener("submit", handleAdminRegistration);
}
