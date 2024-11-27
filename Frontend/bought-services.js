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
            console.log(service.transaction_ID);
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
            <td id="customer-name">${customer?.Name || "Unknown Customer"}</td>
            <td id="customer-username">${customer?.Username || "N/A"}</td>
            <td id="date-availed">${
              formatDate(service.purchaseDate) || "N/A"
            }</td>
            <td id="status">${service.isPaid ? "Paid" : "Unpaid"}</td>
            <td id="execute-status">
              ${
                service.isExecuted
                  ? '<span class="badge bg-success">Executed</span>'
                  : `<button class="btn btn-primary execute-button" data-transaction-id="${service.transaction_ID}">Execute</button>`
              }
            </td>
          `;
            tableBody.appendChild(row);
          });

          const executeButtons = document.querySelectorAll(".execute-button");

          executeButtons.forEach((button) => {
            button.addEventListener("click", () => {
              console.log(button.dataset);
              const transactionId = button.dataset.transactionId;

              fetch(
                `https://soen287-2j07.onrender.com/executeTransaction/${transactionId}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ isExecuted: true }),
                }
              )
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Failed to execute transaction.");
                  }
                  return response.json();
                })
                .then((result) => {
                  if (result.success) {
                    alert("Transaction executed successfully!");
                    const row = button.closest("tr");
                    row.querySelector("#execute-status").innerHTML =
                      '<span class="badge bg-success">Executed</span>';
                  }
                })
                .catch((error) => {
                  console.error("Error executing transaction:", error);
                  alert("Failed to execute transaction.");
                });
            });
          });

        };

        renderTable(data.boughtServices);

        const usernameInput = document.querySelector(".name-input");
        const dateInput = document.querySelector(".date-input");

        const filterTable = () => {
          const usernameFilter = usernameInput.value.toLowerCase();
          const dateFilter = dateInput.value;

          const filteredServices = data.boughtServices.filter((service) => {
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
      } else {
        console.log("No services bought yet.");
      }
    })
    .catch((error) => console.error("Error fetching user data:", error));
