export function gradiantScript() {
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
    let ampm = "";

    if (is12Hour) {
        ampm = hours >= 12 ? "" : "";
        hours = hours % 12 || 12; // Converts 0 to 12 and 13-23 to 1-11
    }

    const text = `${checkTime(hours)}:${checkTime(today.getMinutes())}${ampm}`;
    const time = document.getElementById("gradientTime");

    time.setAttribute("aria-label", text);

    if (time.children.length === 0) {
        time.replaceChildren(
        ...Array.from(text, (character) => {
            const card = document.createElement("span");
            card.className = "clockChar";

            const digit = document.createElement("span");
            digit.className = "clockDigit";
            digit.textContent = character;
            digit.id = "gradiant";

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
    window.addEventListener('scroll', syncGradient, true);
    document.fonts?.ready.then(syncGradient);
    window.addEventListener('mousemove', showAndResetTimer);
    window.addEventListener('pointerdown', showAndResetTimer);
    window.addEventListener('touchstart', showAndResetTimer);

    showAndResetTimer()
    startTime()
    requestAnimationFrame(syncGradient);
    loadColorButtons()
    clickColor()
}
export function plainScript() {
    const w = window.innerWidth;
    document.querySelectorAll('.clockDigit').forEach(el => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--gw', w + 'px');
        el.style.setProperty('--gx', rect.left + 'px');
    });

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
        const time = document.getElementById("plainTime");

        time.setAttribute("aria-label", text);

        if (time.children.length === 0) {
            time.replaceChildren(
                ...Array.from(text, (character) => {
                    if (character === ":") {
                        const card = document.createElement("span");
                        return card;
                    } else {
                        const card = document.createElement("span");
                        card.className = "clockChar";

                        const digit = document.createElement("span");
                        digit.className = "clockDigit";
                        digit.textContent = character;
                        digit.id = "plain";

                        card.append(digit);
                        return card;
                    }})
            );
        } else {
            Array.from(time.children).forEach((card, index) => {
                const digit = card.querySelector(".clockDigit");
                if (!digit) return;                      // the colon spacer has no digit

                if (digit.textContent !== text[index]) {
                    digit.textContent = text[index];
                    card.classList.remove("flip");
                    void card.offsetWidth;
                    card.classList.add("flip");
                }
            });
        }

        setTimeout(startTime, 500);
    }

    startTime();
}
export function dateScript() {
    const container = document.getElementById('plainDate');

    function getParts() {
        const now = new Date();
        const date = String(now.getDate()).padStart(2, '0');
        return [
            { text: now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), word: true },  // SUN
            { text: now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), word: true },    // NOV
            { text: " "     },
            { text: date[0] },                                                                          // 1
            { text: date[1] },                                                                          // 5
        ];
    }

    function buildCard({ text, word }) {
        if (text === " ") {
            const card = document.createElement("span");
            return card;
        } else {
            const card = document.createElement('span');
            card.className = word ? 'clockChar word' : 'clockChar';

            const digit = document.createElement('span');
            digit.className = 'clockDigit';
            digit.textContent = text;

            card.append(digit);
            return card;
        }}

    function update() {
        const parts = getParts();
        container.setAttribute('aria-label', `${parts[0].text} ${parts[1].text} ${parts[2].text}${parts[3].text}`);

        if (container.children.length !== parts.length) {
            container.replaceChildren(...parts.map(buildCard));
            return;
        }

        Array.from(container.children).forEach((card, i) => {
            const digit = card.firstChild;
            if (digit.textContent === parts[i].text) return;
            card.classList.remove('flip');
            void card.offsetWidth;                                   // restart the animation
            card.classList.add('flip');
            setTimeout(() => { digit.textContent = parts[i].text; }, 200);   // swap at the flip's midpoint
        });
    }

    update();
    setInterval(update, 1000);
}
import { Moon } from 'https://esm.sh/lunarphase-js@2.0.3';
export function phaseScript() {
    const FALLBACK = { lat: 0, lon: 0 };      // set your own coordinates for when location is denied
    const MOON_COLS = 15;                     // "WAXING CRESCENT" is the longest phase name
    const is12Hour = Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;

    const root = document.getElementById('phase');
    root.replaceChildren();
    const moonRows = document.createElement('div');
    const moonTopRow = document.createElement('div');
    const moonBottomRow = document.createElement('div');
    const sunRow = document.createElement('div');
    moonRows.className = 'moonRows';
    moonTopRow.className = moonBottomRow.className = sunRow.className = 'phaseRow';
    moonRows.append(moonTopRow, moonBottomRow);
    root.append(moonRows, sunRow);

    let coords = null;
    let sun = null;                           // { offset, events: [{ label, iso }] }

    // ---------- content ----------
    function moonText() {
        const n = Moon.lunarPhase().toUpperCase();
        return n === 'NEW' || n === 'FULL' ? `${n} MOON` : n;
    }

    function formatTime(iso) {                // "2026-11-15T16:30" -> " 4:30P" or "16:30"
        if (!iso) return is12Hour ? '--:-- ' : '--:--';
        let [h, m] = iso.slice(11, 16).split(':').map(Number);
        const mm = String(m).padStart(2, '0');
        if (!is12Hour) return `${String(h).padStart(2, '0')}:${mm}`;
        const suffix = h >= 12 ? 'P' : 'A';
        h = h % 12 || 12;
        return `${String(h).padStart(2, ' ')}:${mm}${suffix}`;
    }

    function nextEvent() {
        if (!sun) return null;
        // the API's times are local to the place, so compare against the place's own "now"
        const placeNow = Date.now() + sun.offset * 1000;
        return sun.events.find((e) => Date.parse(e.iso + 'Z') > placeNow) ?? null;
    }

    // ---------- rows ----------
    function moonParts() {
        const words = moonText().split(' ');
        const lines = words.length > 1 ? words : [words[0], ''];
        return lines.map((line) => Array.from(line.slice(0, MOON_COLS), (c) => ({ text: c })));
    }

    function sunParts() {
        const ev = nextEvent();
        return [
            { text: ev ? ev.label : 'SUN', word: true },
            ...Array.from(formatTime(ev?.iso), (c) => ({ text: c, colon: c === ':' })),
        ];
    }

    function buildCard(part) {
        if (part.colon) {
            const colon = document.createElement('span');
            colon.className = 'clockColon';
            colon.textContent = ':';
            return colon;
        }
        const card = document.createElement('span');
        card.className = part.word ? 'clockChar word' : 'clockChar';
        const digit = document.createElement('span');
        digit.className = 'clockDigit';
        digit.textContent = part.text;
        card.append(digit);
        return card;
    }

    function renderRow(el, parts, aria) {
        el.setAttribute('aria-label', aria);
        if (el.children.length !== parts.length) {
            el.replaceChildren(...parts.map(buildCard));
            return;
        }
        Array.from(el.children).forEach((card, i) => {
            const digit = card.querySelector('.clockDigit');
            if (!digit || digit.textContent === parts[i].text) return;   // skips the colon and unchanged cells
            const delay = i * 40;
            card.style.animationDelay = delay + 'ms';
            card.classList.remove('flip');
            void card.offsetWidth;
            card.classList.add('flip');
            setTimeout(() => { digit.textContent = parts[i].text; }, delay + 200);   // swap at the flip's midpoint
        });
    }

    function render() {
        const [topParts, bottomParts] = moonParts();
        renderRow(moonTopRow, topParts, moonText());
        renderRow(moonBottomRow, bottomParts, '');
        const ev = nextEvent();
        renderRow(sunRow, sunParts(), ev ? `${ev.label} ${formatTime(ev.iso).trim()}` : 'sun');
    }

    // ---------- data ----------
    async function load() {
        if (!coords) {
            try {
                const pos = await new Promise((res, rej) =>
                    navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 }));
                coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            } catch {
                coords = FALLBACK;
            }
        }
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
                        `&daily=sunrise,sunset&timezone=auto&forecast_days=2`;
            const data = await (await fetch(url)).json();
            const d = data.daily;
            sun = {
                offset: data.utc_offset_seconds,
                events: [
                    { label: 'RISE', iso: d.sunrise[0] },
                    { label: 'SET',  iso: d.sunset[0] },
                    { label: 'RISE', iso: d.sunrise[1] },
                    { label: 'SET',  iso: d.sunset[1] },
                ],
            };
        } catch {
            sun = null;                       // keep showing dashes
        }
        render();
    }

    render();                                 // moon and dashes appear straight away
    load();
    setInterval(load, 3 * 60 * 60 * 1000);    // refetch every few hours
    setInterval(render, 30 * 1000);           // re-check which event is next, and the moon
}

