/* eslint-disable @typescript-eslint/use-unknown-in-catch-callback-variable */
/* eslint-disable no-console */
import "./contentscript.css";

function logging(...args: Parameters<typeof console.debug>) {
  if (process.env.NODE_ENV === "development") {
    console.debug(...args);
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
  const playerWidth = needPositive(storage.playerWidth as string, 480);
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

function canMinimize(player: HTMLDivElement) {
  return [undefined, "ready"].includes(player.dataset.komadoState);
}

function canReset(player: HTMLDivElement) {
  return ["minimized", "closed"].includes(player.dataset.komadoState!);
}

function updatePlayerState() {
  if (location.pathname !== "/watch") {
    return;
  }
  const player = document.querySelector<HTMLDivElement>("#movie_player")!;
  const shouldMinimize =
    window.scrollY > player.parentElement!.offsetHeight * 0.75;
  if (shouldMinimize && canMinimize(player)) {
    logging("yotube-komado: minimize");
    minimizePlayer(player);
  }
  if (!shouldMinimize && canReset(player)) {
    logging("yotube-komado: reset");
    resetPlayer(player, "ready");
  }
}

async function main() {
  await setCSSVariables();
  setInterval(() => {
    updatePlayerState();
  }, 100);
}

main().catch(console.error);
