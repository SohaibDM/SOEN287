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
      document.querySelector(".card-img-top").src = `http://localhost:3000${service.Image}`;
      document.querySelector(".display-5").textContent = service.Title;
      document.querySelector(
        ".text-decoration-line-through"
      ).textContent = `$${service.originalPrice}`;
      document.querySelector(".text-decoration-line-through").style.color =
        "#ff6b6b";
      document.querySelector(
        ".text-decoration-line-through + span"
      ).textContent = `$${service.Price}`;
      console.log(service.Description);
      document.querySelector(".lead").textContent = service.Description;
      document.querySelector(
        ".small.mb-1"
      ).textContent = `Category: ${service.Category}`;
      document.querySelector(
        "#availability"
      ).textContent = `Availability: ${service.Availability}`;
    })
    .catch((error) => {
      console.error("Error loading service details:", error);
      alert("Failed to load service details.");
    });
});
