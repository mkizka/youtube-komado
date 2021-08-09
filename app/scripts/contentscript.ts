const miniWidth = 480;
const miniHeight = 270;

function insertStyle(css: string) {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = css;
  document.head.appendChild(style);
}

function main() {
  let isActive = false;
  console.info("komado:読み込み開始");
  setInterval(() => {
    const player = document.querySelector<HTMLDivElement>("#movie_player")!;
    const shouldMinimize =
      window.pageYOffset > player.parentElement.offsetHeight * 0.75;
    if (!isActive && shouldMinimize) {
      console.info("komado:小窓化");
      player.classList.add("komado-minimize");
      isActive = true;
    }
    if (isActive && !shouldMinimize) {
      console.info("komado:小窓解除");
      player.classList.remove("komado-minimize");
      isActive = false;
    }
    window.dispatchEvent(new Event("resize"));
  }, 100);
}

insertStyle(`
  .komado-minimize {
    position: fixed !important;
    right: 20px;
    bottom: 20px;
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
