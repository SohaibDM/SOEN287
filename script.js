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
  updateFromLocalStorage();
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

function updateFromLocalStorage() {
  const companyName = localStorage.getItem("companyName");
  const companyAddress = localStorage.getItem("companyAddress");
  const companyEmail = localStorage.getItem("companyEmail");
  const phoneNumber = localStorage.getItem("phoneNumber");

  const instagramLink = localStorage.getItem("instagramLink");
  const twitterLink = localStorage.getItem("twitterLink");
  const linkedinLink = localStorage.getItem("linkedinLink");
  const companyImage = localStorage.getItem("companyImage");
  const description = localStorage.getItem("description");
  const title = localStorage.getItem("descriptionTitle");


  if (companyImage) {
    const imgElement = document.getElementById("companyImageDisplay");
    imgElement.src = companyImage;
    imgElement.style.display = "block";
  }

  if (companyName) {
    document.getElementById("title").querySelector("h1").textContent =
      companyName;
  }

  if (companyAddress) {
    document.querySelector(
      "footer .col.mb-3:nth-child(3) .nav-link"
    ).textContent = companyAddress;
  }

  if (companyEmail) {
    document.querySelector(
      "footer .col.mb-3:nth-child(2) .nav-link"
    ).textContent = companyEmail;
  }

  if (phoneNumber) {
    document.querySelector(
      "footer .col.mb-3:nth-child(4) .nav-link"
    ).textContent = phoneNumber;
  }

  if (instagramLink) {
    document.getElementById("instagram-link").href = instagramLink;
  }

  if (twitterLink) {
    document.getElementById("twitter-link").href = twitterLink;
  }

  if (linkedinLink) {
    document.getElementById("linkedin-link").href = linkedinLink;
  }

  if (title) {
    document.getElementById("descriptionTitle").textContent = title; 
  }

  if (description) {
    document.getElementById("description").textContent = description; 
  }
}


function deleteService(serviceName) {
    if (confirm("Are you sure you want to delete " + serviceName + "?")) {
    alert(serviceName + " has been deleted.");
    }
  }


function handleSearch(event) {
  event.preventDefault(); // Prevent the default form submission
  const searchQuery = event.target
    .querySelector('input[name="q"]')
    .value.trim()
    .toLowerCase(); // Get the search input value

  if (searchQuery.startsWith("serv")) {
    window.location.href = "servicesPage.html"; // Redirect to the services page
  } else {
    window.location.href = "home-page.html"; // Redirect to the homepage for any other input
  }
}

