let services = [];

// Function to render services
function renderServices() {
  const serviceList = document.getElementById("service-list");
  serviceList.innerHTML = "";
  const servicesToDisplay = services.slice(0, 3);

  servicesToDisplay.forEach((service) => {
    const serviceHTML = `
            <div class="col-md-4 mb-4">
                <div class="bbb_deals">
                    <div class="bbb_deals_title">
                        <a href="/productPage${
                          service.id
                        }.html" style="text-decoration: none; color: inherit;">${
      service.name
    }</a>
                    </div>
                    <div class="bbb_deals_image">
                        <img src="https://via.placeholder.com/300x200" alt="${
                          service.name
                        }">
                    </div>
                    <div class="bbb_deals_content">
                        <div class="bbb_deals_item_category"><a href="#">${
                          service.category
                        }</a></div>
                        <div class="bbb_deals_item_name">Premium Package</div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="bbb_deals_item_price_a">$${
                              service.originalPrice
                            }</span>
                            <span class="bbb_deals_item_price">$${
                              service.price
                            }</span>
                        </div>
                        <div class="available">
                            <div class="available_title">Available: <span>${
                              service.available
                            }</span></div>
                            <div class="available_bar"><span style="width:${
                              (service.available / 5) * 100
                            }%"></span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    serviceList.innerHTML += serviceHTML;
  });
}

function addService(name, category, price, originalPrice, available) {
  const newService = {
    id: services.length + 1, // Generate a new ID
    name,
    category,
    price,
    originalPrice,
    available,
  };

  services.push(newService); // Add the new service to the array
  localStorage.setItem("services", JSON.stringify(services)); // Update localStorage
  renderServices(); // Re-render the services list
}

// Load services from localStorage if available
function loadServices() {
  const savedServices = localStorage.getItem("services");
  if (savedServices) {
    services = JSON.parse(savedServices);
  }
  renderServices();
}

// Call loadServices on page load
document.addEventListener("DOMContentLoaded", loadServices);
