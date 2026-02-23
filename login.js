function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};       //Nézzük meg a userUpdatest ha van benne valami akkor azt használjuk ha nincs akkor hozzon létre egy üres
}
                                      //lekérjük az összes fríssítést a felhasználókra
function applyUpdates(user) {
  const updates = getUserUpdates();
  const u = updates[user.email];
  if (!u) return user;
  return { ...user, ...u };
}
                                      //                                     
async function loginUser() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("message");

                                                  // JSON userek
  const res = await fetch("user.json");
  const jsonUsers = await res.json();

                                                                                   // regisztrált userek
  const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

                                                                                      // egyben
  const users = [...jsonUsers, ...storedUsers];
                                                                                      //userek keresése
  let user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    msg.textContent = "Hibás email vagy jelszó!";
    return;
  }

                                                              // rátesszük a mentett frissítéseket (pl. balance)
  user = applyUpdates(user);
                                                                        //küld a profilba a usert amibe bejelentkeztél
  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "profile.html";
}