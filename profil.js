// Lekéri a bejelentkezett felhasználót
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Megjeleníti a profil adatait
function showProfile() {
  const user = getCurrentUser();
  if(!user){
    window.location.href = "login.html"; // ha nincs bejelentkezve, login oldalra
    return;
  }

  const profileArea = document.getElementById("profileArea");
  profileArea.innerHTML = `
    <h3>Üdv, ${user.name}!</h3>
    <p>Név: ${user.name}</p>
    <p>Életkor: ${user.age}</p>
    <p>Nem: ${user.gender}</p>
    <p>Email: ${user.email}</p>
    <p>Jelenlegi egyenleg: ${user.balance} €</p>
    <input type="number" id="addAmount" placeholder="Összeg feltöltése">
    <button onclick="addBalance()">Feltöltés</button><br><br>
    <button onclick="goHome()">Vissza a főoldalra</button>
    <button onclick="logout()">Kijelentkezés</button>
  `;
}

// Feltölti a pénzt
function addBalance() {
  const amount = parseFloat(document.getElementById("addAmount").value);
  if(isNaN(amount) || amount <= 0) return alert("Adj meg egy pozitív számot!");

  let user = getCurrentUser();
  let users = JSON.parse(localStorage.getItem('users'));

  user.balance += amount;
  users = users.map(u => u.email === user.email ? user : u);

  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));

  showProfile();
}

// Kijelentkezés
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = "index.html";
}

// Vissza a főoldalra
function goHome() {
  window.location.href = "index.html";
}

window.onload = showProfile;