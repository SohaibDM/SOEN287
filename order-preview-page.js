function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Retrieve the order name from the query parameter
const orderName = getQueryParam("order");

// Populate the page with the correct order details
const serviceTitle = document.querySelector(".service-title");
const priceButton = document.querySelector(".price-button");

if (orderName === "Plugin Builder") {
  serviceTitle.textContent = "Plugin Builder";
  priceButton.textContent = "15.25$";
} else if (orderName === "Website Builder") {
  serviceTitle.textContent = "Website Builder";
  priceButton.textContent = "324.00$";
} else if (orderName === "Logo Design") {
  serviceTitle.textContent = "Logo Design";
  priceButton.textContent = "152.11$";
}
