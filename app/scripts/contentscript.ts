import browser from "webextension-polyfill";

function insertStyle(css: string) {
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent = css;
  document.head.appendChild(style);
}

async function main() {
  const { width = 480, height = 270 } = await browser.storage.sync.get([
    "width",
    "height",
  ]);
  insertStyle(`
  .komado-minimize {
    position: fixed !important;
    right: 20px !important;
    bottom: 20px !important;
    height: ${height}px !important;
    width: ${width}px !important;
    z-index: 10000 !important;
  }
  .komado-minimize video {
    height: ${height}px !important;
    width: ${width}px !important;
  }
  .komado-minimize .ytp-right-controls {
    display:none !important;
  }
  `);
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

main();