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

function minimizePlayer(player: HTMLDivElement) {
  const closeButton = createCloseButton(() => resetPlayer(player, "closed"));
  player.insertAdjacentElement("beforeend", closeButton);
  player.dataset.komadoState = "minimized";
}

function resetPlayer(player: HTMLDivElement, newState: string) {
  document
    .querySelectorAll(".komado-close")
    .forEach((button) => button.remove());
  player.dataset.komadoState = newState;
  window.dispatchEvent(new CustomEvent("resize"));
}

async function main() {
  const storage = await chrome.storage.sync.get(["playerWidth"]);
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
    if (player == null) return;
    const shouldMinimize =
      window.pageYOffset > player.parentElement!.offsetHeight * 0.75;
    if (
      shouldMinimize &&
      player.dataset.komadoState == "ready" &&
      location.pathname == "/watch" // ミニプレーヤー時は作用しない
    ) {
      minimizePlayer(player);
    }
    if (!shouldMinimize) {
      resetPlayer(player, "ready");
    }
  }, 100);
}

main();
