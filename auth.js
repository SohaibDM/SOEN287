document.addEventListener("DOMContentLoaded", function () {

  // customer login 
  const loginForm = document.querySelector("#loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
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
  } else {
    console.error("loginForm not found!");
  }

  // customer register 
  const registerForm = document.querySelector("#registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.querySelector("[name='full_name']").value;
      const birthdate = document.querySelector("[name='birthdate']").value;
      const email = document.querySelector("[name='email']").value;
      const address = document.querySelector("[name='address']").value;
      const username = document.querySelector("[name='username']").value;
      const password = document.querySelector("[name='password']").value;
      const confirmPassword = document.querySelector("[name='confirm_password']").value;

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
            window.location.href = "login.html"; //  login page
          } else {
            alert(data.message); 
          }
        })
        .catch((error) => console.error("Registration error:", error));
    });
  } else {
    console.error("registerForm not found!");
  }
});

//admin logi n
document.addEventListener("DOMContentLoaded", function () {
  const adminLoginForm = document.querySelector("#adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("adminUsername").value;
      const password = document.getElementById("adminPassword").value;

      fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); 
          if (data.success) {
            console.log("Login response data:", data); 
            alert("Login successful!");
            window.location.href = "admin-custumization.html"; // admin customization page
          } else {
            alert(data.message || "Admin login failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Admin Login error:", error);
          alert("An error occurred. Please try again.");
        });
    });
  } else {
    console.error("adminLoginForm not found!");
  }




  // admin register 
  const adminRegisterForm = document.querySelector("#adminRegisterForm");
  if (adminRegisterForm) {
    adminRegisterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.querySelector("[name='admin_full_name']").value;
      const birthdate = document.querySelector("[name='admin_birthdate']").value;
      const email = document.querySelector("[name='admin_email']").value;
      const address = document.querySelector("[name='admin_address']").value;
      const username = document.querySelector("[name='admin_username']").value;
      const password = document.querySelector("[name='admin_password']").value;
      const confirmPassword = document.querySelector("[name='admin_confirm_password']").value;

      fetch("http://localhost:3000/admin/register", {
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
            window.location.href = "admin.html"; // admin login page
          } else {
            alert(data.message);
          }
        })
        .catch((error) => console.error("Admin Registration error:", error));
    });
  } else {
    console.error("adminRegisterForm not found!");
  }
});
