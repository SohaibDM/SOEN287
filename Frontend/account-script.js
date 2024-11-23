function showSection(section) {
  const accountSection = document.getElementById("account-section");
  const ordersSection = document.getElementById("orders-section");

  if (section === "account") {
    accountSection.classList.remove("d-none");
    ordersSection.classList.add("d-none");
  } else if (section === "orders") {
    ordersSection.classList.remove("d-none");
    accountSection.classList.add("d-none");
  }
}


// Replace '3' with the ID of the customer you want to display
const specificCustomerId = 3; // Example: Fetch user with ID 3
const usernameElement = document.getElementById("displayUsername");
const username = document.getElementById("accountUsername");
const Name = document.getElementById("name");
const accountEmail = document.getElementById("email");
const date = document.getElementById("date"); 
const payment = document.getElementById("payment-card"); 

// Helper function to format the date as YYYY/MM/DD
function formatDate(dateString) {
  const dateObj = new Date(dateString); // Convert to Date object
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if needed
  const day = String(dateObj.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
  return `${year}/${month}/${day}`;
}

// Fetch user info for the chosen ID
fetch(`http://localhost:3000/Frontend/account-settings/${specificCustomerId}`)
    .then(response => response.json())
    .then(data => {
        if (data.Username) {
            usernameElement.textContent = data.Username; // Replace "Guest" with the chosen name
            username.textContent = data.Username; 
            Name.textContent = data.Name; 
            accountEmail.textContent = data.Email; 
            date.textContent = formatDate(data.DOB); 
            payment.textContent = data.payment; 

        }
    })
    .catch(error => console.error("Error fetching user data:", error));






