export function gradiantScript() {
    const colorRow = document.getElementById('colorRow');
    const themeButtons = [
        [0, "#e68e66", "#d15392"],
        [1, "#FDBB2D", "#3A1C71"],
        [2, "#FC466B", "#3F5EFB"],
        [3, "#8dc7ff", "#dfc5fc"],
        [4, "#333333", "#c997c9"],

    ];
    const savedColor = Number(localStorage.getItem('themeColor'));
    const selectedColor = themeButtons.some(([index]) => index === savedColor) ? savedColor : 0;

    function applyColor(index, save = false) {
        const theme = themeButtons.find(([themeIndex]) => themeIndex === index);
        if (!theme) return;

        const [, color1, color2] = theme;
        document.documentElement.style.setProperty(
            '--theme-gradient',
            `linear-gradient(0.25turn, ${color1}, ${color2})`
        );
        if (save) localStorage.setItem('themeColor', String(index));
        colorRow?.querySelectorAll('.colorCircle').forEach((button) => {
            button.setAttribute('aria-pressed', String(Number(button.dataset.set) === index));
        })
    }

    function loadColorButtons() {
        if (!colorRow) return;

        colorRow.innerHTML = themeButtons.map(([index, color1, color2]) => `
            <button type="button" name="color" class="colorCircle" data-set="${index}" style="background: linear-gradient(0.25turn, ${color1}, ${color2});" aria-label="Theme Color Button"></button>
        `).join("");
        colorRow.querySelectorAll('.colorCircle').forEach((button) => {
            button.addEventListener('click', () => {
                applyColor(Number(button.dataset.set), true);
            });
        });
        applyColor(selectedColor);
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

    window.addEventListener('resize', syncGradient);
    window.addEventListener('orientationchange', syncGradient);
    window.addEventListener('scroll', syncGradient, true);
    document.fonts?.ready.then(syncGradient);

    startTime()
    requestAnimationFrame(syncGradient);
    loadColorButtons()
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
    let sunDisplayMode = 0;

    // ---------- content ----------
    function moonText() {
        const n = Moon.lunarPhase().toUpperCase();
        return n === 'NEW' || n === 'FULL' ? `${n} MOON` : n;
    }

    function formatClockTime(h, m) {
        const mm = String(m).padStart(2, '0');
        if (!is12Hour) return `${String(h).padStart(2, '0')}:${mm}`;
        const suffix = h >= 12 ? 'P' : 'A';
        h = h % 12 || 12;
        return `${String(h).padStart(2, ' ')}:${mm}${suffix}`;
    }

    function formatTime(iso) {
        if (!iso) return is12Hour ? '--:-- ' : '--:--';
        const [h, m] = iso.slice(11, 16).split(':').map(Number);
        return formatClockTime(h, m);
    }

    function currentSunTime() {
        const now = sun ? new Date(Date.now() + sun.offset * 1000) : new Date();
        return sun
            ? formatClockTime(now.getUTCHours(), now.getUTCMinutes())
            : formatClockTime(now.getHours(), now.getMinutes());
    }

    function nextEvent() {
        if (!sun) return null;
        if (sunDisplayMode === 2) return null;
        // the API's times are local to the place, so compare against the place's own "now"
        const placeNow = Date.now() + sun.offset * 1000;
        const label = sunDisplayMode === 0 ? 'RISE' : 'SET';
        return sun.events.find((event) =>
            event.label === label && Date.parse(event.iso + 'Z') > placeNow
        ) ?? null;
    }

    // ---------- rows ----------
    function moonParts() {
        const words = moonText().split(' ');
        const lines = words.length > 1 ? words : [words[0], ''];
        return lines.map((line) => Array.from(line.slice(0, MOON_COLS), (c) => ({ text: c })));
    }

    function sunParts() {
        const ev = nextEvent();
        if (sunDisplayMode === 2) {
            return [
                { text: 'SUN', word: true },
                ...Array.from(currentSunTime(), (c) => ({ text: c, colon: c === ':' })),
            ];
        }
        return [
            { text: sunDisplayMode === 0 ? 'RISE' : 'SET', word: true },
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
        const ariaLabel = sunDisplayMode === 2
            ? `SUN ${currentSunTime().trim()}`
            : `${sunDisplayMode === 0 ? 'RISE' : 'SET'} ${ev ? formatTime(ev.iso).trim() : '--:--'}`;
        renderRow(sunRow, sunParts(), ariaLabel);
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
    setInterval(() => {
        sunDisplayMode = (sunDisplayMode + 1) % 3;
        render();
    }, 8 * 1000);
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
export function eventScript() {
    const COLS = 12, ROWS = 3
    const PAGE_MS = 5000;
    const KEY_NAME = 'event:name', KEY_TIME = 'event:time'

    const root = document.getElementById('event')
    const dialog = document.getElementById('eventDialog')
    const form = document.getElementById('eventForm')
    const nameInput = document.getElementById('eventNameInput')
    const timeInput = document.getElementById('eventTimeInput')


    root.replaceChildren(...Array.from({ length: ROWS * COLS }, () => {
        const card = document.createElement('span');
        card.className = 'clockChar';
        const digit = document.createElement('span');
        digit.className = 'clockDigit';
        digit.textContent = ' ';
        card.append(digit);
        return card;
    }));
    
    const cells = Array.from(root.children);
    let filled = false

    function setCell(card, ch, delay) {
        const digit = card.firstChild;
        if (digit.textContent === ch) return;
        if (!filled) { digit.textContent = ch; return; }
        card.style.animationDelay = delay + 'ms';
        card.classList.remove('flip')
        void card.offsetWidth
        card.classList.add('flip')
        setTimeout(() => { digit.textContent = ch; }, delay + 200)
    }

    function show(lines) {
        const list = lines.slice(0, ROWS)
        const top = Math.floor((ROWS - list.length) / 2)
        for (let r = 0; r < ROWS; r++) {
            let s = (list[r - top] ?? '').slice(0, COLS)
            s = ' '.repeat(Math.floor((COLS - s.length) / 2)) + s;
            s = s.padEnd(COLS)
            for (let c = 0; c < COLS; c++) setCell(cells[r * COLS + c], s[c], c * 30 + r * 15);
        }
        filled = true;
    }


    function wrap(text) {
        const lines = [];
        let line = '';
        for (const w of text.toUpperCase().split(/\s+/).filter(Boolean)) {
            const word = w.slice(0, COLS);
            if (!line) line = word;
            else if ((line + ' ' + word).length <= COLS) line += ' ' + word;
            else { lines.push(line); line = word; }
        }
        if (line) lines.push(line);
        return lines.slice(0, ROWS);
    }

    function untilLines(target) {
        let s = Math.floor((target - Date.now()) / 1000);
        if (s <= 0) return ['CURRENTLY'];
        const d = Math.floor(s / 86400); s -= d * 86400;
        const h = Math.floor(s / 3600); s -= h * 3600;
        const m = Math.floor(s / 60); s -= m * 60;
        if (d > 0) return ['IN', `${d} ${d === 1 ? 'DAY' : 'DAYS'}`, `${h}H ${m}M`]
        if (h > 0) return ['IN', `${h}H ${m}M`, `${s}S`]
        return ['IN', `${m}M ${s}S`];
    }

    function getEvent() {
        const name = localStorage.getItem(KEY_NAME);
        const time = localStorage.getItem(KEY_TIME);
        if (!name || !time) return null;
        const t = new Date(time);
        return isNaN(t) ? null : { name, t };
    }

    let page = 0
    function tick() {
        const ev = getEvent()
        if (!ev) return show(['CLICK TO ADD', 'AN EVENT'])
        show(page % 2 === 0 ? wrap(ev.name) : untilLines(ev.t))
    }

    tick()
    setInterval(tick, 1000)
    setInterval(() => { page++; tick(); }, PAGE_MS)



    root.addEventListener('click', () => {
        nameInput.value = localStorage.getItem(KEY_NAME) ?? '';
        timeInput.value = localStorage.getItem(KEY_TIME) ?? '';
        dialog.showModal();
    })
    form.addEventListener('submit', (e)  => {
        e.preventDefault()
        localStorage.setItem(KEY_NAME, nameInput.value.trim())
        localStorage.setItem(KEY_TIME, timeInput.value)
        page = 0
        dialog.close()
        tick()
    })
    document.getElementById('eventClear').addEventListener('click', () => {
        localStorage.removeItem(KEY_NAME)
        localStorage.removeItem(KEY_TIME)
        dialog.close()
        tick()
    })
    document.getElementById('eventCancel').addEventListener('click', () => dialog.close())
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close() })
    
    const box = root.parentElement
    function fit() {
        const cs = getComputedStyle(box)
        const w = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        const h = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        root.style.fontSize = Math.min(w / 9.3, h / 3.2) + 'px';
    }
    new ResizeObserver(fit).observe(box)
    fit()
}
export function worldClockScript() {
    const MAX_ROWS = 4;
    const COLS = 14
    const KEY = 'worldClock:zones'
    const DEFAULTS = ['America/New_York', 'Europe/London', 'Asia/Tokyo']

    const CITIES = [                                   // [label up to 5 characters, name in the picker, IANA zone]
        ['ANC', 'Anchorage', 'America/Anchorage'],
        ['VAN', 'Vancouver', 'America/Vancouver'],
        ['HNL', 'Honolulu', 'Pacific/Honolulu'],
        ['LAX', 'Los Angeles', 'America/Los_Angeles'],
        ['DEN', 'Denver', 'America/Denver'],
        ['CHI', 'Chicago', 'America/Chicago'],
        ['NYC', 'New York', 'America/New_York'],
        ['YYZ', 'Toronto', 'America/Toronto'],
        ['MEX', 'Mexico City', 'America/Mexico_City'],
        ['SAO', 'Sao Paulo', 'America/Sao_Paulo'],
        ['LON', 'London', 'Europe/London'],
        ['PAR', 'Paris', 'Europe/Paris'],
        ['BER', 'Berlin', 'Europe/Berlin'],
        ['ROM', 'Rome', 'Europe/Rome'],
        ['MAD', 'Madrid', 'Europe/Madrid'],
        ['ATH', 'Athens', 'Europe/Athens'],
        ['IST', 'Istanbul', 'Europe/Istanbul'],
        ['MOW', 'Moscow', 'Europe/Moscow'],
        ['CAI', 'Cairo', 'Africa/Cairo'],
        ['LOS', 'Lagos', 'Africa/Lagos'],
        ['NBO', 'Nairobi', 'Africa/Nairobi'],
        ['JNB', 'Johannesburg', 'Africa/Johannesburg'],
        ['DXB', 'Dubai', 'Asia/Dubai'],
        ['DEL', 'Delhi', 'Asia/Kolkata'],
        ['DAC', 'Dhaka', 'Asia/Dhaka'],
        ['BKK', 'Bangkok', 'Asia/Bangkok'],
        ['SIN', 'Singapore', 'Asia/Singapore'],
        ['HKG', 'Hong Kong', 'Asia/Hong_Kong'],
        ['SHA', 'Shanghai', 'Asia/Shanghai'],
        ['SEL', 'Seoul', 'Asia/Seoul'],
        ['TYO', 'Tokyo', 'Asia/Tokyo'],
        ['SYD', 'Sydney', 'Australia/Sydney'],
        ['AKL', 'Auckland', 'Pacific/Auckland'],
        ['UTC', 'UTC', 'UTC'],
    ];

    const root = document.getElementById('worldClock')
    const dialog = document.getElementById('worldDialog')
    const form = document.getElementById('worldForm')
    const pickers = document.getElementById('worldPickers')
    if (![root, dialog, form, pickers].every(Boolean)) {
        console.warn('worldClockScript: Missing elementsBy id; HTML')
        return;
    }

    const is12Hour = Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12;
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const hourOptions = is12Hour ? { hour12: true } : { hourCycle: 'h23' }
    const dayFormat = { year: 'numeric', month: '2-digit', day: '2-digit'}
    const localDay = new Intl.DateTimeFormat('en-CA', dayFormat)


function readZones() {
        try {
            const saved = JSON.parse(localStorage.getItem(KEY));
            if (Array.isArray(saved)) {
                return saved
                    .filter((z) => typeof z === 'string')
                    .map((z) => z === 'Amercia/New_Yourk' ? 'America/New_York' : z)
                    .slice(0, MAX_ROWS);
            }
        } catch { /* fall through to the defaults */ }
        return DEFAULTS;
    }

    function entryFor(value) {                         // value is an IANA zone, or 'local' for this device
        const tz = value === 'local' ? localTz : value;
        try {
            const city = CITIES.find((c) => c[2] === value);
            return {
                label: value === 'local' ? 'HOME'
                    : city ? city[0]
                    : value.split('/').pop().replace(/_/g, ' ').toUpperCase().slice(0, 5),
                time: new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', ...hourOptions }),
                day: new Intl.DateTimeFormat('en-CA', { timeZone: tz, ...dayFormat }),
            };
        } catch {
            return null;                               // unknown zone name
        }
    }

    let zones = readZones();
    let entries = [];
    let rows = 2;
    let cells = [];
    let filled = false;

    // ---------- grid ----------
    function buildGrid() {
        entries = zones.map(entryFor).filter(Boolean);
        rows = Math.max(entries.length, 2);            // the empty message needs two rows
        root.replaceChildren(...Array.from({ length: rows * COLS }, () => {
            const card = document.createElement('span');
            card.className = 'clockChar';
            const digit = document.createElement('span');
            digit.className = 'clockDigit';
            digit.textContent = ' ';
            card.append(digit);
            return card;
        }));
        cells = Array.from(root.children);
        filled = false;                                // the next fill is instant
    }

    function setCell(card, ch, delay) {
        const digit = card.firstChild;
        if (digit.textContent === ch) return;
        if (!filled) { digit.textContent = ch; return; }
        card.style.animationDelay = delay + 'ms';
        card.classList.remove('flip');
        void card.offsetWidth;
        card.classList.add('flip');
        setTimeout(() => { digit.textContent = ch; }, delay + 200);   // swap at the flip's midpoint
    }

    function show(lines) {
        for (let r = 0; r < rows; r++) {
            const s = (lines[r] ?? '').slice(0, COLS).padEnd(COLS);
            for (let c = 0; c < COLS; c++) setCell(cells[r * COLS + c], s[c], c * 30 + r * 15);
        }
        filled = true;
    }

    // ---------- content ----------
    const dayNumber = (fmt, now) => {
        const [y, m, d] = fmt.format(now).split('-').map(Number);
        return Date.UTC(y, m - 1, d);
    };

    function formatTime(fmt, now) {
        const p = Object.fromEntries(fmt.formatToParts(now).map((x) => [x.type, x.value]));
        if (is12Hour) return `${p.hour}:${p.minute}${(p.dayPeriod ?? '')[0] ?? ''}`;   // "3:05P"
        return `${p.hour.padStart(2, '0')}:${p.minute}`;                                // "15:05"
    }

    const center = (s) => ' '.repeat(Math.floor((COLS - s.length) / 2)) + s;

    function lines() {
        if (!entries.length) return [center('TAP TO ADD'), center('A CITY')];
        const now = new Date();
        const today = dayNumber(localDay, now);
        return entries.map((e) => {
            const diff = Math.round((dayNumber(e.day, now) - today) / 864e5);
            const tag = diff > 0 ? `+${diff}` : diff < 0 ? `${diff}` : '';
            return e.label.toUpperCase().slice(0, 5).padEnd(5) + formatTime(e.time, now).padStart(6) + ' ' + tag.padStart(2);
        });
    }

    function refresh() {
        buildGrid();
        show(lines());
        fit();
    }

    // ---------- picker ----------
    const selects = Array.from({ length: MAX_ROWS }, (_, i) => {
        const sel = document.createElement('select');
        sel.setAttribute('aria-label', `City ${i + 1}`);
        sel.add(new Option('none', ''));
        sel.add(new Option('This device', 'local'));
        CITIES.forEach(([, name, tz]) => sel.add(new Option(name, tz)));
        pickers.append(sel);
        return sel;
    });

    root.addEventListener('click', () => {
        selects.forEach((sel, i) => { sel.value = zones[i] ?? ''; });
        dialog.showModal();
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        zones = [...new Set(selects.map((s) => s.value).filter(Boolean))];   // no blanks, no duplicates
        localStorage.setItem(KEY, JSON.stringify(zones));
        dialog.close();
        refresh();
    });
    document.getElementById('worldReset')?.addEventListener('click', () => {
        localStorage.removeItem(KEY);
        zones = DEFAULTS;
        dialog.close();
        refresh();
    });
    document.getElementById('worldCancel')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

    // ---------- fit to the box ----------
    const box = root.parentElement;
    function fit() {
        const cs = getComputedStyle(box);
        const w = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const h = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const widthEm = COLS * 0.72 + (COLS - 1) * 0.05;
        const heightEm = rows + (rows - 1) * 0.05;
        root.style.fontSize = Math.min(w / widthEm, h / heightEm) + 'px';
    }
    new ResizeObserver(fit).observe(box);

    refresh();
    setInterval(() => show(lines()), 1000);
}
export function batteryScript() {
    const COLS = 6, ROWS = 3;

    const root = document.getElementById('battery')
    if (!root) {
        console.log('batteryScript: missing getElementById HTML')
        return;
    }


    root.replaceChildren(...Array.from({ length: ROWS * COLS }, () => {
        root.style.gridTemplateColumns = `repeat(${COLS}, 0.72em)`;
        const card = document.createElement('span');
        card.className = 'clockChar'
        const digit = document.createElement('span')
        digit.className = 'clockDigit'
        digit.textContent = ' '
        card.append(digit)
        return card;
    }))
    const cells = Array.from(root.children)
    let filled = false
    
    function setCell(card, ch, delay) {
        const digit = card.firstChild
        if (digit.textContent === ch) return
        if (!filled) { digit.textContent = ch; return; }
        card.style.animationDelay = delay + 'ms'
        card.classList.remove('flip')
        void card.offsetWidth
        card.classList.add('flip')
        setTimeout(() => { digit.textContent = ch; }, delay + 200)
    }

    function show(lines) {
        const list = lines.slice(0, ROWS)
        const top = Math.floor((ROWS - list.length) / 2)
        for (let r = 0; r < ROWS; r++) {
            let s = (list[r - top] ?? '').slice(0, COLS)
            s = ' '.repeat(Math.floor((COLS - s.length) / 2)) + s;
            s = s.padEnd(COLS)
            for (let c = 0; c < COLS; c++) setCell(cells[r * COLS + c], s[c], c * 30 + r * 15)
        }
        filled = true;
    }

    const PAGE_MS = 2500;                 // how long each piece stays up
    let current = [];                     // the full text of each line
    let page = 0;

    // split one line of text into pieces of at most COLS characters
    function frames(text) {
        const out = [];
        let line = '';
        for (const word of text.split(' ').filter(Boolean)) {
            let w = word;
            while (w.length > COLS) {                         // a single word wider than the board
                if (line) { out.push(line); line = ''; }
                out.push(w.slice(0, COLS));
                w = w.slice(COLS);
            }
            if (!line) line = w;
            else if ((line + ' ' + w).length <= COLS) line += ' ' + w;
            else { out.push(line); line = w; }
        }
        if (line) out.push(line);
        return out.length ? out : [''];
    }

    function draw() {
        show(current.map((text) => {
            const f = frames(text);
            return f[page % f.length];                        // one-piece lines never change
        }));
    }

    function fmtTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h ? `${h}H ${m}M` : `${m}M`;
    }

    function render(b) {
        const pct = Math.round(b.level * 100);
        const full = b.charging && pct >= 100;
        const status = full ? 'FULL'
            : b.charging ? 'CHARG ING'
            : pct <= 20 ? 'LOW BATT'
            : 'ON BATT';

        let extra = '';
        if (b.charging && !full && isFinite(b.chargingTime) && b.chargingTime > 0) {
            extra = `FULL IN ${fmtTime(b.chargingTime)}`;
        } else if (!b.charging && isFinite(b.dischargingTime) && b.dischargingTime > 0) {
            extra = `${fmtTime(b.dischargingTime)} LEFT`;
        }
        current = [`${pct}%`, status, extra].filter(Boolean);
        draw();
    }

    function unsupported() {
        current = ['NO BATT', 'DATA AVAIL'];
        draw();
    }

    if (!('getBattery' in navigator)) {
        unsupported()
    } else {
        navigator.getBattery().then((battery) => {
            const update = () => render(battery);
            ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange']
                .forEach((type) => battery.addEventListener(type, update))
            update()
        }).catch(unsupported)
    }
    setInterval(() => { page++; draw(); }, PAGE_MS);

    const box = root.parentElement
    function fit() {
        const cs = getComputedStyle(box)
        const w = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
        const h = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
        const widthEm = COLS * 0.72 + (COLS - 1) * 0.05
        const heightEm = ROWS + (ROWS - 1) * 0.05
        root.style.fontSize = Math.min(w / widthEm, h / heightEm) + 'px'
    }
    new ResizeObserver(fit).observe(box)
    fit()
    
}