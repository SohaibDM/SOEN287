// Sample admin accounts
const adminAccounts = [
  { username: "admin1", password: "password1" },
  { username: "admin2", password: "password2" },
  { username: "admin3", password: "password3" },
];

// Function to validate admin login
function validateAdminLogin(event) {
  event.preventDefault(); // Prevent form submission
  const usernameInput = document.querySelector(
    ".form-box .input-box input[type='text']"
  ).value;
  const passwordInput = document.querySelector(
    ".form-box .input-box input[type='password']"
  ).value;

  // Check if the entered credentials match any admin account
  const isValidAdmin = adminAccounts.some(
    (account) =>
      account.username === usernameInput && account.password === passwordInput
  );

  if (isValidAdmin) {
    alert("Login successful! Redirecting to admin customization page.");
    window.location.href = "admin-customization.html"; // Redirect on successful login
  } else {
    alert("Invalid username or password. Please try again.");
  }
}
