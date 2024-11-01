const adminAccounts = [
  { username: "admin1", password: "password1" },
  { username: "admin2", password: "password2" },
  { username: "admin3", password: "password3" },
];

function validateAdminLogin(event) {
  event.preventDefault(); 
  const usernameInput = document.querySelector(
    ".form-box .input-box input[type='text']"
  ).value;
  const passwordInput = document.querySelector(
    ".form-box .input-box input[type='password']"
  ).value;

  const isValidAdmin = adminAccounts.some(
    (account) =>
      account.username === usernameInput && account.password === passwordInput
  );

  if (isValidAdmin) {
    alert("Login successful! Redirecting to admin customization page.");
    window.location.href = "admin-customization.html"; 
  } else {
    alert("Invalid username or password. Please try again.");
  }
}
