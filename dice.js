function getCurrentUser() {                                                                 //Átlagos profil adatok lekérése az oldalra
  return JSON.parse(localStorage.getItem("currentUser"));
}

function getUserUpdates() {
  return JSON.parse(localStorage.getItem("userUpdates")) || {};
}

function saveUserUpdates(updates) {
  localStorage.setItem("userUpdates", JSON.stringify(updates));
}
                                                                    //frissíti a pénzed
function persistUser(user) {
  const updates = getUserUpdates();
  updates[user.email] = { balance: user.balance };
  saveUserUpdates(updates);

  localStorage.setItem("currentUser", JSON.stringify(user));
}
                                                            //  Pénz adatai bekérése külön 
function showBalance() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("balance")
    .textContent = `Egyenleg: ${user.balance} €`;
}
                                                                    //Tét feltétele, lekéri a tippedet, meg az adott pénz értéket amit feltettél
function rollDice() {
  let user = getCurrentUser();

  const bet = parseFloat(document.getElementById("bet").value);
  const guess = parseInt(document.getElementById("guess").value);
  const resultText = document.getElementById("result");
                                                                    //Ha nem érvényes számot adsz meg azaz 0 vagy az alatt akkor visszadobja, hogy rendes tétet rakj
  if (!bet || bet <= 0) {
    resultText.textContent = "Adj meg érvényes tétet!";
    return;
  }
                                                                //Ha nincs annyi pénzed mint beírtál nem mükszik
  if (bet > user.balance) {
    resultText.textContent = "Nincs elég pénzed!";
    return;
  }

                                                            //  kocka dobás
  const dice = Math.floor(Math.random() * 6) + 1;
                                                        //Ha eltaláltad kapd meg a feltett téted 5szörösét
  if (dice === guess) {
    const win = bet * 5;                            
    user.balance += win;

    resultText.textContent =
      ` Dobás: ${dice} | ELTALÁLTAD! Nyeremény: +${win}€`;
  } else {                                                              //ha vesztettél elveszted amit feltettél
    user.balance -= bet;

    resultText.textContent =
      ` Dobás: ${dice} | Nem talált sajnos próbáld újra -${bet}€`;
  }

  persistUser(user);
  showBalance();
}

function goHome() {
  window.location.href = "index.html";
}

showBalance();