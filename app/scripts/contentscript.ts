import browser from "webextension-polyfill";

function insertStyle(css: string) {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = css;
  document.head.appendChild(style);
}

function needPositive(value: string, initialValue: number) {
  const parsed = parseInt(value);
  return parsed >= 0 ? parsed : initialValue;
}

function createCloseButton(onClose: () => void) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "x";
  button.classList.add("komado-close");
  button.addEventListener("click", onClose);
  return button;
}

async function main() {
  const storage = await browser.storage.sync.get(["playerWidth"]);
  const playerWidth = needPositive(storage.playerWidth, 480);
  const playerHeight = (playerWidth * 9) / 16;
  insertStyle(`
  [data-komado-state="minimized"] {
    overflow: initial !important;
    position: fixed !important;
    right: 20px !important;
    bottom: 20px !important;
    height: ${playerHeight}px !important;
    width: ${playerWidth}px !important;
    z-index: 10000 !important;
  }
  [data-komado-state="minimized"] video {
    height: ${playerHeight}px !important;
    width: ${playerWidth}px !important;
  }
  [data-komado-state="minimized"] .ytp-right-controls {
    display:none !important;
  }
  [data-komado-state="minimized"] .komado-close {
    display: block;
    position: relative;
    top: -2rem;
    margin-left: auto;
  }
  `);
  setInterval(() => {
    const player = document.querySelector<HTMLDivElement>("#movie_player");
    const closeButton = createCloseButton(() => {
      player.dataset.komadoState = "closed";
    });
    if (player == null) return;
    const shouldMinimize =
      window.pageYOffset > player.parentElement.offsetHeight * 0.75;
    if (shouldMinimize && player.dataset.komadoState == "ready") {
      player.insertAdjacentElement("beforeend", closeButton);
      player.dataset.komadoState = "minimized";
    }
    if (!shouldMinimize) {
      if (player.dataset.komadoState == "minimized") {
        closeButton.remove();
      }
      player.dataset.komadoState = "ready";
    }
    window.dispatchEvent(new Event("resize"));
  }, 100);
}

main();
