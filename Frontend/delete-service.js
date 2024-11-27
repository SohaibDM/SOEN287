document.addEventListener("DOMContentLoaded", async () => {
  const serviceList = document.getElementById("service-list");

  try {
    const response = await fetch("http://localhost:3000/services");
    if (!response.ok) {
      throw new Error("Failed to fetch services.");
    }

    const services = await response.json();

    serviceList.innerHTML = "";

    services.forEach((service) => {
      const serviceCard = `
        <div class="col-md-4 mb-4">
          <div class="card bg-dark text-white">
            <img 
              src="http://localhost:3000${service.Image}" 
              class="card-img-top" 
              alt="${service.Title || "Service"}"
              onerror="this.src='https://via.placeholder.com/300x200';"
            >
            <div class="card-body">
              <h5 class="card-title">${service.Title || "Untitled Service"}</h5>
              <p class="card-text">${service.Category || "General"}</p>
              <button class="btn btn-danger" onclick="deleteService(${
                service.service_ID
              })">Delete</button>
            </div>
          </div>
        </div>
      `;

      serviceList.innerHTML += serviceCard;
    });
  } catch (error) {
    console.error("Error loading services:", error);
    serviceList.innerHTML = `
      <p style="color: white;">Failed to load services. Please try again later.</p>
    `;
  }
});

async function deleteService(serviceId) {
  if (!confirm("Are you sure you want to delete this service?")) return;

  try {
    const response = await fetch(
      `http://localhost:3000/deleteService/${serviceId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete service.");
    }

    alert("Service deleted successfully!");
    location.reload(); 
  } catch (error) {
    console.error("Error deleting service:", error);
    alert("Failed to delete service. Please try again later.");
  }
}
