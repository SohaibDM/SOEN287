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
    services.forEach((service) => {
      console.log(service.Image);
      const serviceCard = `
                <div class="col-md-4 mb-4">
                    <div class="bbb_deals">
                        <div class="bbb_deals_title">
                            <a href="/productPage.html?id=${
                              service.id
                            }" style="text-decoration: none; color: inherit;">
                                ${service.Title || "Untitled Service"}
                            </a>
                        </div>
                        <div class="bbb_deals_image">
                            <img src="http://localhost:3000${
                              service.Image
                            }" alt="${service.Title || "Untitled Service"}">
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
