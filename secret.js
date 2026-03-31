const intro = document.getElementById("introImage");

const title = document.getElementById("apexTitle");

const docs = document.getElementById("docs");

const finalText = "APEX CASINO";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function randomChar() {
  return chars[Math.floor(Math.random() * chars.length)];
}

/* decrypt effekt */

function revealText(text) {
  let iterations = 0;

  const interval = setInterval(() => {
    title.innerHTML = text

      .split("")

      .map((letter, index) => {
        if (index < iterations) {
          return letter;
        }

        return randomChar();
      })

      .join("");

    if (iterations >= text.length) {
      clearInterval(interval);

      setTimeout(() => {
        docs.classList.add("show");
      }, 600);
    }

    iterations += 0.35;
  }, 40);
}

/* indítás */

setTimeout(() => {
  intro.classList.add("hide");
  introText.classList.add("hide");

  setTimeout(() => {
    revealText(finalText);
  }, 1200);
}, 1200);

const introText = document.getElementById("introText");
