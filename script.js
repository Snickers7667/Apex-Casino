const gameData = {
  "Rulett": {
    message: "A Rulett hamarosan indul!",                                           //Ez egy mini adatbázis hogy gombtól függően milyen értéket kapjon
    buttonText: "Rulett Indítása",
    buttonAction: () => window.location.href = "rulett.html"
  },
  "Póker": {
    message: "Csapj le a Póker asztalra!",
    buttonText: "Póker Indítása",
    buttonAction: () => window.location.href = "poker.html"
  },
  "Slot Machine": {
    message: "Forgasd a nyerőgépet és nyerj nagyot!",
    buttonText: "Slot Indítása",
    buttonAction: () => window.location.href = "slot.html"
  },
  "Dice Roll": {
    message: "Gurítsd a kockát és nézd, ki nyer!",
    buttonText: "Kocka Gurítás",
    buttonAction: () => window.location.href = "dice.html"
  }
};
                                                                                                    //Html elemek megkeresése lekérése
function openPopup(game) {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");
  const popupButton = document.getElementById("popupButton");
                                                                                  //cím beállítása
  popupTitle.textContent = game;
                                                                    //ha van ilyen játék az adatbázisba irja ki az adatait a gamedatából, ha meg nincs töltse ki az alsókkal a popuppot
  if (gameData[game]) {
    popupText.textContent = gameData[game].message;
    popupButton.textContent = gameData[game].buttonText;
    popupButton.onclick = gameData[game].buttonAction;
  } else {
    popupText.textContent = "Hamarosan...";
    popupButton.textContent = "OK";
    popupButton.onclick = closePopup;
  }

  popup.style.display = "block";                                    //popupnak a stílusa block legyen wow nem jöttél volna rá
}

function closePopup() {                                                       //Itt megadjuk a popup bezárását
  document.getElementById("popup").style.display = "none";
}

function checkLogin() {
  const user = JSON.parse(localStorage.getItem("currentUser"));         //Bejelentkezett user lekérése a local storagebol
  const area = document.getElementById("authArea");                   //Ez keresi meg a gombokat

  if (!area) return;                                  //-> Ha nincs area html elemünk áljon le

  if (user) {                                 //Ha a user->
                                                                    //Leváltja a gombokat és kiírja a neved meg az egyenleged és ha adminnal vagy akkor admin pannelt kapsz
    area.innerHTML = `
      <p>Üdv, ${user.name}! | Egyenleg: ${user.balance} €</p>

      <button onclick="goProfile()">Profil</button>

      ${user.email === "admin@gmail.com"
        ? `<button onclick="location.href='accounts.html'">Admin</button>`        //A kérdőjel az rövidített if, a : meg az else
        : ""}                                                                     
                                                                          
      <button onclick="logout()">Kijelentkezés</button>
    `;
                                                                                              //Ha nincs bejelentkezve marad a 2 gomb
  } else {

    area.innerHTML = `
      <button onclick="location.href='register.html'">Regisztráció</button>
      <button onclick="location.href='login.html'">Bejelentkezés</button>
    `;
  }
}
                                                                                      //Ezzel jelentkezel ki ezen gondolom nincs kérdés
function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}
                                                                                //Ezzel meg perszhe mész a profilodra
function goProfile() {      
  window.location.href = "profile.html";
}
                                                                                //És persze lefuttatjuk a logint
checkLogin(); 