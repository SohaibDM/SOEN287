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

      // Function to render table rows
      const renderTable = (filteredData) => {
        // Clear the existing rows
        tableBody.innerHTML = "";

        // Populate table with filtered data
        filteredData.forEach((service) => {
          const customer = data.customers.find((cust) => cust.customer_ID === service.customer_ID);
          const serviceDetail = data.serviceDetails.find((srv) => srv.service_ID === service.service_ID);

          const row = document.createElement("tr");
          row.innerHTML = `
            <td scope="row" id="service-name">${serviceDetail?.Title || "Unknown Service"}</td>
            <td id="customer-name">${customer?.Name || "Unknown Customer"}</td>
            <td id="customer-username">${customer?.Username || "N/A"}</td>
            <td id="date-availed">${formatDate(service.purchaseDate) || "N/A"}</td>
            <td id="status">${service.isPaid ? "Paid" : "Unpaid"}</td>
          `;
          tableBody.appendChild(row);
        });
      };

      // Initial render of all rows
      renderTable(data.boughtServices);

      // Add event listeners for filters
      const usernameInput = document.querySelector(".name-input");
      const dateInput = document.querySelector(".date-input");

      const filterTable = () => {
        const usernameFilter = usernameInput.value.toLowerCase();
        const dateFilter = dateInput.value;

        const filteredServices = data.boughtServices.filter((service) => {
          const customer = data.customers.find((cust) => cust.customer_ID === service.customer_ID);
          const usernameMatches = customer?.Username.toLowerCase().includes(usernameFilter);
          const dateMatches = service.purchaseDate.startsWith(dateFilter);
          
          // Apply filters if values are provided
          return (
            (usernameFilter ? usernameMatches : true) &&
            (dateFilter ? dateMatches : true)
          );
        });

        renderTable(filteredServices);
      };

      // Attach filtering logic to input events
      usernameInput.addEventListener("input", filterTable);
      dateInput.addEventListener("input", filterTable);
    } else {
      console.log("No services bought yet.");
    }
  })
  .catch((error) => console.error("Error fetching user data:", error));
