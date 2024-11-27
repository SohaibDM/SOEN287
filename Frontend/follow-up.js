function formatDate(dateString) {
  const dateObj = new Date(dateString); 
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0"); 
  return `${year}/${month}/${day}`;
}

fetch(`https://soen287-2j07.onrender.com/Frontend/bought-services.html`)
  .then((response) => response.json())
  .then((data) => {
    if (data.boughtServices && data.boughtServices.length > 0) {
      const tableBody = document.getElementById("table-body");

      const renderTable = (filteredData) => {
        tableBody.innerHTML = "";

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

      const unpaidServices = data.boughtServices.filter(
        (service) => !service.isPaid
      );
      renderTable(unpaidServices);

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

          return (
            (usernameFilter ? usernameMatches : true) &&
            (dateFilter ? dateMatches : true)
          );
        });

        renderTable(filteredServices);
      };

      usernameInput.addEventListener("input", filterTable);
      dateInput.addEventListener("input", filterTable);
      tableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("follow-up-button")) {
          const row = event.target.closest("tr");

          const serviceName = row.querySelector("#service-name").textContent;
          const customerName = row.querySelector("#customer-name").textContent;
          const username = row.querySelector("#customer-username").textContent;

          const customer = data.customers.find(
            (cust) => cust.Username === username
          );

          if (customer?.Email) {
            const subject = encodeURIComponent("Unpaid Service Bill Reminder");
            const body = encodeURIComponent(
              `Dear ${customerName},\n\nYou have an unpaid bill for the service "${serviceName}". Please settle your bill at the earliest.\n\nThank you,\nYour Service Team`
            );
            const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${customer.Email}&su=${subject}&body=${body}`;

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

 
