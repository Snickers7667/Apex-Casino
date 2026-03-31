const gameData = {                  // a játékokhoz egy adatbázis, hogy minden gombhoz adott popup nyíljon meg
  "Rulett": {
    message: "A Rulett hamarosan indul! Vigyázz szerintem a fekete elveszi a pénzed",
    buttonText: "Rulett Indítása",
    buttonAction: () => window.location.href = "rulett.html" // Átirányítás a rulett oldalra
  },
  "Póker": {
    message: "Csapj le a Póker asztalra és nyerd el az összes pénzt!",
    buttonText: "Póker Indítása",
    buttonAction: () => window.location.href = "poker.html"
  },
    "Blackjack": {
    message: "Próbáld ki a Blackjack asztalt és győzd le a dealert!",
    buttonText: "Blackjack Indítása",
    buttonAction: () => window.location.href = "blackjack.html"
  },
  "Slot Machine": {
    message: "Forgasd a nyerőgépet és nyerj nagyot és nagyobbat!",
    buttonText: "Slot Indítása",
    buttonAction: () => window.location.href = "slot.html"
  },
  "Dice Roll": {
    message: "Gurítsd meg a kockádat és nézd meg a szerencsédet!",
    buttonText: "Kocka Gurítás",
    buttonAction: () => window.location.href = "dice.html"
  }
};

function openPopup(game) {                                // Ez a func felelős a button utáni popup megjelenítéséért
  const popup = document.getElementById("popup");
  const popupBox = popup.querySelector(".popup-box");
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");
  const popupButton = document.getElementById("popupButton");

  
  popupTitle.textContent = game;                              // játék neve kimutatása


  if (gameData[game]) {                         // Ha az adott játék létezik a gameData-n belül, akkor betölti az adatait
    const { message, buttonText, buttonAction } = gameData[game];
    popupText.textContent = message;                          // üzenet megjelenítése
    popupButton.textContent = buttonText;                    // gomb szöveg
    popupButton.onclick = buttonAction;                   // gomb + adott esemény hozzárendelése
  } else {                                                // Ha az adott játék nem létezik akkor ezt fogja felhasználni
    popupText.textContent = "Hamarosan...";
    popupButton.textContent = "OK";
    popupButton.onclick = closePopup;                           // Popupot bezárja
  }


  popup.style.display = "flex";           // Popup megjelenítése animációval mellé
  setTimeout(() => {
    popup.classList.add("active");
    popupBox.classList.add("active");
  }, 10);
}

function closePopup() {                         // A popupot bezáró függvény
  const popup = document.getElementById("popup");
  const popupBox = popup.querySelector(".popup-box");

  popup.classList.remove("active");
  popupBox.classList.remove("active");

  setTimeout(() => {
    popup.style.display = "none";
  }, 300);
}


window.addEventListener("click", (e) => {                     // Bezárja a popupot, ha kívűlre kattintunk
  const popup = document.getElementById("popup");
  if (e.target === popup) closePopup();
});



// Bejelentkezés /  Regisztrációs rész
function checkLogin() {
  const user = JSON.parse(localStorage.getItem("currentUser"));         //Bejelentkezett user lekérése a local storagebol
  const area = document.getElementById("authArea");                   //Ez keresi meg a gombokat

  if (!area) return;                                  //-> Ha nincs area html elemünk áljon le

  if (user) {                                 //Ha a user->
                                                                    //Leváltja a gombokat és kiírja a neved meg az egyenleged és ha adminnal vagy akkor admin pannelt kapsz
    area.innerHTML = `
      <p class="magi">Üdv, ${user.name}! | Egyenleg: ${user.balance} €</p>

      <button onclick="goProfile()">Profil</button>

      ${user.email === "admin@gmail.com"
        ? `<button onclick="location.href='accounts.html'">Admin</button>`        //A kérdőjel az rövidített if, a : meg az else
        : ""}                                                                     
                                                                          
      <button onclick="logout()">Kijelentkezés</button>
    `;
                                                                                              //Ha nincs bejelentkezve marad a 2 gomb
  } else {

    area.innerHTML = `
      <button onclick="location.href='register.html'"   ="reg"><i class="fa fa-user-plus" aria-hidden="true"></i>  Regisztráció</button>
      <button onclick="location.href='login.html'" class="belepes">Bejelentkezés    <i class="fa fa-sign-in" aria-hidden="true"></i></button>
    `;
  }
}



function logout() {                                   // Kijelentkezés funkció
  localStorage.removeItem("currentUser");              //  Törli a jelenlegi felhasználót
  location.reload();                                  // Újratölti az oldalt
}

function goProfile() {                                 //Ezzel meg perszhe mész a profilodra
  window.location.href = "profile.html";
}


checkLogin();                                           //És persze lefuttatjuk a logint


let slideIndex = 0;                 // Függvény a diák váltására a  hírdetéshez  
const slides = document.querySelectorAll(".slideshow .slide");

function showSlides() {
  slides.forEach(slide => slide.classList.remove("active"));
  if (slides.length === 0) return;
  slides[slideIndex].classList.add("active");
  slideIndex = (slideIndex + 1) % slides.length;
}


setInterval(showSlides, 4000); // Automatikus képváltás 4 másodpercenként

                                                                //ha elfogadja tünjön el a popup
function acceptTerms() {
  localStorage.setItem("termsAccepted", "true");
  document.getElementById("termsPopup").style.display = "none";
}

function declineTerms() {
  window.location.href = "https://www.google.com"; // Ha köcsög és nem fogadja el tünés
}

                              //Easter eggecske :D

let keySequence = "";
const secretCode = "JMAAC";

document.addEventListener("keydown", (e) => {
  keySequence += e.key.toUpperCase();

                                              // csak az utolsó 5 karaktert nézzük
  keySequence = keySequence.slice(-5);

  if (keySequence === secretCode) {
    window.location.href = "secret.html"; // ide visz el
  }
});