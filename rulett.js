const redNumbers = [
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

function getColorByNumber(number) {
  if (number === 0) return "green";
  return redNumbers.includes(number) ? "red" : "black";
}

function getColorLabel(color) {
  if (color === "red") return "piros";
  if (color === "black") return "fekete";
  return "zöld";
}


function buildWheelGradient() {

  const slice = 360 / wheelOrder.length;
  const parts = [];

  for (let i = 0; i < wheelOrder.length; i++) {

    const number = wheelOrder[i];
    const color = getColorByNumber(number);

    let cssColor = "#111111";
    if (color === "red") cssColor = "#8b0000";
    if (color === "green") cssColor = "#14532d";

    const start = i * slice;
    const end = (i + 1) * slice;

    parts.push(`${cssColor} ${start}deg ${end}deg`);
  }

  return `conic-gradient(${parts.join(", ")})`;
}

function setupWheelVisual() {

  const wheel = document.getElementById("wheel");

  if (!wheel) return;

  wheel.style.background = buildWheelGradient();
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


function selectColor(color) {

  selectedColor = color;

  document.getElementById("selectedColorText").textContent =
    getColorLabel(color);

  const buttons = document.querySelectorAll(".color-btn");

  buttons.forEach(btn => btn.classList.remove("active"));

  const activeBtn = document.querySelector(`.color-btn.${color}`);

  if (activeBtn) activeBtn.classList.add("active");
}


function getNumberFromBallAngle(ballAngle) {

  const slice = 360 / wheelOrder.length;

  let normalized = ((ballAngle % 360) + 360) % 360;

  const index = Math.floor(normalized / slice);

  return wheelOrder[index];
}


function getRandomBallAngle() {

  return Math.random() * 360;
}

async function spinRoulette() {

  if (isSpinning) return;

  let user = getCurrentUser();

  if (!user) {

    alert("Előbb jelentkezz be!");
    window.location.href = "login.html";
    return;
  }

  user = applyUpdates(user);

  const betAmount =
    parseFloat(document.getElementById("betAmount").value);

  const gameMessage =
    document.getElementById("gameMessage");

  const spinBtn =
    document.getElementById("spinBtn");

  const wheel =
    document.getElementById("wheel");

  const ball =
    document.getElementById("ball");

  if (!selectedColor) {

    alert("Válassz színt!");
    return;
  }

  if (isNaN(betAmount) || betAmount <= 0) {

    alert("Adj meg egy érvényes tétet!");
    return;
  }

  if (user.balance < betAmount) {

    alert("Nincs elég pénzed ehhez a téthez!");
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;
  gameMessage.textContent = "Pörög a rulett...";

  currentRotation += 1440 + Math.floor(Math.random() * 360);

  wheel.style.transform =
    `rotate(${currentRotation}deg)`;


  const finalBallAngle = getRandomBallAngle();

  currentBallAngle = finalBallAngle;

  ball.style.transform =
    `translate(-50%, -50%) rotate(${finalBallAngle + 1080}deg) translateY(-160px)`;


  setTimeout(() => {

    const resultNumber =
      getNumberFromBallAngle(currentBallAngle);

    const resultColor =
      getColorByNumber(resultNumber);

    let multiplier = 0;

    if (selectedColor === resultColor) {

      multiplier =
        selectedColor === "green" ? 14 : 2;
    }

    if (multiplier > 0) {

      user.balance =
        user.balance +
        (betAmount * multiplier - betAmount);

      gameMessage.textContent =
        `Nyertél! A golyó a ${resultNumber} (${getColorLabel(resultColor)}) mezőre érkezett.`;

    } else {

      user.balance =
        user.balance - betAmount;

      gameMessage.textContent =
        `Vesztettél! A golyó a ${resultNumber} (${getColorLabel(resultColor)}) mezőre érkezett.`;
    }

    persistUser(user);

    document.getElementById("balanceText").textContent =
      user.balance;

    document.getElementById("numberResult").textContent =
      resultNumber;

    document.getElementById("colorResult").textContent =
      getColorLabel(resultColor);

    spinBtn.disabled = false;

    isSpinning = false;

  }, 4000);
}


window.onload = () => {

  updateUserInfo();
  setupWheelVisual();
};