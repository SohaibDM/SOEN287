document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("id");

  if (!serviceId) {
    alert("Service ID not found in the URL!");
    return;
  }

  fetch(`http://localhost:3000/services/${serviceId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch service details.");
      }
      return response.json();
    })
    .then((service) => {
      console.log(service);
      document.querySelector(".card-img-top").src = service.Image.startsWith(
        "http"
      )
        ? service.Image
        : `http://localhost:3000${service.Image}`;
      document.querySelector(".display-5").textContent = service.Title;
      document.querySelector(
        ".text-decoration-line-through"
      ).textContent = `$${service.originalPrice}`;
      document.querySelector(".text-decoration-line-through").style.color =
        "#ff6b6b";
      document.querySelector(
        ".text-decoration-line-through + span"
      ).textContent = `$${service.Price}`;
      document.querySelector(".lead").textContent = service.Description;
      document.querySelector(
        ".small.mb-1"
      ).textContent = `Category: ${service.Category}`;
      document.querySelector(
        "#availability"
      ).textContent = `Availability: ${service.Availability}`;

      document
        .querySelector("#addToCartButton")
        .addEventListener("click", () => {
          const customerId = sessionStorage.getItem("customer_id");

          if (!customerId) {
            alert("You need to be logged in to add a service to the cart.");
            return;
          }

          if (service.Availability <= 0) {
            alert("This service is out of stock and will be deleted soon.");
            return; 
          }

          service.Availability -= 1;

          const purchaseDate = new Date().toISOString().split("T")[0];
          const data = {
            customer_id: customerId,
            service_id: serviceId,
            purchaseDate: purchaseDate,
            isPaid: false, 
          };

          fetch("http://localhost:3000/addToCart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (response.ok) {
                alert("Service added to cart successfully!");
                document.querySelector(
                  "#availability"
                ).textContent = `Availability: ${service.Availability}`;
              } else {
                throw new Error("Failed to add service to cart.");
              }
            })
            .catch((error) => {
              console.error("Error adding service to cart:", error);
              alert("Failed to add service to cart.");
            });

          fetch(`http://localhost:3000/updateAvailability/${serviceId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ availability: service.Availability }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to update availability.");
              }
            })
            .catch((error) => {
              console.error("Error updating availability:", error);
            });
        });
    })
    .catch((error) => {
      console.error("Error loading service details:", error);
      alert("Failed to load service details.");
    });
});

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

async function handleSearch(event) {
  const query = event.target.value.trim(); 
  searchResults.innerHTML = ""; 

  if (!query) {
    searchResults.style.display = "none";
    return; 
  }

  try {
    const response = await fetch(
      `http://localhost:3000/Frontend/productPage1.html?q=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) throw new Error("Failed to fetch services");
    const services = await response.json();

    services.forEach((service) => {
      const div = document.createElement("div");
      div.className = "search-result-item";
      div.textContent = service.Title;
      div.onclick = () => {
        window.location.href = `./productPage1.html?id=${service.service_ID}`;
      };
      searchResults.appendChild(div);
    });

    searchResults.style.display = services.length ? "block" : "none";
  } catch (error) {
    console.error(error);
  }
}

searchInput.addEventListener("input", handleSearch);
