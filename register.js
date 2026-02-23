async function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  const msg = document.getElementById("message");
  msg.style.color = "red";

  if (!name || !email || !password) {
    msg.textContent = "Tölts ki minden mezőt!";
    return;
  }

                                                                                    // JSON userek
  const res = await fetch("user.json");
  const jsonUsers = await res.json();

                                                                                            // localStorage userek
  const storedUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

                                                                                  // minden user egyben
  const allUsers = [...jsonUsers, ...storedUsers];
                                                                          //ellenőrzés ha már használta azt az eamilt nem lehet mégegyszer mert van fiók rá
  if (allUsers.find(u => u.email === email)) {
    msg.textContent = "Ez az email már létezik!";
    return;
  }
                                                                        //vegye fel az új usert
  const newUser = {
    name,
    email,
    password,
    balance: 0
  };
                                                                  //pusholja ki az új accountokat local storageba és stringifyolja
  storedUsers.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));
                                                                            //ha sikerül a bejelentkezés akkor írja ki ezt az üzenetet és dojon tovább
  msg.style.color = "green";
  msg.textContent = "Sikeres regisztráció! Átirányítás loginra...";

  setTimeout(() => window.location.href = "login.html", 900);
}