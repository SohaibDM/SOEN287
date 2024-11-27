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

      // Function to render table rows for unpaid services
      const renderTable = (filteredData) => {
        // Clear the existing rows
        tableBody.innerHTML = "";

        // Populate table with filtered data
        filteredData.forEach((service) => {
          const customer = data.customers.find(
            (cust) => cust.customer_ID === service.customer_ID
          );
          const serviceDetail = data.serviceDetails.find(
            (srv) => srv.service_ID === service.service_ID
          );

          const row = document.createElement("tr");
          row.innerHTML = `
                                <td scope="row" id="service-name">${
                                  serviceDetail?.Title || "Unknown Service"
                                }</td>
                                <td id="customer-name">${
                                  customer?.Name || "Unknown Customer"
                                }</td>
                                <td id="customer-username">${
                                  customer?.Username || "N/A"
                                }</td>
                                <td id="date-availed">${
                                  formatDate(service.purchaseDate) || "N/A"
                                }</td>
                                <td><button class="btn btn-primary follow-up-button">Follow Up</button></td>
                            `;
          tableBody.appendChild(row);
        });
      };

      // Initial render of unpaid services
      const unpaidServices = data.boughtServices.filter(
        (service) => !service.isPaid
      );
      renderTable(unpaidServices);

      // Add event listeners for filters
      const usernameInput = document.querySelector(".name-input");
      const dateInput = document.querySelector(".date-input");

      const filterTable = () => {
        const usernameFilter = usernameInput.value.toLowerCase();
        const dateFilter = dateInput.value;

        const filteredServices = unpaidServices.filter((service) => {
          const customer = data.customers.find(
            (cust) => cust.customer_ID === service.customer_ID
          );
          const usernameMatches =
            customer?.Username.toLowerCase().includes(usernameFilter);
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

      // Event listener for follow-up buttons
      // Event listener for follow-up buttons
      // Event listener for follow-up buttons
      tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("follow-up-button")) {
          const row = event.target.closest("tr");

          const serviceName = row.querySelector("#service-name").textContent;
          const customerName = row.querySelector("#customer-name").textContent;
          const username = row.querySelector("#customer-username").textContent;

          // Find customer email
          const customer = data.customers.find(
            (cust) => cust.Username === username
          );

          if (customer?.Email) {
            // Gmail mailto link format
            const subject = encodeURIComponent("Unpaid Service Bill Reminder");
            const body = encodeURIComponent(
              `Dear ${customerName},\n\nYou have an unpaid bill for the service "${serviceName}". Please settle your bill at the earliest.\n\nThank you,\nYour Service Team`
            );

            // Create the Gmail compose URL
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${customer.Email}&su=${subject}&body=${body}`;

            // Open the Gmail compose page in a new tab
            window.open(gmailComposeUrl, "_blank");
          } else {
            alert("Customer email not found.");
          }
        }
      });
    } else {
      console.log("No unpaid services found.");
    }
  })
  .catch((error) => console.error("Error fetching user data:", error));

 
