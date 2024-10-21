const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelectorAll('.login-link');
const registerLink = document.querySelectorAll('.register-link');
const adminLink = document.querySelectorAll('.admin-link');
const adminPopupBtn = document.querySelector('.btnAdmin-popup');

function resetForms() {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    adminForm.classList.remove('active');
}

loginLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent href default behavior
    wrapper.classList.remove('active');
    wrapper.classList.remove('admin-active');
    resetForms();
  });
});

registerLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); 
    wrapper.classList.add('active');
    resetForms();
  });
});


adminLink.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); 
    wrapper.classList.add('admin-active');
  });
});

adminPopupBtn.addEventListener('click', (event) => {
  event.preventDefault();
  wrapper.classList.add('admin-active');
});
