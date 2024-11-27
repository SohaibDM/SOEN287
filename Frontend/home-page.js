document.addEventListener("DOMContentLoaded", async () => {
  const servicesContainer = document.getElementById("services-container");

  try {
    const response = await fetch("http://localhost:3000/services");
    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    const services = await response.json();

    // Clear the container before adding new services
    servicesContainer.innerHTML = "";

    // Display only the first 3 services
    services.slice(0, 3).forEach((service) => {
        console.log(service.Image);
      const serviceCard = `
                <div class="col-md-4 mb-4">
                    <div class="bbb_deals">
                        <div class="bbb_deals_title">
                            <a href="./productPage1.html?id=${
                              service.service_ID
                            }" style="text-decoration: none; color: inherit;">
                                ${service.Title || "Untitled Service"}
                            </a>
                        </div>
                        <div class="bbb_deals_image">
                          <img 
                              src="${service.Image.startsWith('http') ? service.Image : `http://localhost:3000${service.Image}`}" 
                              alt="${service.Title || 'Untitled Service'}">
                        </div>
                        <div class="bbb_deals_content">
                            <div class="bbb_deals_item_category">
                                <a href="#">${service.Category || "General"}</a>
                            </div>
                            <div class="bbb_deals_item_name">Premium Package</div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="bbb_deals_item_price_a">
                                    ${
                                      service.originalPrice
                                        ? `$${service.originalPrice}`
                                        : "N/A"
                                    }
                                </span>
                                <span class="bbb_deals_item_price">
                                    ${
                                      service.Price
                                        ? `$${service.Price}`
                                        : "N/A"
                                    }
                                </span>
                            </div>
                            <div class="available">
                                <div class="available_title">Available: <span>${
                                  service.Availability || 0
                                }</span></div>
                                <div class="available_bar">
                                    <span style="width:${
                                      Math.min(service.Availability / 10, 1) *
                                      100
                                    }%"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

      servicesContainer.innerHTML += serviceCard;
    });
  } catch (error) {
    console.error("Error loading services:", error);
    servicesContainer.innerHTML = `<p style="color: white;">Failed to load services. Please try again later.</p>`;
  }
});


const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Handle input for search
async function handleSearch(event) {
    const query = event.target.value.trim(); // Get user input
    searchResults.innerHTML = ''; // Clear previous results

    if (!query) {
        searchResults.style.display = 'none';
        return; // Exit if input is empty
    }

    try {
        // Fetch matching services from the server
        const response = await fetch(`http://localhost:3000/Frontend/home-page.html?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const services = await response.json();

        // Display results
        services.forEach(service => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.textContent = service.Title;
            div.onclick = () => {
                window.location.href = `./productPage1.html?id=${service.service_ID}`; // Redirect to service details
            };
            searchResults.appendChild(div);
        });

        searchResults.style.display = services.length ? 'block' : 'none';
    } catch (error) {
        console.error(error);
    }
}

// Add event listener to the search bar
searchInput.addEventListener('input', handleSearch);
