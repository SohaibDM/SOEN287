document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get("id");

  if (!serviceId) {
    alert("Service ID not found in the URL!");
    return;
  }

  fetch(`https://soen287-2j07.onrender.com/services/${serviceId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch service details.");
      }
      return response.json();
    })
    .then((service) => {
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

  const form = document.querySelector(".service-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedService = {
      Title: document.getElementById("serviceName").value,
      Category: document.getElementById("category").value,
      Price: parseFloat(document.getElementById("price").value),
      originalPrice: parseFloat(document.getElementById("originalPrice").value),
      Availability: parseInt(document.getElementById("availability").value, 10),
      Description: document.getElementById("servicedescription").value,
    };

    const imageInput = document.getElementById("serviceImage");
    const formData = new FormData();
    formData.append("data", JSON.stringify(updatedService));

    if (imageInput.files[0]) {
      formData.append("serviceImage", imageInput.files[0]);
    }

    fetch(`https://soen287-2j07.onrender.com/services/${serviceId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert("Service updated successfully!");
          window.location.href = "./ServicesPage.html"; 
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
