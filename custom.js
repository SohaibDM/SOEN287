function updatePage(event) {
  event.preventDefault();

  const companyName = document.getElementById("name").value;
  const companyAddress = document.getElementById("address").value;
  const companyEmail = document.getElementById("email").value;
  const twitterLink = document.querySelector('input[name="twitter"]').value;
  const linkedinLink = document.querySelector('input[name="linkedin"]').value;
  const instagramLink = document.querySelector('input[name="instagram"]').value;
  const youtubeLink = document.querySelector('input[name="youtube"]').value;

  localStorage.setItem("companyName", companyName);
  localStorage.setItem("companyAddress", companyAddress);
  localStorage.setItem("companyEmail", companyEmail);
  localStorage.setItem("twitterLink", twitterLink);
  localStorage.setItem("linkedinLink", linkedinLink);
  localStorage.setItem("instagramLink", instagramLink);
  localStorage.setItem("youtubeLink", youtubeLink);

  alert("Company information saved successfully!");
  window.location.href = "home-page.html";
}
