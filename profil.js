function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}                                                                                 //funkció a current user megkapásra
                                                          //funkció a user updateokra
function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};
}
                                                          //elmenti az új usereket listába beleteszi
function saveUserUpdates(updates) {
  localStorage.setItem("userUpdates", JSON.stringify(updates));
}
                                          //fog egy felhasználót, megnézi vane múdosítás, ha van ráteszi ha nem változatlanul visszaadja
function applyUpdates(user) {
  const updates = getUserUpdates();
  const u = updates[user.email];
  if (!u) return user;
  return { ...user, ...u };
}

function persistUser(user) {
                                                          // elmentjük a user módosított adatait (pl. balance) email alapján
  const updates = getUserUpdates();
  updates[user.email] = { balance: user.balance };
  saveUserUpdates(updates);

                                                                    // frissítjük a currentUser-t is, hogy azonnal látszódjon
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function showProfile() {
  let user = getCurrentUser();
                                                  //ez a felső megh az alsó Megnézi vane bejelentkezett felhasználó ha nincs visszaküldi login oldalra ha van folytatódik profil oldalon
  if (!user) {
    window.location.href = "login.html";
    return;
  }

                                                                      // ha van mentett frissítés, alkalmazzuk
  user = applyUpdates(user);
  localStorage.setItem("currentUser", JSON.stringify(user));

  const area = document.getElementById("profileArea");
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

area.innerHTML = `
  <div class="profile-head">
    <div class="avatar">${initial}</div>
    <div class="profile-title">
      <h2>Üdv, ${user.name}!</h2>
      <p>Itt tudod kezelni a fiókodat és az egyenlegedet.</p>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <span class="info-label">Felhasználónév</span>
      <div class="info-value">${user.name}</div>
    </div>

    <div class="info-box">
      <span class="info-label">Email cím</span>
      <div class="info-value">${user.email}</div>
    </div>

    <div class="info-box balance-box">
      <span class="info-label">Jelenlegi egyenleg</span>
      <div class="info-value">${user.balance} €</div>
    </div>

    <div class="info-box">
      <span class="info-label">Státusz</span>
      <div class="info-value">${user.email === "admin@gmail.com" ? "Admin" : "Játékos"}</div>
    </div>
  </div>

  <div class="topup-card">
    <p class="topup-title">Egyenleg feltöltése</p>
    <div class="input-row">
      <input type="number" id="amount" placeholder="Adj meg egy összeget..." min="1" step="1">
      <button onclick="addBalance()">Feltöltés</button>
    </div>
  </div>

  <div class="btn-row">
    ${user.email === "admin@gmail.com"
      ? `<button class="secondary admin-only" onclick="location.href='accounts.html'">Admin nézet</button>`
      : ""}
    <button class="secondary" onclick="goHome()">Vissza a főoldalra</button>
    <button class="danger" onclick="logout()">Kijelentkezés</button>
  </div>
`;
}

function addBalance() {
  const amount = parseFloat(document.getElementById("amount").value);                   //pénzt hozzáadsz. (a parseFloat a stringet floating-point numberré teszi)
  if (isNaN(amount) || amount <= 0) {                                                           //ellenőrzi 
    alert("Adj meg pozitív számot!");                                           //ha nem szám akkor alert
    return;
  }
                                                          //betölti a usert
  let user = getCurrentUser();
  user = applyUpdates(user);
                                                      //növeli a balancot
  user.balance = (user.balance || 0) + amount;
                                                        //profilt frissíti
  persistUser(user);
  showProfile();
}
                                                //kimész főoldalra a goHomeos gombal
function goHome() {
  window.location.href = "index.html";
}
                                                //kijelentkezel a logoutos gombal és elveszi a currentUsert 
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

window.onload = showProfile;