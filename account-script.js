function showSection(section) {
  const accountSection = document.getElementById("account-section");
  const ordersSection = document.getElementById("orders-section");

  if (section === "account") {
    accountSection.classList.remove("d-none");
    ordersSection.classList.add("d-none");
  } else if (section === "orders") {
    ordersSection.classList.remove("d-none");
    accountSection.classList.add("d-none");
  }
}


function goToOrderPreview(button) {
  const serviceBloc = button.closest('.service-bloc');
  const serviceTitle = serviceBloc.querySelector('.service-title').textContent;
  const price = serviceBloc.querySelector('.price-button').textContent;

  window.location.href = `order-preview-page.html?order=${encodeURIComponent(serviceTitle)}&price=${encodeURIComponent(price)}`;
}



