document
  .querySelector(".service-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append(
        "serviceName",
        document.getElementById("serviceName").value
      );
      formData.append("category", document.getElementById("category").value);
      formData.append("price", document.getElementById("price").value);
      formData.append(
        "originalPrice",
        document.getElementById("originalPrice").value
      );
      formData.append(
        "availability",
        document.getElementById("availability").value
      );
      formData.append(
        "description",
        document.getElementById("servicedescription").value
      ); // Add the description
      formData.append(
        "serviceImage",
        document.getElementById("serviceImage").files[0]
      );

      // Send the FormData object to the backend
      fetch("http://localhost:3000/addService", {
        method: "POST",
        body: formData, // Send FormData directly
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch from the server.");
          }

          return response.text(); // Handle plain text response
        })
        .then((data) => {
          alert(data || "Service added successfully!"); // Display the response message
        })
        .catch((error) => {
          alert("An error occurred while submitting the form.");
        });
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  });
