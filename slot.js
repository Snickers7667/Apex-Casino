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
  document.getElementById("balance").textContent = `Egyenleg: ${Number(user.balance ?? 0)} €`;
}

// Szimbólumok + súlyok                 //Mondhatni csinál egy számsort pl 0-35 35-60 60-78 78-90 90-97 97-100
const SYMBOLS = [
  { s: "🍒", w: 35, m3: 3,  m2: 2.0  },
  { s: "🍋", w: 25, m3: 4,  m2: 2.0  },
  { s: "🍇", w: 18, m3: 6,  m2: 2.0  },
  { s: "🔔", w: 12, m3: 10, m2: 3.0  },
  { s: "💎", w: 7,  m3: 20, m2: 5.0  },
  { s: "7️⃣", w: 3,  m3: 50, m2: 10.0 },
];

function weightedPick() {
  const total = SYMBOLS.reduce((a, x) => a + x.w, 0);   //kiszámolja a listában a w totalt
  let r = Math.random() * total;            //kapok egy egész számot a szám szakaszomra
  for (const item of SYMBOLS) {
    r -= item.w;                    //Addig vonja ki a megkapott r ből a szimbólumok weightjét amig nem kap minusz értéket
    if (r <= 0) return item.s;
  }
  return SYMBOLS[0].s;
}

function payoutMultiplier(a, b, c) {
  // 3 azonos szimbólum
  if (a === b && b === c) {                         //Ha mind a 3 szimbólum ugyan az  akkor...
    const sym = SYMBOLS.find(x => x.s === a);                                               //Keresse ki a szimbólunm adatait
    return sym ? sym.m3 : 0;                        //Adja vissza az értékét azaz a szórzót
  }
  // 2 azonos szimbólum (bármelyik pár)
  if (a === b || a === c || b === c) {              
    const pairSym = (a === b) ? a : (a === c) ? a : b;      //ez egy rövidített if ami kiválasztja a páros szimbólumokat
    const sym = SYMBOLS.find(x => x.s === pairSym);                                                     //Keresse ki a szimbólunm adatait
    return sym ? sym.m2 : 0;                            //Adja vissza az értékét azaz a szórzót
  }
  return 0;
}

let spinning = false;

function setReels(a, b, c) {
  document.getElementById("r1").textContent = a;
  document.getElementById("r2").textContent = b;
  document.getElementById("r3").textContent = c;
}

function spin() {
  if (spinning) return;

  let user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const bet = Math.floor(Number(document.getElementById("bet").value));
  const msg = document.getElementById("msg");
  msg.textContent = "";

  if (!bet || bet <= 0) {
    msg.textContent = "Adj meg érvényes tétet!";
    return;
  }
  if (bet > (user.balance ?? 0)) {
    msg.textContent = "Nincs elég pénzed!";
    return;
  }

  // Levonjuk a tétet azonnal amit feltett
  user.balance = (user.balance ?? 0) - bet;
  persistUser(user);
  showBalance();

  // “Animáció” prögeted a kereket
  spinning = true;
  document.getElementById("spinBtn").disabled = true;

  let steps = 12;
  const timer = setInterval(() => {
    setReels(weightedPick(), weightedPick(), weightedPick());
    steps--;
    if (steps <= 0) {
      clearInterval(timer);

      const a = document.getElementById("r1").textContent;
      const b = document.getElementById("r2").textContent;
      const c = document.getElementById("r3").textContent;

      const mult = payoutMultiplier(a, b, c);
      const win = Math.floor(bet * mult); // egész €-ra kerekítve

      user = getCurrentUser(); // friss példány
      if (win > 0) {
        user.balance = (user.balance ?? 0) + win;
        msg.textContent = `NYERTÉL! Szorzó: x${mult} → +${win}€`;
      } else {
        msg.textContent = `Nem nyertél, próbáld újra bajnok! (-${bet}€)`;
      }

      persistUser(user);
      showBalance();

      spinning = false;
      document.getElementById("spinBtn").disabled = false;
    }
  }, 70);
}

function goHome() {
  window.location.href = "index.html";
}

showBalance();