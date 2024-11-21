function updatePage(event) {
  event.preventDefault();

  const companyName = document.getElementById("name").value;
  const companyAddress = document.getElementById("address").value;
  const companyEmail = document.getElementById("email").value;
  const twitterLink = document.querySelector('input[name="twitter"]').value;
  const linkedinLink = document.querySelector('input[name="linkedin"]').value;
  const instagramLink = document.querySelector('input[name="instagram"]').value;
  const phoneNumber = document.getElementById("phone").value;
  const descriptionTitle = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const companyImage = document.getElementById("upload").files[0];

  localStorage.setItem("companyName", companyName);
  localStorage.setItem("companyAddress", companyAddress);
  localStorage.setItem("companyEmail", companyEmail);
  localStorage.setItem("twitterLink", twitterLink);
  localStorage.setItem("linkedinLink", linkedinLink);
  localStorage.setItem("instagramLink", instagramLink);
  localStorage.setItem("phoneNumber", phoneNumber);
  localStorage.setItem("descriptionTitle", descriptionTitle);
  localStorage.setItem("description", description);

  if (companyImage) {
    const reader = new FileReader();
    reader.onloadend = function () {
      localStorage.setItem("companyImage", reader.result);
      alert("Company information saved successfully!");
      window.location.href = "home-page.html";
    };
    reader.readAsDataURL(companyImage);
  } else {
    alert("Company information saved successfully, but no image was uploaded.");
    window.location.href = "home-page.html";
  }
}
