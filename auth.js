document.addEventListener("DOMContentLoaded", function () {
  // login form submission
  document.querySelector("#loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // send to the backend
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed. Please check your credentials.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          alert("Login successful!");
          window.location.href = "home-page.html"; // redirect
        } else {
          alert(data.message || "Login failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again.");
      });
  });
});


document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
  })
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              alert(data.message);
              //  successful login 
          } else {
              alert(data.message);
          }
      })
      .catch((error) => console.error("Login error:", error));
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault(); 

  // data
  const fullName = document.querySelector("[name='full_name']").value;
  const birthdate = document.querySelector("[name='birthdate']").value;
  const email = document.querySelector("[name='email']").value;
  const address = document.querySelector("[name='address']").value;
  const username = document.querySelector("[name='username']").value;
  const password = document.querySelector("[name='password']").value;
  const confirmPassword = document.querySelector("[name='confirm_password']").value;

  // send daa to the backend
  fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          full_name: fullName,
          birthdate,
          email,
          address,
          username,
          password,
          confirm_password: confirmPassword,
      }),
  })
      .then((response) => response.json())
      .then((data) => {
          if (data.success) {
              alert(data.message);
              // Redirect or update UI as needed
              window.location.href = "login.html"; // Example redirection
          } else {
              alert(data.message); // Show error message from backend
          }
      })
      .catch((error) => console.error("Registration error:", error));
});


