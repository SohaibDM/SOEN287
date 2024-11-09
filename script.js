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

      const descriptionElement = element.querySelector('.service-description');
      //const description = descriptionElement ? descriptionElement.textContent.trim() : '';

      //services.push({ name, description });
      services.push({ name });
  });

  return services;
}


const services = extractServices(); // Call this function once to get the array of services

const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

// Add event listener to the search input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const resultsContainer = document.getElementById("resultsContainer");

  if (query.length === 0) {
    // Hide the results container if input is empty
    if (resultsContainer) {
      resultsContainer.style.display = "none"; // Hide the results container
    }
  } else {
    if (resultsContainer) {
      resultsContainer.style.display = "block"; // Ensure it's visible when there's input
    }
    searchServices(query);
  }
});

function searchServices(query) {
    const results = services.filter(service =>
        service.name.toLowerCase().includes(query)
    );

    displayResults(results);
}


function displayResults(results) {
  let resultsContainer = document.getElementById("resultsContainer");
  if (!resultsContainer) {
      resultsContainer = document.createElement("div");
      resultsContainer.id = "resultsContainer";
      resultsContainer.style.position = "absolute"; // Positioning
      resultsContainer.style.top = `${searchInput.offsetHeight + 23}px`;
      resultsContainer.style.width = "100%"; // Match the search bar width
      resultsContainer.style.backgroundColor = "#fff"; // Background color for visibility
      resultsContainer.style.border = "1px solid #ccc"; // Add a border to separate it visually
      resultsContainer.style.zIndex = "1000"; // Ensure it's above other elements
      resultsContainer.style.maxHeight = "200px"; // Limit height
      resultsContainer.style.overflowY = "auto"; // Scroll if too many results

      const searchBar = document.getElementById("search-bar");
      searchBar.style.position = "relative"; // Ensure parent is relative
      searchBar.appendChild(resultsContainer);
  }
  
  resultsContainer.innerHTML = ""; // Clear previous results

  // Display each result
  results.forEach(result => {
    const resultItem = document.createElement("div");
    resultItem.style.padding = "8px"; // Padding for spacing
    resultItem.style.cursor = "pointer"; // Pointer cursor on hover
    resultItem.style.borderBottom = "1px solid #ddd"; // Divider between items
    
    // Create an anchor element
    const resultLink = document.createElement("a");
    resultLink.textContent = result.name;
    resultLink.href = "/productPage1.html"; // Adjust the URL
    resultLink.style.textDecoration = "none"; // Remove underline
    resultLink.style.color = "#333"; // Text color

    resultItem.appendChild(resultLink);
    resultsContainer.appendChild(resultItem);
  });

}

// Show a message if no results are found
if (results.length === 0) {
  resultsContainer.textContent = "No services found.";
}

document.addEventListener("click", (e) => {
  const searchBar = document.getElementById("search-bar");
  const resultsContainer = document.getElementById("resultsContainer");
  if (resultsContainer && !searchBar.contains(e.target)) {
      resultsContainer.style.display = "none";
  }
});

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

