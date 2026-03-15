const redNumbers = [                                      //piros számok ofc
  1, 3, 5, 7, 9, 12, 14, 16, 18,
  19, 21, 23, 25, 27, 30, 32, 34, 36
];

const wheelOrder = [
  0, 32, 15, 19, 4, 21, 2, 25, 17,
  34, 6, 27, 13, 36, 11, 30, 8,
  23, 10, 5, 24, 16, 33, 1, 20,
  14, 31, 9, 22, 18, 29, 7,
  28, 12, 35, 3, 26
];
                                    //golyónak az alap adatai
let selectedColor = null;
let isSpinning = false;
let currentRotation = 0;
let currentBallAngle = 0;

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};
}

function saveUserUpdates(updates) {
  localStorage.setItem("userUpdates", JSON.stringify(updates));
}

function applyUpdates(user) {
  const updates = getUserUpdates();
  const patch = updates[user.email];
  if (!patch) return user;
  return { ...user, ...patch };
}

function persistUser(user) {
  const updates = getUserUpdates();
  updates[user.email] = { balance: user.balance };
  saveUserUpdates(updates);
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function goHome() {
  window.location.href = "index.html";
}

function goProfile() {
  window.location.href = "profile.html";
}
                                                //színt számbol kapjuk meg ami persze random
function getColorByNumber(number) {
  if (number === 0) return "green";                             // ha nulla legyen zöld
  return redNumbers.includes(number) ? "red" : "black";                                   //ha a pirosokba van a szám akkor piros másképp fekete 
}
                                                //kimenetet kapsz a bemenetből
function getColorLabel(color) {
  if (color === "red") return "piros";
  if (color === "black") return "fekete";
  return "zöld";
}

                                            //ez csinálja meg a kereket
function buildWheelGradient() {
                                                    //360 fokos a kerék és ossza el amennyi szám van
  const slice = 360 / wheelOrder.length;
  const parts = [];                                 //ebben gyűjtjük a szeleteket
                                                                                        //ez egy ciklus, ami minden rulett számot feldolgoz.
  for (let i = 0; i < wheelOrder.length; i++) {
                                                    //ez a rulett keréknek sorrendje.
    const number = wheelOrder[i];
    const color = getColorByNumber(number);                           //függvény ami párosítja a számokat a színekkel

    let cssColor = "#111111";                               //alap színe legyen fekete
    if (color === "red") cssColor = "#8b0000";                                             //piros részek
    if (color === "green") cssColor = "#14532d";                    //fekete részek

    const start = i * slice;                    //szelet kezdete
    const end = (i + 1) * slice;                                //szelet vége

    parts.push(`${cssColor} ${start}deg ${end}deg`);      //Ez egy CSS conic-gradient szelet, ha jól értem ez kell maJd a golyó körpályájához is kép alapján
  }

  return `conic-gradient(${parts.join(", ")})`;     //összeköti a part listával
}
                                    //ez hozza létre a kereket
function setupWheelVisual() {
                                                        //htmlelben megkeresi a kereket
  const wheel = document.getElementById("wheel");

  if (!wheel) return;                         //ha nincs kerék leáll

  wheel.style.background = buildWheelGradient();      //kerék háttere
}


function updateUserInfo() {

  let user = getCurrentUser();

  if (!user) {

    alert("Előbb jelentkezz be!");
    window.location.href = "login.html";
    return;
  }

  user = applyUpdates(user);

  localStorage.setItem("currentUser", JSON.stringify(user));

  document.getElementById("welcomeText").textContent =
    `Üdv, ${user.name}!`;

  document.getElementById("balanceText").textContent =
    user.balance;
}

                                //kiválaszt egy színt a fogadáshoz
function selectColor(color) {
                                    //szín eltárolása
  selectedColor = color;
                                                                        //megváltoztatja a  html szöveget
  document.getElementById("selectedColorText").textContent =
    getColorLabel(color);
                                                              //lekéri a gombokat
  const buttons = document.querySelectorAll(".color-btn");
                                                            //minden gombból eltávolítja az active class-t
  buttons.forEach(btn => btn.classList.remove("active"));
                                                                              //aktuális gomb kiválasztása
  const activeBtn = document.querySelector(`.color-btn.${color}`);
                                                                      //az aktuális gomb kap egy active class-t
  if (activeBtn) activeBtn.classList.add("active");
}

                                                //ez kiszámolja melyik számba esett a golyó a keréken. (utálom ezt a részt)
function getNumberFromBallAngle(ballAngle) {
                                              //37 szám van ezért annyival felosztja
  const slice = 360 / wheelOrder.length;
                                                            //biztosítja hogy az érték 0 és 360 között legyen
  let normalized = ((ballAngle % 360) + 360) % 360;
                                                      //válassza ki melyik szelet
  const index = Math.floor(normalized / slice);
                                                  //adja vissza azt a számot
  return wheelOrder[index];
}

                                              //ez egy véletlen szöget generál
function getRandomBallAngle() {

  return Math.random() * 360;
}
                                          // ez a függvény a teljes rulett pörgetést kezeli, ellenőrzi a játékost és a tétet, elindítja az animációt, majd kiszámolja a nyerést vagy veszteséget
async function spinRoulette() {
                                  //ez megakadályozza a dupla kattintást
  if (isSpinning) return;
                                      //lekéri a jelenlegi játékost
  let user = getCurrentUser();
                                //ha nincs bejelentkezve dobja ki
  if (!user) {

    alert("Előbb jelentkezz be!");
    window.location.href = "login.html";
    return;
  }
                                  //felhasználó frissítése
  user = applyUpdates(user);
                                //tétel lekérése
  const betAmount =
    parseFloat(document.getElementById("betAmount").value);
                                                              //html elemeket lekéri
  const gameMessage =
    document.getElementById("gameMessage");

  const spinBtn =
    document.getElementById("spinBtn");

  const wheel =
    document.getElementById("wheel");

  const ball =
    document.getElementById("ball");
                                        //ha nincs kiválasztva szín akkor dobjon egy allertet
  if (!selectedColor) {

    alert("Válassz színt!");
    return;
  }
                                                    //ha nem számot vagy 0nál nagyobb számot adott  megint allert
  if (isNaN(betAmount) || betAmount <= 0) {

    alert("Adj meg egy érvényes tétet!");
    return;
  }
                                                  // ha csöves vagy akkor is allert
  if (user.balance < betAmount) {

    alert("Nincs elég pénzed ehhez a téthez!");
    return;
  }
                                //ez a rulett pörgetése
  isSpinning = true;
  spinBtn.disabled = true;
  gameMessage.textContent = "Pörög a rulett...";
                                                                // kerék forgása
  currentRotation += 1440 + Math.floor(Math.random() * 360);
                                                                  //forágs animáció cssből
  wheel.style.transform =
    `rotate(${currentRotation}deg)`;

                                                    //random szög
  const finalBallAngle = getRandomBallAngle();

  currentBallAngle = finalBallAngle;
                                                //golyó animációja a golyó körül
  ball.style.transform =
    `translate(-50%, -50%) rotate(${finalBallAngle + 1080}deg) translateY(-160px)`;

                                //4 másodpercig forog
  setTimeout(() => {
                                          //szög → rulett szám
    const resultNumber =
      getNumberFromBallAngle(currentBallAngle);
                                                  //szín meghatározása
    const resultColor =
      getColorByNumber(resultNumber);
                                                //nyeremény szorzó alapból nmincs
    let multiplier = 0;
                                                  //ha eltaláltad 
    if (selectedColor === resultColor) {
                                                  //a szorzó zöldnél 14szeres többinél 2 (fekete, pirosnál)
      multiplier =
        selectedColor === "green" ? 14 : 2;
    }
                              //ha nyertél updateolja a balanceodat
    if (multiplier > 0) {

      user.balance =
        user.balance +
        (betAmount * multiplier - betAmount);

      gameMessage.textContent =
        `Nyertél! A golyó a ${resultNumber} (${getColorLabel(resultColor)}) mezőre érkezett.`;
                                //ha vesztettél levonja a pénzt
    } else {

      user.balance =
        user.balance - betAmount;

      gameMessage.textContent =
        `Vesztettél! A golyó a ${resultNumber} (${getColorLabel(resultColor)}) mezőre érkezett.`;
    }
                          //adatok mentése
    persistUser(user);
                                                              //UI frissítése
    document.getElementById("balanceText").textContent =
      user.balance;

    document.getElementById("numberResult").textContent =
      resultNumber;

    document.getElementById("colorResult").textContent =
      getColorLabel(resultColor);
                                            //pörgetés vége
    spinBtn.disabled = false;

    isSpinning = false;
                            //itt van hogy 4 másodpercig :D
  }, 4000);
}


window.onload = () => {

  updateUserInfo();
  setupWheelVisual();
};