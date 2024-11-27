function showSection(section) {
  const accountSection = document.getElementById("account-section");
  const ordersSection = document.getElementById("orders-section");
  const paymentSection = document.getElementById("payment-section");

  accountSection.classList.add("d-none");
  ordersSection.classList.add("d-none");
  paymentSection.classList.add("d-none");

  if (section === "account") {
    accountSection.classList.remove("d-none");
  } else if (section === "orders") {
    ordersSection.classList.remove("d-none");
  } else if (section === "payment") {
    paymentSection.classList.remove("d-none");
    fetchUnpaidServices(specificCustomerId);
  }
}

const specificCustomerId = sessionStorage.getItem("customer_id");
console.log(specificCustomerId);
const usernameElement = document.getElementById("displayUsername");
const username = document.getElementById("accountUsername");
const Name = document.getElementById("name");
const accountEmail = document.getElementById("email");
const date = document.getElementById("date");
const payment = document.getElementById("payment-card");

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function fetchUnpaidServices(customerId) {
  fetch(`http://localhost:3000/customer/${customerId}/unpaid-services`)
    .then((response) => response.json())
    .then((services) => {
      const servicesList = document.getElementById("unpaid-services-list");
      servicesList.innerHTML = "";

      if (services.length === 0) {
        servicesList.innerHTML = "<p>No unpaid services.</p>";
      } else {
        services.forEach((service) => {
          const serviceDiv = document.createElement("div");
          serviceDiv.classList.add("service-bloc");
          const orderID = service.transaction_ID;
          const title = document.createElement("p");
          title.classList.add("service-title");
          title.textContent = service.Title;

          const price = document.createElement("p");
          price.classList.add("service-price");
          price.textContent = `$${service.Price}`;

          const payButton = document.createElement("button");
          payButton.textContent = "Pay Now";
          payButton.classList.add("btn", "pay-button");
          payButton.onclick = () => processPayment(service.transaction_ID);

          serviceDiv.appendChild(title);
          serviceDiv.appendChild(price);
          serviceDiv.appendChild(payButton);
          servicesList.appendChild(serviceDiv);
        });
      }
    })
    .catch((error) => console.error("Failed to fetch unpaid services:", error));
}

function deleteCustomer(specificCustomerId) {
  if (!specificCustomerId) {
    alert("Customer ID is missing!");
    return;
  }

  const confirmDelete = confirm("Are you sure you want to delete this customer?");
  if (!confirmDelete) {
    return;
  }
  
  fetch("http://localhost:3000/Frontend/account-settings.html", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customer_ID: specificCustomerId }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Customer deleted successfully");
          sessionStorage.removeItem("customer_id");
          sessionStorage.removeItem("user");
          window.location.href = "./home-page.html";
       
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      console.error("Error deleting customer:", error);
      alert("Failed to delete the customer: " + error.message);
    });
}

document.getElementById("delete").addEventListener("click", () => {
  deleteCustomer(specificCustomerId);
});

