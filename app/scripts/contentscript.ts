const miniWidth = 480;
const miniHeight = 270;

function insertStyle(css: string) {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = css;
  document.head.appendChild(style);
}

function main() {
  setInterval(() => {
    const player = document.querySelector<HTMLDivElement>("#movie_player")!;
    const minimized = player.classList.contains("komado-minimize");
    const shouldMinimize =
      window.pageYOffset > player.parentElement.offsetHeight * 0.75;
    if (!minimized && shouldMinimize) {
      player.classList.add("komado-minimize");
    }
    if (minimized && !shouldMinimize) {
      player.classList.remove("komado-minimize");
    }
    window.dispatchEvent(new Event("resize"));
  }, 100);
}

insertStyle(`
  .komado-minimize {
    position: fixed !important;
    right: 20px !important;
    bottom: 20px !important;
    height: ${miniHeight}px !important;
    width: ${miniWidth}px !important;
    z-index: 10000 !important;
  }
  .komado-minimize video {
    height: ${miniHeight}px !important;
    width: ${miniWidth}px !important;
  }
  .komado-minimize .ytp-right-controls {
    display:none !important;
  }
`);
main();
