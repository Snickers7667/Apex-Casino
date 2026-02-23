
                                                            // Beállíthatod, ki az admin 
const ADMIN_EMAIL = "admin@gmail.com";                                          // Admin eamil kiválasztása eamil szerint
                                            //funkció a current user megkapásra
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}
                                                                        //funkció a user updateokra
function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem("registeredUsers")) || [];
}
                                                                        //elmenti az új usereket listába beleteszi
function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};
}
                                            //fog egy felhasználót, megnézi vane múdosítás, ha van ráteszi ha nem változatlanul visszaadja
function applyUpdates(user) {
  const updates = getUserUpdates();
  const patch = updates[user.email];
  if (!patch) return user;
  return { ...user, ...patch };
}
                                            //Beolvassa a user.json fájl átalakítja Javascript adattá és visszaadja  a felhasználónak
async function getJsonUsers() {
  const res = await fetch("user.json");
  return await res.json();
}
                                            //Ha ugyanaz az email többször szerepel, csak az utolsó marad.
function dedupeByEmail(users) {
  const map = new Map();
  for (const u of users) {
    map.set(u.email, u);                        // aki később jön, felülírhat (pl. regisztrált)
  }
  return Array.from(map.values());
}

let ALL = [];
                                                        // Admin ellenőrzés
async function loadAll() {                                                                       
  const cu = getCurrentUser();
  if (!cu || cu.email !== ADMIN_EMAIL) {
    alert("Nincs admin jogosultságod! (Admin email: " + ADMIN_EMAIL + ")");
    window.location.href = "index.html";
    return;
  }

  const status = document.getElementById("status");
  status.textContent = "Betöltés...";

  const jsonUsers = await getJsonUsers();
  const regUsers = getRegisteredUsers();

                                                                                        // Forrás jelölés
  const jsonTagged = jsonUsers.map(u => ({ ...u, _source: "user.json" }));
  const regTagged = regUsers.map(u => ({ ...u, _source: "localStorage" }));

                                                                                // összerak + duplikációk kiszedése email alapján
  const merged = dedupeByEmail([...jsonTagged, ...regTagged]);

                                                                                // update-ek ráhúzása (pl. balance)
  ALL = merged.map(u => applyUpdates(u));

  status.textContent = `Betöltve: ${ALL.length} fiók. (Admin: ${cu.email})`;

  render();
}

function render() {
  const tbody = document.getElementById("tbody");
  const q = (document.getElementById("search").value || "").trim().toLowerCase();

  const filtered = ALL.filter(u => {
    if (!q) return true;
    return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
  });

  tbody.innerHTML = filtered.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${u.name ?? ""}</td>
      <td>${u.email ?? ""}</td>
      <td>${Number(u.balance ?? 0)}</td>
      <td>${u._source ?? "-"}</td>
    </tr>
  `).join("");
}
                                                //home gomb
function goHome() {
  window.location.href = "index.html";
}
                                                    //profil gomb
function goProfile() {
  window.location.href = "profile.html";
}
                                                        //local data törlése
function clearLocalData() {
  const ok = confirm("Biztos törlöd a localStorage-ben mentett adatokat? (registeredUsers, userUpdates, currentUser)");
  if (!ok) return;

  localStorage.removeItem("registeredUsers");
  localStorage.removeItem("userUpdates");
  localStorage.removeItem("currentUser");

  alert("Törölve! Visszadoblak a főoldalra.");
  window.location.href = "index.html";
}

window.onload = loadAll;