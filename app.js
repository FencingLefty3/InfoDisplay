import { gradiantScript, infoScript, plainScript } from './scripts.js';

const currentFace = 'info';
const horizontalScroller = document.body;
const verticalScroller = document.getElementById('singleContainer');
const paneScrollers = Array.from(document.querySelectorAll('.containerC'));
const savedHorizontalPosition = Number(localStorage.getItem('faceScrollX'));
const savedVerticalPosition = Number(localStorage.getItem('faceScrollY'));
const savedPanePages = paneScrollers.map((_, index) =>
  Number(localStorage.getItem(`doublePanePage${index}`))
);
const scrollers = [horizontalScroller, verticalScroller, ...paneScrollers];

let saveScheduled = false;
let scrollUiTimeout;
function saveFacePosition() {
  localStorage.setItem('faceScrollX', horizontalScroller.scrollLeft);
  localStorage.setItem('faceScrollY', verticalScroller.scrollTop);
  paneScrollers.forEach((scroller, index) => {
    localStorage.setItem(
      `doublePanePage${index}`,
      Math.round(scroller.scrollTop / scroller.clientHeight)
    );
  });
}

function schedulePositionSave() {
  if (saveScheduled) return;
  saveScheduled = true;
  requestAnimationFrame(() => {
    saveScheduled = false;
    saveFacePosition();
  });
}

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

scrollers.forEach((scroller) => {
  scroller.addEventListener('scroll', () => {
    schedulePositionSave();
    showScrollUi(scroller);
    updatePaneDots(scroller);
  });
});

function updatePaneDots(scroller) {
  const pages = Array.from(scroller.children).filter((child) =>
    child.matches('.containerB, .containerD, #board')
  );
  const dots = Array.from(scroller.children).find((child) =>
    child.matches('.snapDots')
  );
  if (!dots || pages.length === 0) return;

  const currentPage = Math.min(
    pages.length - 1,
    Math.round(scroller.scrollTop / scroller.clientHeight)
  );

  Array.from(dots.querySelectorAll('button')).forEach((button, index) => {
    if (index === currentPage) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

scrollers.slice(1).forEach((scroller) => {
  const dots = Array.from(scroller.children).find((child) =>
    child.matches('.snapDots')
  );
  if (!dots) return;

  dots.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const pages = Array.from(scroller.children).filter((child) =>
      child.matches('.containerB, .containerD, #board')
    );
    const index = Array.from(dots.querySelectorAll('button')).indexOf(button);
    if (index < 0 || !pages[index]) return;

    scroller.scrollTo({
      top: pages[index].offsetTop,
      behavior: 'smooth',
    });
  });
  updatePaneDots(scroller);
});

function showHoveredScrollUi(event) {
  const activeScroller = event.target.closest('.containerC, #singleContainer') || horizontalScroller;
  showScrollUi(activeScroller);
}
window.addEventListener('pointermove', showHoveredScrollUi);
window.addEventListener('pointerdown', showHoveredScrollUi);
window.addEventListener('touchstart', showHoveredScrollUi);
window.addEventListener('wheel', showHoveredScrollUi, { passive: true });
window.addEventListener('keydown', showHoveredScrollUi);
window.addEventListener('pagehide', saveFacePosition);

gradiantScript();
infoScript();
plainScript();

requestAnimationFrame(() => {
  if (Number.isFinite(savedHorizontalPosition)) {
    horizontalScroller.scrollLeft = savedHorizontalPosition;
  }
  if (Number.isFinite(savedVerticalPosition)) {
    verticalScroller.scrollTop = savedVerticalPosition;
  }
  paneScrollers.forEach((scroller, index) => {
    const savedPage = savedPanePages[index];
    if (!Number.isFinite(savedPage)) return;

    const pages = Array.from(scroller.children).filter((child) =>
      child.matches('.containerD')
    );
    const page = pages[Math.min(Math.max(savedPage, 0), pages.length - 1)];
    if (page) scroller.scrollTop = page.offsetTop;
    updatePaneDots(scroller);
  });
});
