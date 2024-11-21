document
  .querySelector(".split-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Create a FormData object
    const formData = new FormData();
    formData.append("image", document.getElementById("upload").files[0]); 
    formData.append("company_name", document.getElementById("name").value);
    formData.append("address", document.getElementById("address").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("number", document.getElementById("phone").value);
    formData.append("title", document.getElementById("desc_title").value);
    formData.append(
      "description",
      document.getElementById("description").value
    );
    formData.append(
      "twitter",
      document.querySelector("[name='twitter']").value
    );
    formData.append(
      "instagram",
      document.querySelector("[name='instagram']").value
    );
    formData.append(
      "linkedin",
      document.querySelector("[name='linkedin']").value
    );

    console.log("FormData ready to be sent.");

    // Send the FormData object to the backend
    fetch("http://localhost:3000/submit", {
      method: "POST",
      body: formData, // Send FormData directly
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data); // Display success or error message
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
