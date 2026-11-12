export function gradiantScript() {
     const selectedColor = 0

     function loadColorButtons() {
        
        if (!colorRow) return;

        colorRow.innerHTML = themeButtons.map(([index, color1, color2]) => `
            <button type="button" name="color" class="colorCircle" data-set="${index}" style="background: linear-gradient(0.25turn, ${color1}, ${color2});;" aria-label="Theme Color Button"></button>
        `).join("");
    }
     function clickColor () {
        colorRow.querySelectorAll('.colorCircle').forEach((button) => {
            button.addEventListener('click', () => {
                console.log("test")
                const [, color1, color2] = themeButtons[Number(button.dataset.set)];
                document.documentElement.style.setProperty(
                    '--theme-gradient',
                    `linear-gradient(0.25turn, ${color1}, ${color2})`
                )
            })
        })
    }

     function syncGradient() {
    const w = window.innerWidth;
    document.querySelectorAll('.clockDigit').forEach(el => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--gw', w + 'px');
        el.style.setProperty('--gx', rect.left + 'px');
    });
    }
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
    console.log(is12Hour)
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
    document.getElementById('fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
    
    })

    let idleTime = null;
    const hiddenItem = document.getElementById('hiddenButtons')

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

    window.addEventListener('resize', syncGradient);
    window.addEventListener('orientationchange', syncGradient);
    document.fonts?.ready.then(syncGradient);
    syncGradient();
    window.addEventListener('mousemove', showAndResetTimer);
    window.addEventListener('pointerdown', showAndResetTimer);
    window.addEventListener('touchstart', showAndResetTimer);

    showAndResetTimer()
    startTime()
    loadColorButtons()
    clickColor()
}
export function gradiantInfo() {
     const selectedColor = 0
    const colorRow = document.getElementById('colorRow')
    const themeButtons = [
        [0, "#e68e66", "#d15392"],
        [1, "#FDBB2D", "#3A1C71"],
        [2, "#FC466B", "#3F5EFB"],
        [3, "#8dc7ff", "#dfc5fc"],
        [4, "#333333", "#c997c9"],

    ];

     function loadColorButtons() {
        
        if (!colorRow) return;

        colorRow.innerHTML = themeButtons.map(([index, color1, color2]) => `
            <button type="button" name="color" class="colorCircle" data-set="${index}" style="background: linear-gradient(0.25turn, ${color1}, ${color2});;" aria-label="Theme Color Button"></button>
        `).join("");
    }
     function clickColor () {
        colorRow.querySelectorAll('.colorCircle').forEach((button) => {
            button.addEventListener('click', () => {
                console.log("test")
                const [, color1, color2] = themeButtons[Number(button.dataset.set)];
                document.documentElement.style.setProperty(
                    '--theme-gradient',
                    `linear-gradient(0.25turn, ${color1}, ${color2})`
                )
            })
        })
    }

     function syncGradient() {
    const w = window.innerWidth;
    document.querySelectorAll('.clockDigit').forEach(el => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--gw', w + 'px');
        el.style.setProperty('--gx', rect.left + 'px');
    });
    }
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
    console.log(is12Hour)
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
    document.getElementById('fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
    
    })

    let idleTime = null;
    const hiddenItem = document.getElementById('hiddenButtons')

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

    window.addEventListener('resize', syncGradient);
    window.addEventListener('orientationchange', syncGradient);
    document.fonts?.ready.then(syncGradient);
    syncGradient();
    window.addEventListener('mousemove', showAndResetTimer);
    window.addEventListener('pointerdown', showAndResetTimer);
    window.addEventListener('touchstart', showAndResetTimer);

    showAndResetTimer()
    startTime()
    loadColorButtons()
    clickColor()
}