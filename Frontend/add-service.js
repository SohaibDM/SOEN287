document
  .querySelector(".service-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    try {
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
      );
      formData.append(
        "serviceImage",
        document.getElementById("serviceImage").files[0]
      );

      fetch("https://soen287-2j07.onrender.com/addService", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch from the server.");
          }

          return response.text();
        })
        .then((data) => {
          alert(data || "Service added successfully!");
        })
        .catch((error) => {
          alert("An error occurred while submitting the form.");
        });
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  });
