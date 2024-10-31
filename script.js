const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelectorAll('.login-link');
const registerLink = document.querySelectorAll('.register-link');
const adminLink = document.querySelectorAll('.admin-link');
const adminPopupBtn = document.querySelector('.btnAdmin-popup');
const loginForm = document.querySelector('.form-box.login');
const registerForm = document.querySelector('.form-box.register');
const adminForm = document.querySelector('.form-box.admin');

function resetForms() {
  document.querySelector(".form-box.login").classList.remove("active");
  document.querySelector(".form-box.register").classList.remove("active");
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
