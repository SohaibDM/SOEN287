const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelectorAll('.login-link');
const registerLink = document.querySelectorAll('.register-link');
const adminLink = document.querySelectorAll('.admin-link');
const adminPopupBtn = document.querySelector('.btnAdmin-popup');
const loginButton = document.querySelector('.login-button');
const adminButton = document.querySelector('.admin-button');



const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const displayUsername = document.getElementById("displayUsername");
const logoutButton = document.querySelector(".logout-button");

const companyName = document.getElementById("title");
const descriptionTitle = document.getElementById("descriptionTitle");
const description = document.getElementById("description");
const address = document.querySelector("#footer .col:nth-child(3) .nav-link");
const email = document.querySelector("#footer .col:nth-child(2) .nav-link");
const phoneNumber = document.querySelector("#footer .col:nth-child(4) .nav-link");
const twitterLink =document.getElementById("twitter-link");
const instagramLink = document.getElementById("instagram-link");
const linkedinLink = document.getElementById("linkedin-link");
const imageSrc = document.getElementById("companyImageDisplay");


document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded and parsed.");
  fetch("http://localhost:3000/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data from the backend.");
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      if (data && data.length > 0) {
        const record = data[0]; // Assuming there's only one row in the `page` table
        console.log("Data fetched from the backend:", record);

        // Populate the form fields with the retrieved data
        companyName.textContent = record.Company_Name;
        console.log(record.Company_Name);
        console.log(companyName.value);
        address.textContent = record.Address;
        email.textContent = record.Email;
        phoneNumber.textContent = record.Number;
        descriptionTitle.textContent = record.Desc_Title;
        description.textContent = record.Description;
        twitterLink.href = record.Twitter;
        instagramLink.href = record.Instagram;
        linkedinLink.href = record.Linkedin;

        if (record.Image && record.Image.data) {
          const byteArray = new Uint8Array(record.Image.data);
          const blob = new Blob([byteArray], { type: "image/jpeg" }); // Adjust type if needed (e.g., image/png)
          const imageUrl = URL.createObjectURL(blob);

          // Set the `src` attribute of the image element
          imageSrc.src = imageUrl;
          imageSrc.alt = "Company Image";
        }


        console.log("Form fields populated with backend data.");
      } else {
        console.warn("No data available to populate the form.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});













function resetForms() {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    adminForm.classList.remove('active');
}

loginLink.forEach(link => {
  link.addEventListener('click', (event) => {
    wrapper.classList.add('login-active');
    wrapper.classList.remove('active');
    wrapper.classList.remove('admin-active');
    resetForms();
    event.preventDefault(); 
  });
});

registerLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); 
    wrapper.classList.add('active');
    wrapper.classList.remove('admin-active');
    wrapper.classList.remove('login-active');
    resetForms();
  });
});


adminLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); 
    wrapper.classList.add('admin-active');
    wrapper.classList.remove('active');
    wrapper.classList.remove('login-active');
  });
});

adminPopupBtn.addEventListener('click', (event) => {
  event.preventDefault();
  wrapper.classList.add('admin-active');
});


function checkUser() {
  const displayUsername = document.getElementById("displayUsername");

  if (displayUsername.textContent.trim() === "Guest") {
    event.preventDefault();
    window.location.href = "login.html";
  }
}


