const inputEmail = document.querySelector('.input-email');
const inputName = document.querySelector('.input-name');
const form = document.querySelector('.form-control');
const button = document.querySelector('.submit-btn');

button.addEventListener('click', (e) => {
  e.preventDefault();
  const email = inputEmail.value;
  const name = inputName.value;

  if (email.trim() === '' || name.trim() === '') return;

  setTimeout(function () {
    alert(`Form is Submitted ☑️\nName: ${name} | Email: ${email}`);
  }, 400);
});

window.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    //checks whether the pressed key is "Enter"
    button.classList.add('active');

    setTimeout(function () {
      button.classList.remove('active');
    }, 100);
  }
});
