
const gameData = {
    "Rulett": {
        message: "A Rulett hamarosan indul! Tedd meg a téted és kanyarítsd a szerencsédet!", //üzenet ofc
        buttonText: "Rulett Indítása",  //Ez a gombocska
        buttonAction: () => window.location.href = "rulett.html" // ide a Rulett oldalad linkje
    },
    "Póker": {
        message: "Csapj le a Póker asztalra és mutasd meg a lapjaidat!",
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

// Popup megnyitása
function openPopup(game) {
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popupTitle");
    const popupText = document.getElementById("popupText");
    const popupButton = document.getElementById("popupButton");

    popupTitle.textContent = game;

    if (gameData[game]) {
        popupText.textContent = gameData[game].message;
        popupButton.textContent = gameData[game].buttonText;
        popupButton.onclick = gameData[game].buttonAction;
    } else {
        popupText.textContent = game + " hamarosan indul!";
        popupButton.textContent = "Indítás";
        popupButton.onclick = () => window.location.href = "#"; // alapértelmezett oldal
    }

    popup.style.display = "block";  //blocként nyiljon meg a popup
}

// Popup bezárása
function closePopup() {
    document.getElementById("popup").style.display = "none";
}







// ------------------------------
  // LocalStorage "API" szimuláció
  // ------------------------------
  if(!localStorage.getItem('users')) localStorage.setItem('users', JSON.stringify([]));

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));            //JSON objecté teszem usert
  }

  function showProfile() {
    const user = getCurrentUser();              //idk honestly
    if(!user) return;

    const div3 = document.getElementById("div3");
    div3.style.display = "none"; // elrejti a reg/login gombokat "vagyis kellene rejtenie"

    const profileArea = document.getElementById("profileArea");     //Adatai a profilnak egy szarba mentve
    profileArea.innerHTML = `
      <h2>Üdv, ${user.name}!</h2>
      <p>Név: ${user.name}</p>
      <p>Életkor: ${user.age}</p>
      <p>Nem: ${user.gender}</p>
      <p>Email: ${user.email}</p>
      <p>Jelenlegi egyenleg: ${user.balance} €</p>
      <input type="number" id="addAmount" placeholder="Összeg feltöltése">
      <button onclick="addBalance()">Feltöltés</button>
      <button onclick="logout()">Kijelentkezés</button>
    `;
  }

  function addBalance() {
    const amount = parseFloat(document.getElementById("addAmount").value);
    if(isNaN(amount) || amount <= 0) return alert("Adj meg egy pozitív számot!");       //Hozzáadok moneyt pénzt és ha nem szám akkror kys

    let user = getCurrentUser();
    let users = JSON.parse(localStorage.getItem('users'));          //legyél variable cigány és megint object

    user.balance += amount;
    users = users.map(u => u.email === user.email ? user : u);      //Az egyenleg eamilhez meg userhez legyen kötve

    localStorage.setItem('users', JSON.stringify(users));           //Ha nem tetszik local storage öld meg magad :D
    localStorage.setItem('currentUser', JSON.stringify(user));

    showProfile();
  }

  function logout() {
    localStorage.removeItem('currentUser');                 //Kilépés odc
    location.reload();
  }

  // oldal betöltésekor ellenőrzőm, van-e bejelentkezett user
  window.onload = () => {
    if(getCurrentUser()) showProfile();
  }





   function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));            //Function hogy kapjuk meg a current usert
  }

  function showUserInfo() {                         //  KIKÉNE ÍRATNIA REGISTER LOGIN HELYETT??
    const user = getCurrentUser();
    const div3 = document.getElementById("div3");

    if(user){                                                                               //profil szarság
      div3.innerHTML = `<p>Üdv, ${user.name}! | Egyenleg: ${user.balance} €</p>         
                        <button onclick="logout()">Kijelentkezés</button>`;
    }
  }

  function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
  }

  window.onload = showUserInfo;



  function showUserInfo() {
  const user = getCurrentUser();
  const div3 = document.getElementById("div3");

  if(user){
    div3.innerHTML = `<p>Üdv, ${user.name}! | Egyenleg: ${user.balance} €</p>
                      <button onclick="logout()">Kijelentkezés</button>`;
  }
}


//gl have fun nigger