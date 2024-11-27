const API_BASE_URL = "http://localhost:3000";

async function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter your username and password.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Login successful!");
      sessionStorage.setItem("customer_id", result.user.id);
      sessionStorage.setItem("user", result.user.username);
      window.location.href = "home-page.html"; 
    } else {
      alert(result.message || "Failed to login. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("An error occurred. Please try again.");
  }
}

async function handleRegistration(event) {
  event.preventDefault();

  const form = event.target;
  const fullName = form.querySelector("input[placeholder='Full name']").value.trim();
  const birthdate = form.querySelector("input[placeholder='Birthdate']").value.trim();
  const email = form.querySelector("input[placeholder='Email']").value.trim();
  const address = form.querySelector("input[placeholder='Adress']").value.trim();
  const username = form.querySelector("input[placeholder='Username']").value.trim();
  const password = form.querySelector("input[placeholder='Password']").value.trim();
  const confirmPassword = form.querySelector("input[placeholder='Confirm Password']").value.trim();
  const termsChecked = form.querySelector("input[type='checkbox']").checked;

  if (!termsChecked) {
    alert("You must agree to the terms and conditions.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const userData = { fullName, birthdate, email, address, username, password, confirmPassword };

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registration successful!");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Failed to register. Please try again.");
    }
  } catch (error) {
    console.error("Error registering:", error);
    alert("An error occurred. Please try again.");
  }
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);

const registerForm = document.querySelector(".form-box.register form");
if (registerForm) {
  registerForm.addEventListener("submit", handleRegistration);
}
