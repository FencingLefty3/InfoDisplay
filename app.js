import { loadColorButtons, clickColor } from './scripts.js';

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
function startTime() {
  const today = new Date();
  let hours = today.getHours();

  const is12Hour = Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;
  let ampm = "";

  if (is12Hour) {
    ampm = hours >= 12 ? "" : "";
    hours = hours % 12 || 12; // Converts 0 to 12 and 13-23 to 1-11
  }

  const text = `${checkTime(hours)}:${checkTime(today.getMinutes())}${ampm}`;
  const time = document.getElementById("time");

  time.setAttribute("aria-label", text);

  if (time.children.length === 0) {
    time.replaceChildren(
      ...Array.from(text, (character) => {
        const card = document.createElement("span");
        card.className = "clockChar";

        const digit = document.createElement("span");
        digit.className = "clockDigit";
        digit.textContent = character;

        card.append(digit);
        return card;
      })
    );
  } else {
    Array.from(time.children).forEach((card, index) => {
      const digit = card.querySelector(".clockDigit");

      if (digit.textContent !== text[index]) {
        digit.textContent = text[index];
        card.classList.remove("flip");
        void card.offsetWidth; // Restart the animation for this changed character.
        card.classList.add("flip");
      }
    });
  }

  setTimeout(startTime, 500);
}

document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsDialog').showModal()
})

let idleTime = null;
const hiddenItem = document.getElementById('settingsBtn')

function showAndResetTimer() {
  hiddenItem.classList.remove('hidden')
  clearTimeout(idleTime)

  idleTime = setTimeout(() => {
    hiddenItem.classList.add('hidden')
  }, 3000)
}
document.getElementById('settingsDialog').addEventListener('click', (event) => {
    if (event.target === document.getElementById('settingsDialog')) {
      document.getElementById('settingsDialog').close();
    }
  });
window.addEventListener('mousemove', showAndResetTimer);
window.addEventListener('pointerdown', showAndResetTimer);
window.addEventListener('touchstart', showAndResetTimer);

showAndResetTimer()
startTime()
loadColorButtons()
clickColor()