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

function setDiceFace(value) {
  const dice = document.getElementById("dice");
  dice.className = `dice-face face-${value}`;
}

function resetDiceEffects() {
  const dice = document.getElementById("dice");
  const resultBox = document.getElementById("result");

  dice.classList.remove("win", "lose", "rolling");
  resultBox.classList.remove("win-text", "lose-text");
}

function rollAnimation(finalValue, onComplete) {
  const dice = document.getElementById("dice");
  let steps = 0;
  const maxSteps = 14;

  dice.classList.add("rolling");

  const interval = setInterval(() => {
    const tempValue = Math.floor(Math.random() * 6) + 1;
    setDiceFace(tempValue);

    steps++;

    if (steps >= maxSteps) {
      clearInterval(interval);
      dice.classList.remove("rolling");
      setDiceFace(finalValue);

      setTimeout(() => {
        onComplete();
      }, 180);
    }
  }, 100);
}

function rollDice() {
  const user = getCurrentUser();
  const bet = parseFloat(document.getElementById("bet").value);
  const guess = parseInt(document.getElementById("guess").value, 10);

  const resultText = document.getElementById("result");
  const lastRoll = document.getElementById("lastRoll");
  const statusText = document.getElementById("statusText");
  const rollBtn = document.getElementById("rollBtn");
  const dice = document.getElementById("dice");

  resetDiceEffects();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (!bet || bet <= 0) {
    resultText.textContent = "Adj meg érvényes tétet!";
    statusText.textContent = "Hibás tét.";
    return;
  }

  if (bet > user.balance) {
    resultText.textContent = "Nincs elég pénzed ehhez a fogadáshoz!";
    statusText.textContent = "Sikertelen fogadás.";
    return;
  }

  const finalDice = Math.floor(Math.random() * 6) + 1;

  rollBtn.disabled = true;
  resultText.textContent = "A kocka gurul...";
  statusText.textContent = "Dobás folyamatban...";

  rollAnimation(finalDice, () => {
    lastRoll.textContent = finalDice;

    if (finalDice === guess) {
      const win = bet * 5;
      user.balance += win;

      dice.classList.add("win");
      resultText.classList.add("win-text");
      resultText.textContent = `Dobás: ${finalDice} | ELTALÁLTAD! Nyeremény: +${win}€`;
      statusText.textContent = "Szép! Nyertél.";
    } else {
      user.balance -= bet;

      dice.classList.add("lose");
      resultText.classList.add("lose-text");
      resultText.textContent = `Dobás: ${finalDice} | Nem talált. Vesztettél: -${bet}€`;
      statusText.textContent = "Most nem jött be.";
    }

    persistUser(user);
    showBalance();
    rollBtn.disabled = false;
  });
}

function goHome() {
  window.location.href = "index.html";
}

showBalance();
setDiceFace(1);