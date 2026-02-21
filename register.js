if(!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));

function registerUser() {
  const name = document.getElementById("name").value;
  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem('users'));

  if(users.find(u => u.email === email)){
    document.getElementById("message").textContent = "Már létezik felhasználó ezzel az email-lel!";
    return;
  }

  users.push({name, age, gender, email, password, balance: 0});
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById("message").textContent = "Sikeres regisztráció! Most bejelentkezhetsz.";
}