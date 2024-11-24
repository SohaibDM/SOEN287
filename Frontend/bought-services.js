// Helper function to format the date as YYYY/MM/DD
function formatDate(dateString) {
    const dateObj = new Date(dateString); // Convert to Date object
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero if needed
    const day = String(dateObj.getDate()).padStart(2, "0"); // Get day and pad with leading zero if needed
    return `${year}/${month}/${day}`;
  }



  fetch(`http://localhost:3000/Frontend/bought-services.html`)
  .then((response) => response.json())
  .then((data) => {
    if (data.boughtServices && data.boughtServices.length > 0) {
    const tableBody = document.getElementById("table-body");

    // Loop through bought services and populate rows
    data.boughtServices.forEach((service) => {
    // Find the associated customer and service details
    const customer = data.customers.find((cust) => cust.customer_ID === service.customer_ID);
    const serviceDetail = data.serviceDetails.find((srv) => srv.service_ID === service.service_ID);

    // Create a new row
    const row = document.createElement("tr");

    // Populate row cells
    row.innerHTML = `
        <td scope="row" id="service-name">${serviceDetail?.Title || "Unknown Service"}</td>
        <td id="customer-name">${customer?.Name || "Unknown Customer"}</td>
        <td id="customer-username">${customer?.Username || "N/A"}</td>
        <td id="date-availed">${formatDate(service.purchaseDate) || "N/A"}</td>
        <td id="status">${service.isPaid ? "Paid" : "Unpaid"}</td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
    });
} else {
    console.log("No services bought yet.");
}
})
.catch((error) => console.error("Error fetching user data:", error));
