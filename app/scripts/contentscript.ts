import browser from "webextension-polyfill";
import "./contentscript.css";

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
  document.documentElement.style.setProperty(
    "--komado-player-width",
    `${playerWidth}px`
  );
  document.documentElement.style.setProperty(
    "--komado-player-height",
    `${playerHeight}px`
  );
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
