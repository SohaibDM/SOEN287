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
      
        if (data.customer && data.customer.Username) {
            usernameElement.textContent = data.Username; // Replace "Guest" with the chosen name
            username.textContent = data.Username; 
            Name.textContent = data.Name; 
            accountEmail.textContent = data.Email; 
            date.textContent = formatDate(data.DOB); 
            payment.textContent = data.payment; 
          }
          
          if (data.boughtServices && data.boughtServices.length > 0) {
          const servicesHolder = document.getElementById("services_holder"); // Access the container

          data.boughtServices.forEach((service, index) => {
              // Create main service block
              const serviceBloc = document.createElement("div");
              serviceBloc.classList.add("service-bloc", "d-flex", "align-items-center");

              // Create inner container
              const innerContainer = document.createElement("div");
              innerContainer.classList.add("ml-3");

              // Create info container
              const infoContainer = document.createElement("div");
              infoContainer.classList.add("info-container", "d-flex");

              // Create service title
              const serviceTitle = document.createElement("p");
              serviceTitle.classList.add("service-title");
              serviceTitle.textContent = `Service ID: ${service.service_ID}`; // Replace with relevant data

              // Create price button
              const priceButton = document.createElement("button");
              priceButton.classList.add("price-button");
              priceButton.textContent = service.isPaid; // Example payment status

              // Create date info
              const dateInfo = document.createElement("p");
              dateInfo.classList.add("date-info");
              dateInfo.textContent = formatDate(service.purchaseDate);

              // Append title, button, and date to info container
              infoContainer.appendChild(serviceTitle);
              infoContainer.appendChild(priceButton);
              infoContainer.appendChild(dateInfo);

              // Create description paragraph
              const description = document.createElement("p");
              description.classList.add("thin-text");
              description.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."; // Placeholder

              // Create view order button
              const viewOrderButton = document.createElement("button");
              viewOrderButton.classList.add("btn", "custom-btn");
              viewOrderButton.textContent = "View Order";

              // Append everything to the inner container
              innerContainer.appendChild(infoContainer);
              innerContainer.appendChild(description);
              innerContainer.appendChild(viewOrderButton);

              // Append inner container to service block
              serviceBloc.appendChild(innerContainer);

              // Append service block to the holder
              servicesHolder.appendChild(serviceBloc);
          });
      }

    })
    .catch(error => console.error("Error fetching user data:", error));






