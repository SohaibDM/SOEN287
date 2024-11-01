let services = [
  {
    id: 1,
    name: "Service 1",
    category: "Category 1",
    price: 2400,
    originalPrice: 2800,
    available: 5,
  },
  {
    id: 2,
    name: "Service 2",
    category: "Category 2",
    price: 2800,
    originalPrice: 3200,
    available: 3,
  },
  {
    id: 3,
    name: "Service 3",
    category: "Category 3",
    price: 4000,
    originalPrice: 4500,
    available: 2,
  },
  {
    id: 4,
    name: "Service 4",
    category: "Category 4",
    price: 3000,
    originalPrice: 3500,
    available: 1,
  },
  {
    id: 5,
    name: "Service 5",
    category: "Category 5",
    price: 3500,
    originalPrice: 3900,
    available: 4,
  },
  {
    id: 6,
    name: "Service 6",
    category: "Category 6",
    price: 2700,
    originalPrice: 3000,
    available: 6,
  },
];

let servicesNum = services.length;

function renderServices() {
  const serviceList = document.getElementById("service-list");
  serviceList.innerHTML = ""; 
  services.forEach((service) => {
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
                        <button class="btn btn-danger mt-2" onclick="deleteService(${
                          service.id
                        })">Delete</button>
                    </div>
                </div>
            </div>
        `;
    serviceList.innerHTML += serviceHTML;
  });
}


function deleteService(serviceId) {
  if (confirm("Are you sure you want to delete this service?")) {
    services = services.filter((service) => service.id !== serviceId); 
    renderServices(); 
    alert("Service has been deleted.");

    localStorage.setItem("services", JSON.stringify(services));
  }
}

function addService(name, category, price, originalPrice, available) {
  const newService = {
    id: Math.floor(Math.random() * (230 - 7 + 1)) + 7, 
    name,
    category,
    price,
    originalPrice,
    available,
  };

  services.push(newService); 
  localStorage.setItem("services", JSON.stringify(services));
  renderServices(); 

}

function loadServices() {
  const savedServices = localStorage.getItem("services");
  if (savedServices) {
    services = JSON.parse(savedServices);
  }
  renderServices();
}

document.addEventListener("DOMContentLoaded", loadServices);
