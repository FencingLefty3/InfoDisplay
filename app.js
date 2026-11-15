import { gradiantScript, infoScript, plainScript, dateScript, eventScript, phaseScript, worldClockScript } from './scripts.js';


function setupChrome() {
  const settingsDialog = document.getElementById('settingsDialog');
  const hiddenItem = document.getElementById('hiddenButtons');
  const settingsButton = document.getElementById('settingsBtn');
  const gradientFace = document.getElementById('gradient');

  function isGradientFaceActive() {
    const paneBounds = verticalScroller.getBoundingClientRect();
    const gradientPage = pagesOf(verticalScroller).indexOf(gradientFace);
    return Math.abs(paneBounds.left) < window.innerWidth * 0.01 &&
      gradientPage >= 0 &&
      currentPageOf(verticalScroller) === gradientPage;
  }

  function updateSettingsVisibility() {
    const active = isGradientFaceActive();
    settingsButton?.classList.toggle('face-hidden', !active);
    if (!active && settingsDialog?.open) settingsDialog.close();
  }

  settingsButton?.addEventListener('click', (event) => {
    if (!isGradientFaceActive()) {
      event.preventDefault();
      return;
    }
    if (!settingsDialog.open) settingsDialog.showModal();
  });
  document.getElementById('fullscreen')?.addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });
  settingsDialog?.addEventListener('click', (event) => {
    if (event.target === settingsDialog) settingsDialog.close();
  });

  let idleTimeout;
  const wake = () => {
    hiddenItem?.classList.remove('hidden');
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => hiddenItem?.classList.add('hidden'), 3000);
  };
  ['mousemove', 'pointerdown', 'touchstart'].forEach((type) => window.addEventListener(type, wake));
  wake();
  verticalScroller.addEventListener('scroll', updateSettingsVisibility);
  horizontalEvents.addEventListener('scroll', updateSettingsVisibility);
  window.addEventListener('resize', updateSettingsVisibility);
  updateSettingsVisibility();
}


const pageScrolls = getComputedStyle(document.documentElement).overflowX === 'visible';
const horizontalScroller = pageScrolls ? document.scrollingElement : document.body;
const horizontalEvents = pageScrolls ? window : document.body;
const verticalScroller = document.getElementById('singleContainer');
const paneScrollers = Array.from(document.querySelectorAll('.containerC'));
const scrollers = [horizontalScroller, verticalScroller, ...paneScrollers];

const pagesOf = (scroller) =>
  Array.from(scroller.children).filter((child) => child.matches('.containerB, .containerD, #board'));
const dotsOf = (scroller) =>
  Array.from(scroller.children).find((child) => child.matches('.snapDots'));
const currentPageOf = (scroller) => {
  const pages = pagesOf(scroller);
  if (!pages.length || !scroller.clientHeight) return 0;
  return Math.min(pages.length - 1, Math.round(scroller.scrollTop / scroller.clientHeight));
};


const savedHorizontalPosition = Number(localStorage.getItem('faceScrollX'));
const savedVerticalPosition = Number(localStorage.getItem('faceScrollY'));
const savedPanePages = paneScrollers.map((_, index) =>
  Number(localStorage.getItem(`doublePanePage${index}`))
);

function saveFacePosition() {
  localStorage.setItem('faceScrollX', horizontalScroller.scrollLeft);
  localStorage.setItem('faceScrollY', verticalScroller.scrollTop);
  paneScrollers.forEach((scroller, index) => {
    localStorage.setItem(`doublePanePage${index}`, currentPageOf(scroller));
  });
}

let saveScheduled = false;
function schedulePositionSave() {
  if (saveScheduled) return;
  saveScheduled = true;
  requestAnimationFrame(() => {
    saveScheduled = false;
    saveFacePosition();
  });
}


let scrollUiTimeout;
function showScrollUi(activeScroller) {
  scrollers.forEach((scroller) => {
    scroller.classList.toggle(
      'scroll-active',
      scroller === horizontalScroller || scroller === activeScroller
    );
  });
  clearTimeout(scrollUiTimeout);
  scrollUiTimeout = setTimeout(() => {
    scrollers.forEach((scroller) => scroller.classList.remove('scroll-active'));
  }, 3000);
}

function updatePaneDots(scroller) {
  const dots = dotsOf(scroller);
  if (!dots || pagesOf(scroller).length === 0) return;
  const currentPage = currentPageOf(scroller);
  Array.from(dots.querySelectorAll('button')).forEach((button, index) => {
    if (index === currentPage) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

horizontalEvents.addEventListener('scroll', () => {
  schedulePositionSave();
  showScrollUi(horizontalScroller);
});
scrollers.slice(1).forEach((scroller) => {
  scroller.addEventListener('scroll', () => {
    schedulePositionSave();
    showScrollUi(scroller);
    updatePaneDots(scroller);
  });
});


scrollers.slice(1).forEach((scroller) => {
  const dots = dotsOf(scroller);
  if (!dots) return;

  dots.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const index = Array.from(dots.querySelectorAll('button')).indexOf(button);
    const page = pagesOf(scroller)[index];
    if (page) scroller.scrollTo({ top: page.offsetTop, behavior: 'smooth' });
  });
  updatePaneDots(scroller);
});

function showHoveredScrollUi(event) {
  const activeScroller = event.target.closest?.('.containerC, #singleContainer') || horizontalScroller;
  showScrollUi(activeScroller);
}
window.addEventListener('pointermove', showHoveredScrollUi);
window.addEventListener('pointerdown', showHoveredScrollUi);
window.addEventListener('touchstart', showHoveredScrollUi);
window.addEventListener('wheel', showHoveredScrollUi, { passive: true });
window.addEventListener('keydown', showHoveredScrollUi);


window.addEventListener('pagehide', saveFacePosition);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveFacePosition();
});


setupChrome();


[gradiantScript, infoScript, plainScript, dateScript, phaseScript, eventScript, worldClockScript].forEach((init) => {
  try {
    init();
  } catch (error) {
    console.error(`${init.name} failed to start`, error);
  }
});


requestAnimationFrame(() => {
  if (Number.isFinite(savedHorizontalPosition)) {
    horizontalScroller.scrollLeft = savedHorizontalPosition;
  }
  if (Number.isFinite(savedVerticalPosition)) {
    verticalScroller.scrollTop = savedVerticalPosition;
  }
  paneScrollers.forEach((scroller, index) => {
    const pages = pagesOf(scroller);
    const savedPage = savedPanePages[index];
    if (!pages.length || !Number.isFinite(savedPage)) return;
    const page = pages[Math.min(Math.max(savedPage, 0), pages.length - 1)];
    scroller.scrollTop = page.offsetTop;
    updatePaneDots(scroller);
  });
});