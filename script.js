const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelectorAll('.login-link');
const registerLink = document.querySelectorAll('.register-link');
const adminLink = document.querySelectorAll('.admin-link');
const adminPopupBtn = document.querySelector('.btnAdmin-popup');
const loginButton = document.querySelector('.login-button');
const adminButton = document.querySelector('.admin-button');

const users = [
  { username: "user1", password: "password123" },
  { username: "admin", password: "adminpass" },
  { username: "john", password: "doe123" }
];

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const displayUsername = document.getElementById("displayUsername");
const logoutButton = document.querySelector(".logout-button");


logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("loggedInUsername");
  displayUsername.textContent = "Guest";
  alert("You have been logged out.");

});


document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = sessionStorage.getItem("loggedInUsername");
  if (loggedInUser) {
    displayUsername.textContent = loggedInUser;
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); 

  const enteredUsername = usernameInput.value;
  const enteredPassword = passwordInput.value;

  const validUser = users.find(
    (user) =>
      user.username === enteredUsername && user.password === enteredPassword
  );

  if (validUser) {
    sessionStorage.setItem("loggedInUsername", validUser.username);

    displayUsername.textContent = validUser.username;
    

    usernameInput.value = "";
    passwordInput.value = "";

    window.location.href = "home-page.html";
  } else {
    alert("Invalid username or password. Please try again.");
  }
});







// loginButton.addEventListener('click', () => {
//   window.location.href = 'login.html'; 
// });




function resetForms() {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    adminForm.classList.remove('active');
}

loginLink.forEach(link => {
  link.addEventListener('click', (event) => {
    wrapper.classList.add('login-active');
    wrapper.classList.remove('active');
    wrapper.classList.remove('admin-active');
    resetForms();
    event.preventDefault(); 
  });
});

registerLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); 
    wrapper.classList.add('active');
    wrapper.classList.remove('admin-active');
    wrapper.classList.remove('login-active');
    resetForms();
  });
});


adminLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); 
    wrapper.classList.add('admin-active');
    wrapper.classList.remove('active');
    wrapper.classList.remove('login-active');
  });
});

adminPopupBtn.addEventListener('click', (event) => {
  event.preventDefault();
  wrapper.classList.add('admin-active');
});
