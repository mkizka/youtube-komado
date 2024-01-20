import "./contentscript.css";

function logging(message: string) {
  if (process.env.NODE_ENV === "development") {
    console.debug(message);
  }
}

function needPositive(value: string, initialValue: number) {
  const parsed = parseInt(value);
  return parsed >= 0 ? parsed : initialValue;
}

function createCloseButton({ onClose }: { onClose: () => void }) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "x";
  button.classList.add("komado-close");
  button.addEventListener("click", onClose);
  return button;
}

function minimizePlayer(player: HTMLDivElement) {
  const closeButton = createCloseButton({
    onClose: () => resetPlayer(player, "closed"),
  });
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

async function setCSSVariables() {
  const storage = await chrome.storage.sync.get(["playerWidth"]);
  const playerWidth = needPositive(storage.playerWidth, 480);
  const playerHeight = (playerWidth * 9) / 16;
  document.documentElement.style.setProperty(
    "--komado-player-width",
    `${playerWidth}px`,
  );
  document.documentElement.style.setProperty(
    "--komado-player-height",
    `${playerHeight}px`,
  );
  logging(`yotube-komado: set player size to ${playerWidth}x${playerHeight}`);
}

function updatePlayerState() {
  if (location.pathname != "/watch") {
    return;
  }
  const player = document.querySelector<HTMLDivElement>("#movie_player")!;
  if (player.dataset.komadoState == "closed") {
    return;
  }
  const shouldMinimize =
    window.scrollY > player.parentElement!.offsetHeight * 0.75;
  if (shouldMinimize && player.dataset.komadoState != "minimized") {
    logging("yotube-komado: minimize");
    minimizePlayer(player);
  }
  if (!shouldMinimize && player.dataset.komadoState == "minimized") {
    logging("yotube-komado: reset");
    resetPlayer(player, "ready");
  }
}

async function main() {
  setCSSVariables();
  setInterval(() => {
    updatePlayerState();
  }, 100);
}

main();