export function infoScript() {
    const ASPECT = 0.72;        
    const MIN_COLS = 16;        
    const TARGET_ROWS = 8;      

    const board = document.getElementById('board');
    const is12Hour = Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;
    const pad2 = (i) => String(i).padStart(2, '0');

    let rows = 0, cols = 0, cells = [], filled = false;


    const params = new URLSearchParams(location.search);
    const TEST = params.has('test');
    const FAKE = TEST || params.has('date') || params.has('time');
    const PAGE_MS = TEST ? 4000 : 8000;      

    const simStart = (() => {
        const d = new Date();
        const date = params.get('date');     
        if (date) { const [y, m, dd] = date.split('-').map(Number); d.setFullYear(y, m - 1, dd); }
        const time = params.get('time');     
        if (time) { const [h, mi] = time.split(':').map(Number); d.setHours(h, mi, 0, 0); }
        return d;
    })();
    const realStart = Date.now();

    function getNow() {
        if (!FAKE) return new Date();
        const elapsed = Date.now() - realStart;
        return new Date(simStart.getTime() + elapsed * (TEST ? 60 : 1)); 
    }

    let page = 0;
    // ---------- grid ----------
    function buildGrid() {
        const W = board.clientWidth, H = board.clientHeight;
        rows = TARGET_ROWS;
        cols = Math.floor(W / ((H / rows) * ASPECT));
        if (cols < MIN_COLS) {                       
            cols = MIN_COLS;
            rows = Math.max(1, Math.floor(H / (W / cols / ASPECT)));
        }
        const cw = W / cols, ch = H / rows;
        board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        board.style.fontSize = Math.min(ch, cw / ASPECT) + 'px';

        board.replaceChildren(...Array.from({ length: rows * cols }, () => {
            const card = document.createElement('span');
            card.className = 'clockChar';
            const digit = document.createElement('span');
            digit.className = 'clockDigit';
            digit.textContent = ' ';
            card.append(digit);
            return card;
        }));
        cells = Array.from(board.children);
        filled = false;                             
    }

    const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-./';
    const STEP_MS = 70;     
    const MAX_STEPS = 12;    

    function setCell(card, ch, delay, instant) {
        const digit = card.firstChild;
        const current = card._target ?? digit.textContent;
        if (current === ch) return;                  

        card._target = ch;
        const run = (card._run = (card._run || 0) + 1);   

        if (instant) { digit.textContent = ch; return; }

        const len = CHARS.length;
        const from = Math.max(0, CHARS.indexOf(digit.textContent));
        const to = Math.max(0, CHARS.indexOf(ch));
        const dist = (to - from + len) % len;
        let k = Math.min(dist, MAX_STEPS);           

        function next() {
            if (card._run !== run || k === 0) return;
            const shown = CHARS[(to - (k - 1) + len) % len];

            card.style.animation = 'none';
            void card.offsetWidth;
            card.style.animation = `flip ${STEP_MS}ms linear`;
            setTimeout(() => {
                if (card._run === run) digit.textContent = shown;   
            }, STEP_MS * 0.4);

            k--;
            setTimeout(next, STEP_MS);
        }
        setTimeout(next, delay);
    }

    
    function render(lines) {
        let list = lines;
        if (list.length > rows) list = list.filter((l) => l !== '');
        list = list.slice(0, rows);
        const top = Math.floor((rows - list.length) / 2);

        for (let r = 0; r < rows; r++) {
            let s = (list[r - top] ?? '').toUpperCase().slice(0, cols);
            s = ' '.repeat(Math.floor((cols - s.length) / 2)) + s;
            s = s.padEnd(cols);
            for (let c = 0; c < cols; c++) {
                setCell(cells[r * cols + c], s[c], c * 30 + r * 15, !filled);
            }
        }
        filled = true;
    }

    // ---------- content ----------
    function nthWeekday(y, m, wd, n) {            
        if (n > 0) {
            const first = new Date(y, m, 1).getDay();
            return 1 + ((wd - first + 7) % 7) + (n - 1) * 7;
        }
        const last = new Date(y, m + 1, 0);
        return last.getDate() - ((last.getDay() - wd + 7) % 7);
    }
    function holidaysFor(y) {
        return [
            [0, 1, 'NEW YEARS DAY'],
            [0, nthWeekday(y, 0, 1, 3), 'MLK DAY'],
            [1, 14, 'VALENTINES'],
            [1, nthWeekday(y, 1, 1, 3), 'PRESIDENTS DAY'],
            [4, nthWeekday(y, 4, 1, -1), 'MEMORIAL DAY'],
            [5, 19, 'JUNETEENTH'],
            [6, 4, 'JULY 4TH'],
            [8, nthWeekday(y, 8, 1, 1), 'LABOR DAY'],
            [9, nthWeekday(y, 9, 1, 2), 'COLUMBUS DAY'],
            [9, 31, 'HALLOWEEN'],
            [10, 11, 'VETERANS DAY'],
            [10, nthWeekday(y, 10, 4, 4), 'THANKSGIVING'],
            [11, 25, 'CHRISTMAS'],
            [11, 31, 'NEW YEARS EVE'],
        ].map(([m, d, name]) => ({ date: new Date(y, m, d), name }));
    }
    function nextHoliday(now) {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const y = now.getFullYear();
        const next = [...holidaysFor(y), ...holidaysFor(y + 1)].find((h) => h.date >= today);
        return { name: next.name, days: Math.round((next.date - today) / 864e5) };
    }

    function tick() {
        const now = getNow();
        let hours = now.getHours();
        let suffix = '';
        if (is12Hour) {
            suffix = hours >= 12 ? 'p' : 'a';
            hours = hours % 12 || 12;
        }
        const timeText = `${pad2(hours)}:${pad2(now.getMinutes())}${suffix}`;
        board.setAttribute('aria-label', timeText);

        const mon = now.toLocaleDateString('en-US', { month: 'short' });
        const h = nextHoliday(now);

       
        const pages = [
            [now.toLocaleDateString('en-US', { weekday: 'long' }), `${mon} ${now.getDate()} ${now.getFullYear()}`],
            [h.name, h.days === 0 ? 'TODAY' : h.days === 1 ? 'TOMORROW' : `IN ${h.days} DAYS`],
        ];

        render([timeText, '', ...pages[page % pages.length]]);
    }

    buildGrid();
    tick();
    setInterval(tick, 1000);
    setInterval(() => { page++; tick(); }, PAGE_MS);

    let resizeTimer = null;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { buildGrid(); tick(); }, 150);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsDialog').showModal();
    });
    document.getElementById('fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    });

    let idleTime = null;
    const hiddenItem = document.getElementById('hiddenButtons');
    function showAndResetTimer() {
        hiddenItem.classList.remove('hidden');
        clearTimeout(idleTime);
        idleTime = setTimeout(() => hiddenItem.classList.add('hidden'), 3000);
    }
    document.getElementById('settingsDialog').addEventListener('click', (event) => {
        if (event.target === document.getElementById('settingsDialog')) {
            document.getElementById('settingsDialog').close();
        }
    });
    window.addEventListener('mousemove', showAndResetTimer);
    window.addEventListener('pointerdown', showAndResetTimer);
    window.addEventListener('touchstart', showAndResetTimer);
    showAndResetTimer();
}