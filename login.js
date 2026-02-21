function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem('users'));
  const user = users.find(u => u.email === email && u.password === password);

  if(!user){
    document.getElementById("message").textContent = "Hibás email vagy jelszó!";
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify(user));
  window.location.href = "profile.html"; // átirányítás profil oldalra
}