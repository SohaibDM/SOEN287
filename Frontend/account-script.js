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
const specificCustomerId = sessionStorage.getItem("customer_id");
console.log(specificCustomerId) // Example: Fetch user with ID 3
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
            // Update customer details
            usernameElement.textContent = data.customer.Username; // Replace "Guest" with the chosen name
            username.textContent = data.customer.Username; 
            Name.textContent = data.customer.Name; 
            accountEmail.textContent = data.customer.Email; 
            date.textContent = formatDate(data.customer.DOB); 
            payment.textContent = data.customer.payment; 
        }
        if (data.serviceDetails && data.serviceDetails.length > 0) {
          data.serviceDetails.forEach((service, index) => {
              console.log(`Full Service Info ${index + 1}:`, service);

              
          });
        } else {
          console.log("No service details found.");
        }
        // Handle boughtServices and serviceDetails
        if (data.boughtServices && data.boughtServices.length > 0 && data.serviceDetails && data.serviceDetails.length > 0) {
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
              //serviceTitle.textContent = `Service ID: ${service.Name}`;

              const matchingService = data.serviceDetails.find((detail) => detail.service_ID === service.service_ID);
              // Use the service name if found, otherwise a fallback message
              if (matchingService) {
                  serviceTitle.textContent = matchingService.Title; // Assuming "Title" is the field in service details
              } else {
                  serviceTitle.textContent = `Service Name: Unknown Service`;
              }
              
              // Create price button
              const priceButton = document.createElement("button");
              priceButton.classList.add("price-button");
              //priceButton.textContent = service.isPaid; // Example payment status
              const matchingService2 = data.serviceDetails.find((detail) => detail.service_ID === service.service_ID);
              if (matchingService2) {
                priceButton.textContent = `$${matchingService2.Price}`; // Assuming "Title" is the field in service details
              } else {
                priceButton.textContent = `?`;
              }

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
              const matchingService3 = data.serviceDetails.find((detail) => detail.service_ID === service.service_ID);
              if (matchingService3) {
                description.textContent = `Service Category: ${matchingService3.Category}`; 
              } else {
                description.textContent = `?`;
              }

              // Create view order button
              const viewOrderButton = document.createElement("button");
              viewOrderButton.classList.add("btn", "custom-btn2");
              if(service.isPaid === 1){
                viewOrderButton.textContent = "Paid";
              }
              else viewOrderButton.textContent = "Not paid";

              // Append everything to the inner container
              innerContainer.appendChild(infoContainer);
              innerContainer.appendChild(description);
              innerContainer.appendChild(viewOrderButton);

              // Append inner container to service block
              serviceBloc.appendChild(innerContainer);

              // Append service block to the holder
              servicesHolder.appendChild(serviceBloc);
          });
        } else {
            console.log("No services bought yet.");
        }
   
    })
    .catch(error => console.error("Error fetching user data:", error));







