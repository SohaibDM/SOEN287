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
      // Populate the form fields with service details
      document.getElementById("serviceName").value = service.Title;
      document.getElementById("category").value = service.Category;
      document.getElementById("price").value = service.Price;
      document.getElementById("originalPrice").value = service.originalPrice;
      document.getElementById("availability").value = service.Availability;
      document.getElementById("servicedescription").value = service.Description;
    })
    .catch((error) => {
      console.error("Error loading service details:", error);
      alert("Failed to load service details.");
    });

  // Handle form submission for updating the service
  const form = document.querySelector(".service-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    // Collect updated service details from the form
    const updatedService = {
      Title: document.getElementById("serviceName").value,
      Category: document.getElementById("category").value,
      Price: parseFloat(document.getElementById("price").value),
      originalPrice: parseFloat(document.getElementById("originalPrice").value),
      Availability: parseInt(document.getElementById("availability").value, 10),
      Description: document.getElementById("servicedescription").value,
    };

    // Handle image upload if a new image is selected
    const imageInput = document.getElementById("serviceImage");
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedService));

    if (imageInput.files[0]) {
      formData.append("serviceImage", imageInput.files[0]);
    }

    // Send the updated service details to the backend
    fetch(`http://localhost:3000/services/${serviceId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Service updated successfully!");
          window.location.href = "./ServicesPage.html"; // Redirect to services page
        } else {
          throw new Error("Failed to update service.");
        }
      })
      .catch((error) => {
        console.error("Error updating service:", error);
        alert("Failed to update service.");
      });
  });
});
