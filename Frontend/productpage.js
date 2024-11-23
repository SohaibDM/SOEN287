document.addEventListener("DOMContentLoaded", () => {
  // Extract the serviceId from the query string
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("id");

  if (!serviceId) {
    alert("Service ID not found in the URL!");
    return;
  }

  // Fetch service details from the backend
  fetch(`http://localhost:3000/services/${serviceId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch service details.");
      }
      return response.json();
    })
    .then((service) => {
      // Populate the page with service details
      console.log(service);
      document.querySelector(
        ".card-img-top"
      ).src = `http://localhost:3000${service.Image}`;
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

      // Add event listener for the "Add to Cart" button
      document
        .querySelector("#addToCartButton")
        .addEventListener("click", () => {
          const customerId = sessionStorage.getItem("customer_id");

          if (!customerId) {
            alert("You need to be logged in to add a service to the cart.");
            return;
          }

          // Prepare the data to be sent to the backend
          const purchaseDate = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
          const data = {
            customer_id: customerId,
            service_id: serviceId,
            purchaseDate: purchaseDate,
            isPaid: false, // Set the default value for isPaid to false
          };

          // Send a POST request to add the service to the cart (boughtServices table)
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
              } else {
                throw new Error("Failed to add service to cart.");
              }
            })
            .catch((error) => {
              console.error("Error adding service to cart:", error);
              alert("Failed to add service to cart.");
            });
        });
    })
    .catch((error) => {
      console.error("Error loading service details:", error);
      alert("Failed to load service details.");
    });
});
