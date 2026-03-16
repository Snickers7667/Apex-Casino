let deck = [];
let player = [];
let dealer = [];
let splitHand = [];

let hiddenCard = null;

let isSplit = false;
let activeHand = "player";

let gameOver = false;
let bet = 0;

function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};
}

function applyUpdates(user) {
  const updates = getUserUpdates();
  const u = updates[user.email];
  if (!u) return user;
  return { ...user, ...u };
}

let user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  alert("Nincs bejelentkezett felhasználó!");
} else {
  user = applyUpdates(user);
  user.balance = Number(user.balance) || 0;
  localStorage.setItem("currentUser", JSON.stringify(user));
  document.getElementById("userName").innerText = user.name;
}

function updateBalance() {
  if (!user) return;
  user.balance = Number(user.balance) || 0;
  document.getElementById("balance").innerText = user.balance;
}

function saveBalance() {
  if (!user) return;

  user.balance = Number(user.balance) || 0;

  let updates = JSON.parse(localStorage.getItem("userUpdates")) || {};
  updates[user.email] = { balance: user.balance };

  localStorage.setItem("userUpdates", JSON.stringify(updates));
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  deck = [];

  for (let s of suits) {
    for (let v of values) {
      deck.push({ value: v, suit: s });
    }
  }
}

function draw() {
  const index = Math.floor(Math.random() * deck.length);
  return deck.splice(index, 1)[0];
}

function score(hand) {
  let total = 0;
  let aces = 0;

  for (let c of hand) {
    if (c.value === "A") {
      total += 11;
      aces++;
    } else if (["K", "Q", "J"].includes(c.value)) {
      total += 10;
    } else {
      total += parseInt(c.value, 10);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

function startGame() {
  if (!user) return;

  document.getElementById("result").innerText = "";

  bet = parseInt(document.getElementById("bet").value, 10);

  if (isNaN(bet) || bet <= 0) {
    alert("A tétnek pozitív számnak kell lennie!");
    return;
  }

  user.balance = Number(user.balance) || 0;

  if (bet > user.balance) {
    alert("Nincs elég pénzed!");
    return;
  }

  user.balance -= bet;
  saveBalance();
  updateBalance();

  player = [];
  dealer = [];
  splitHand = [];

  hiddenCard = null;
  isSplit = false;
  activeHand = "player";
  gameOver = false;

  createDeck();

  player.push(draw());
  player.push(draw());

  dealer.push(draw());
  hiddenCard = draw();

  updateUI();
}

function hit() {
  if (gameOver) return;

  if (activeHand === "player") {
    player.push(draw());

    if (score(player) > 21) {
      if (isSplit) {
        activeHand = "split";
      } else {
        finishRound();
        return;
      }
    }
  } else if (activeHand === "split") {
    splitHand.push(draw());

    if (score(splitHand) > 21) {
      finishRound();
      return;
    }
  }

  updateUI();
}

function stand() {
  if (gameOver) return;

  if (isSplit && activeHand === "player") {
    activeHand = "split";
    updateUI();
    return;
  }

  finishRound();
}

function split() {
  if (gameOver) return;

  if (player.length !== 2) {
    alert("Csak az első két lapnál lehet splitelni.");
    return;
  }

  if (player[0].value !== player[1].value) {
    alert("Csak azonos lapokat lehet splitelni.");
    return;
  }

  user.balance = Number(user.balance) || 0;

  if (user.balance < bet) {
    alert("Nincs elég pénz splithez.");
    return;
  }

  user.balance -= bet;
  saveBalance();
  updateBalance();

  splitHand = [player.pop()];

  player.push(draw());
  splitHand.push(draw());

  isSplit = true;
  activeHand = "player";

  updateUI();
}

function dealerPlay() {
  if (hiddenCard) {
    dealer.push(hiddenCard);
    hiddenCard = null;
  }

  while (score(dealer) < 17) {
    dealer.push(draw());
  }
}

function settleHand(hand) {
  const playerScore = score(hand);
  const dealerScore = score(dealer);

  if (playerScore > 21) {
    return { result: "lose", text: `Vesztettél (-${bet} €)` };
  }

  if (dealerScore > 21) {
    user.balance = Number(user.balance) || 0;
    user.balance += bet * 2;
    return { result: "win", text: `Nyertél (+${bet} €)` };
  }

  if (playerScore > dealerScore) {
    user.balance = Number(user.balance) || 0;
    user.balance += bet * 2;
    return { result: "win", text: `Nyertél (+${bet} €)` };
  }

  if (playerScore === dealerScore) {
    user.balance = Number(user.balance) || 0;
    user.balance += bet;
    return { result: "push", text: `Döntetlen (0 €)` };
  }

  return { result: "lose", text: `Vesztettél (-${bet} €)` };
}

function finishRound() {
  dealerPlay();

  let messages = [];

  const playerResult = settleHand(player);
  messages.push(`Player kéz: ${playerResult.text}`);

  if (isSplit) {
    const splitResult = settleHand(splitHand);
    messages.push(`Split kéz: ${splitResult.text}`);
  }

  saveBalance();
  updateBalance();

  gameOver = true;
  document.getElementById("result").innerHTML = messages.join("<br>");

  updateUI(true);
}

function renderCards(hand, element) {
  const area = document.getElementById(element);
  area.innerHTML = "";

  for (let c of hand) {
    let color = "";
    if (c.suit === "♥" || c.suit === "♦") {
      color = "red";
    }

    area.innerHTML += `
      <div class="card ${color}">
        ${c.value}${c.suit}
      </div>
    `;
  }
}

function updateUI(reveal = false) {
  renderCards(player, "playerCards");
  document.getElementById("playerScore").innerText = score(player);

  if (isSplit) {
    renderCards(splitHand, "splitCards");
    document.getElementById("splitScore").innerText = `Összeg: ${score(splitHand)}`;
  } else {
    document.getElementById("splitCards").innerHTML = "";
    document.getElementById("splitScore").innerText = "";
  }

  const dealerArea = document.getElementById("dealerCards");
  dealerArea.innerHTML = "";

  if (!reveal) {
    if (dealer[0]) {
      const color =
        dealer[0].suit === "♥" || dealer[0].suit === "♦" ? "red" : "";

      dealerArea.innerHTML += `
        <div class="card ${color}">
          ${dealer[0].value}${dealer[0].suit}
        </div>
      `;
    }

    dealerArea.innerHTML += `<div class="card back">?</div>`;
    document.getElementById("dealerScore").innerText = "?";
  } else {
    renderCards(dealer, "dealerCards");
    document.getElementById("dealerScore").innerText = score(dealer);
  }
}

updateBalance();