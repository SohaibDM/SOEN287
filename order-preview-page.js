function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const orderName = getQueryParam("order");
const orderPrice = getQueryParam("price");

const serviceTitle = document.querySelector(".service-title");
const priceButton = document.querySelector(".price-button");

if (orderName) {
  serviceTitle.textContent = orderName;
}

if (orderPrice) {
  priceButton.textContent = orderPrice;
}
