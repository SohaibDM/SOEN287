const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelectorAll('.login-link');
const registerLink = document.querySelectorAll('.register-link');
const adminLink = document.querySelectorAll('.admin-link');
const adminPopupBtn = document.querySelector('.btnAdmin-popup');
const loginButton = document.querySelector('.login-button');
const adminButton = document.querySelector('.admin-button');



const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const displayUsername = document.getElementById("displayUsername");
const logoutButton = document.querySelector(".logout-button");













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


function checkUser() {
  const displayUsername = document.getElementById("displayUsername");

  if (displayUsername.textContent.trim() === "Guest") {
    event.preventDefault();
    window.location.href = "login.html";
  }
}


