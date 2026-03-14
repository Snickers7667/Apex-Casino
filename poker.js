function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};
}

function saveUserUpdates(updates) {
  localStorage.setItem("userUpdates", JSON.stringify(updates));
}

function persistUser(user) {
  const updates = getUserUpdates();
  updates[user.email] = { balance: user.balance };
  saveUserUpdates(updates);
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function showBalance() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("balance").textContent = `Egyenleg: ${user.balance} €`;
}

const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

const suits = [
  { symbol: "♠", color: "black" },
  { symbol: "♥", color: "red" },
  { symbol: "♦", color: "red" },
  { symbol: "♣", color: "black" }
];

const values = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
};

function getRandomCard() {
  let value = cards[Math.floor(Math.random() * cards.length)];
  let suit = suits[Math.floor(Math.random() * suits.length)];

  return {
    value: value,
    symbol: suit.symbol,
    color: suit.color
  };
}

function dealHand() {
  return [getRandomCard(), getRandomCard(), getRandomCard()];
}

function renderHand(hand, elementId) {
  const area = document.getElementById(elementId);
  area.innerHTML = "";

  for (let card of hand) {
    area.innerHTML += `
      <div class="card ${card.color}">
        <div class="top">${card.value}<br>${card.symbol}</div>
        <div class="center">${card.symbol}</div>
        <div class="bottom">${card.value}<br>${card.symbol}</div>
      </div>
    `;
  }
}

function evaluateHand(hand) {
  let nums = hand.map(card => values[card.value]);
  nums.sort((a, b) => b - a);

  if (nums[0] === nums[1] && nums[1] === nums[2]) {
    return {
      rank: 3,
      name: "Drill",
      high: nums[0]
    };
  }

  if (nums[0] === nums[1] || nums[1] === nums[2] || nums[0] === nums[2]) {
    let pairValue;

    if (nums[0] === nums[1]) {
      pairValue = nums[0];
    } else if (nums[1] === nums[2]) {
      pairValue = nums[1];
    } else {
      pairValue = nums[0];
    }

    return {
      rank: 2,
      name: "Pár",
      high: pairValue
    };
  }

  return {
    rank: 1,
    name: "Magas lap",
    high: nums[0]
  };
}

function compareHands(player, dealer) {
  if (player.rank > dealer.rank) {
    return "player";
  }

  if (player.rank < dealer.rank) {
    return "dealer";
  }

  if (player.high > dealer.high) {
    return "player";
  }

  if (player.high < dealer.high) {
    return "dealer";
  }

  return "draw";
}

function playPoker() {
  let user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  let bet = parseFloat(document.getElementById("bet").value);
  let resultText = document.getElementById("result");

  if (!bet || bet <= 0) {
    resultText.textContent = "Adj meg érvényes tétet!";
    return;
  }

  if (bet > user.balance) {
    resultText.textContent = "Nincs elég pénzed!";
    return;
  }

  let playerHand = dealHand();
  let dealerHand = dealHand();

  renderHand(playerHand, "playerCards");
  renderHand(dealerHand, "dealerCards");

  let playerResult = evaluateHand(playerHand);
  let dealerResult = evaluateHand(dealerHand);

  document.getElementById("playerHand").textContent = `Kezed: ${playerResult.name}`;
  document.getElementById("dealerHand").textContent = `Gép keze: ${dealerResult.name}`;

  let winner = compareHands(playerResult, dealerResult);

  if (winner === "player") {
    user.balance += bet;
    resultText.textContent = `Nyertél! +${bet} €`;
  } else if (winner === "dealer") {
    user.balance -= bet;
    resultText.textContent = `Vesztettél! -${bet} €`;
  } else {
    resultText.textContent = "Döntetlen!";
  }

  persistUser(user);
  showBalance();
}

function goHome() {
  window.location.href = "index.html";
}

showBalance();