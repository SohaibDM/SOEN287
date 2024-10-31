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

function extractServices() {
  const serviceElements = document.querySelectorAll(".bbb_deals");
  const services = [];

  serviceElements.forEach((element) => {
      const name = element.querySelector(".bbb_deals_title a").textContent.trim();
      const description = descriptionElement 
      ? descriptionElement.textContent.trim() 
      : element.getAttribute('data-description') || '';
      services.push({ name, description });
  });

  return services;
}

const services = extractServices(); // Call this function once to get the array of services

const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

// Add event listener to the search input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

    if (query.length === 0) {
        // Clear the results container if input is empty
        const resultsContainer = document.getElementById("resultsContainer");
        if (resultsContainer) {
            resultsContainer.innerHTML = ""; // Clear the contents
        }
    } else {
        searchServices(query);
    }
});

function searchServices(query) {
    const results = services.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query)
    );

    displayResults(results);
}


function displayResults(results) {
  let resultsContainer = document.getElementById("resultsContainer");
  if (!resultsContainer) {
      resultsContainer = document.createElement("div");
      resultsContainer.id = "resultsContainer";

      const searchBar = document.getElementById("search-bar");
      searchBar.parentNode.insertBefore(resultsContainer, searchBar.nextSibling);

  }
  resultsContainer.innerHTML = ""; // Clear previous results

  // Display each result
  results.forEach(result => {
      const resultItem = document.createElement("div");
      resultItem.textContent = `Name: ${result.name}, Description: ${result.description}`;
      resultsContainer.appendChild(resultItem);
  });

  // Show a message if no results are found
  if (results.length === 0) {
      resultsContainer.textContent = "No services found.";
  }
}

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("loggedInUsername");
  displayUsername.textContent = "Guest";
  alert("You have been logged out.");
  // here we have to take the user to the main page again

  window.location.href = "home-page.html"; 
  if (wrapper) {
    wrapper.classList.remove('active');
    wrapper.classList.remove('admin-active');
    wrapper.classList.remove('login-active');
  }
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

