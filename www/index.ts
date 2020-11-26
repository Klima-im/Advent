const body = document.getElementsByTagName('body')[0];
const list = document.getElementsByTagName('ul')[0];

const resizeHandler = 
  () => 
    document.documentElement.style.setProperty(
        "--inner-screen-height",
        window.innerHeight + "px");

window.addEventListener('resize', resizeHandler);
resizeHandler();


let currentSwiping: null | "slider" | "overview" = null;

let currentXTranslate = 0;
const translateBy = (x: number, smooth: boolean) => {
  if (smooth) {
    list.style.transition = "transform 0.3s";
  } else {
    list.style.transition = "transform 0s ease 0s";
  }
  currentXTranslate =
    Math.min(list.getBoundingClientRect().width - 0.9 * screen.width, currentXTranslate + x);
  list.style.transform = "translate3d(-" + currentXTranslate + "px,0,0)";
};
let startX = 0;
let lastX = 0;
body.addEventListener(
  "touchstart",
  (event) => {
    if (currentSwiping === null) {
      currentSwiping = "slider";
      startX = event.touches[0].clientX;
      lastX = startX;
    }
  });
body.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault();
    if ( currentSwiping === "slider") {
      const currentX = event.touches[0].clientX;
      const distance = lastX - currentX;

      translateBy(distance, false);

      lastX = event.touches[0].clientX;
    }
  },
  {
    passive: false,
  });
body.addEventListener(
  "touchend",
  (event) => {
    event.preventDefault();
    if ( currentSwiping === "slider") {

      const elementWidth = 0.9 * screen.width;
      const remainder = currentXTranslate % elementWidth;

      let breakpoint = null;
      if (lastX < startX) {
        breakpoint = elementWidth / 6;
      } else {
        breakpoint = 5 * elementWidth / 6;
      }
      if (remainder < breakpoint) {
        translateBy(-remainder, true);
      } else {
        translateBy(elementWidth - remainder, true);
      }
      currentSwiping = null;
    }
}); 

const overview = document.getElementById("overview")!;
const zuckerstange = document.getElementById("zuckerstange")!;
let currentY = 0;
let currentYTranslate = 0;
let isUp = false;
for (const item of [overview, zuckerstange])
{
  item.addEventListener('touchstart', (event) => {
    if (currentSwiping === null) {
      const touch = event.touches[0];
      currentY = touch.screenY;
      overview.style.transition = "transform 0s";

      currentSwiping = "overview";
    }
  });

  item.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (currentSwiping === "overview") {
      const touch = event.touches[0];
      const distance = touch.screenY - currentY;
      currentYTranslate += distance;
      currentY += distance;
      overview.style.transform =
        "translate3d(0," + Math.max(currentYTranslate, -screen.height) + "px,0)";
    }
  });
  item.addEventListener('touchend', (event) => {
    if (currentSwiping === "overview") {
      overview.style.transition = "transform 0.3s";
      let threshold = screen.height / 5;
      if (isUp) {
        threshold = 4 * screen.height / 5;
      }
      if (Math.abs(currentYTranslate) > threshold) {
        overview.style.transform = "translate3d(0," + -screen.height + "px,0)";
        currentYTranslate = -screen.height;
        isUp = true;
      } else {
        overview.style.transform = "translate3d(0,0,0)";
        currentYTranslate = 0;
        isUp = false;
      }

      currentSwiping = null;
    }
  });
}
