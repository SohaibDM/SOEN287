document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend.");
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.length > 0) {
        const record = data[0];

        document.getElementById("name").value = record.Company_Name || "";
        document.getElementById("address").value = record.Address || "";
        document.getElementById("email").value = record.Email || "";
        document.getElementById("phone").value = record.Number || "";
        document.getElementById("desc_title").value = record.Desc_Title || "";
        document.getElementById("description").value = record.Description || "";
        document.querySelector("[name='twitter']").value = record.Twitter || "";
        document.querySelector("[name='instagram']").value =
          record.Instagram || "";
        document.querySelector("[name='linkedin']").value =
          record.Linkedin || "";

        console.log("Form fields populated with backend data.");
      } else {
        console.warn("No data available to populate the form.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

document
  .querySelector(".split-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

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

    fetch("http://localhost:3000/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