function processPayment(transactionId) {
  console.log("Processing payment for transaction ID:", transactionId); 
  fetch(`http://localhost:3000/Frontend/pay-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactionId: transactionId }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      fetchUnpaidServices(specificCustomerId);
    })
    .catch((error) => console.error("Error processing payment:", error));
}

fetch(`http://localhost:3000/Frontend/account-settings/${specificCustomerId}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.customer && data.customer.Username) {
      usernameElement.textContent = data.customer.Username;
      username.textContent = data.customer.Username;
      Name.textContent = data.customer.Name;
      accountEmail.textContent = data.customer.Email;
      date.textContent = formatDate(data.customer.DOB);
      payment.textContent = data.customer.payment;
    }

    if (
      data.boughtServices &&
      data.boughtServices.length > 0 &&
      data.serviceDetails &&
      data.serviceDetails.length > 0
    ) {
      const servicesHolder = document.getElementById("services_holder");

      data.boughtServices.forEach((service, index) => {
        const serviceBloc = document.createElement("div");
        serviceBloc.classList.add(
          "service-bloc",
          "d-flex",
          "align-items-center"
        );

        const innerContainer = document.createElement("div");
        innerContainer.classList.add("ml-3");

        const infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container", "d-flex");

        const serviceTitle = document.createElement("p");
        serviceTitle.classList.add("service-title");

        const matchingService = data.serviceDetails.find(
          (detail) => detail.service_ID === service.service_ID
        );
        if (matchingService) {
          serviceTitle.textContent = matchingService.Title;
        } else {
          serviceTitle.textContent = `Service Name: Unknown Service`;
        }

        const priceButton = document.createElement("button");
        priceButton.classList.add("price-button");

        if (matchingService) {
          priceButton.textContent = `$${matchingService.Price}`;
        } else {
          priceButton.textContent = `?`;
        }

        const dateInfo = document.createElement("p");
        dateInfo.classList.add("date-info");
        dateInfo.textContent = formatDate(service.purchaseDate);

        infoContainer.appendChild(serviceTitle);
        infoContainer.appendChild(priceButton);
        infoContainer.appendChild(dateInfo);

        const serviceDescription = document.createElement("p");
        serviceDescription.classList.add("service-description");

        if (matchingService && matchingService.description) {
          serviceDescription.textContent = `Description: ${matchingService.description}`;
        } else {
          serviceDescription.textContent = `Description: No description available`;
        }

        const description = document.createElement("p");
        description.classList.add("thin-text");

        if (matchingService) {
          description.textContent = `Service Category: ${matchingService.Category}`;
        } else {
          description.textContent = `Service Category: Unknown Category`;
        }

        const viewOrderButton = document.createElement("button");
        viewOrderButton.classList.add("btn", "custom-btn2");
        viewOrderButton.textContent =
        service.isPaid === 1 ? "Paid" : "Not paid";
        
        const cancelService = document.createElement("button");
        cancelService.classList.add("btn", "btn-danger");
        cancelService.id = "delete-bought-service";
        cancelService.textContent = "Cancel Service";
        cancelService.style.marginLeft = "66px";

        innerContainer.appendChild(infoContainer);
        innerContainer.appendChild(description);
        innerContainer.appendChild(serviceDescription);
        innerContainer.appendChild(viewOrderButton);
        if(service.isPaid === 0){
          innerContainer.appendChild(cancelService);
        }

        cancelService.addEventListener("click", () => {
          const transactionId = service.transaction_ID;

          const currentUrl = window.location.href;
          const newUrl = currentUrl.endsWith("/cancel") ? currentUrl : currentUrl + "/cancel";
          window.history.pushState({}, "", newUrl);

          deleteBoughtService(transactionId);
        });

        serviceBloc.appendChild(innerContainer);
        servicesHolder.appendChild(serviceBloc);
      });
    } else {
      console.log("No services bought yet.");
    }
  })
  .catch((error) => console.error("Error fetching user data:", error));

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

async function handleSearch(event) {
  const query = event.target.value.trim();
  searchResults.innerHTML = '';

  if (!query) {
    searchResults.style.display = 'none';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/Frontend/account-settings.html?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const services = await response.json();

    services.forEach(service => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.textContent = service.Title;
      div.onclick = () => {
        window.location.href = `./productPage1.html?id=${service.service_ID}`;
      };
      searchResults.appendChild(div);
    });

    searchResults.style.display = services.length ? 'block' : 'none';
  } catch (error) {
    console.error(error);
  }
}

function deleteBoughtService(transactionId) {
  if (!transactionId) {
    alert("Transaction ID is missing!");
    return;
  }
  fetch("http://localhost:3000/Frontend/account-settings.html/cancel", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ BS_id: transactionId }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Bought service deleted successfully");
        window.location.href = "/Frontend/account-settings.html";
      } else {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
    })
    .catch((error) => {
      console.error("Error deleting bought service:", error);
      alert("Failed to delete the bought service: " + error.message);
    });
}

searchInput.addEventListener('input', handleSearch);
