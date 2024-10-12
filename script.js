const wrapper = document.querySelector('.wrapper');
const loginLink= document.querySelector('.login-link');
const registerLink =  document.querySelector('.register-link');
const adminLink =  document.querySelector('.admin-link');
const adminPopupBtn = document.querySelector('.btnAdmin-popup');


registerLink.addEventListener('click', ()=>{wrapper.classList.add('active');});
loginLink.addEventListener('click', ()=>{wrapper.classList.remove('active', 'admin-active');});
adminLink.addEventListener('click', ()=>{wrapper.classList.add('admin-active');});
adminPopupBtn.addEventListener('click', () => {wrapper.classList.add('admin-active');});


