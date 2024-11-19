document
  .querySelector(".split-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
      image: null, // File uploads require separate handling (add this later with multer or similar)
      company_name: document.getElementById("name").value,
      address: document.getElementById("address").value,
      email: document.getElementById("email").value,
      number: document.getElementById("phone").value,
      desc_title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      twitter: document.querySelector("[name='twitter']").value,
      instagram: document.querySelector("[name='instagram']").value,
      linkedin: document.querySelector("[name='linkedin']").value,
    };

    fetch("http://localhost:3000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data); // Display success or error message
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
