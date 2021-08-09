(function () {
  let isActive = false;
  console.info("komado:読み込み開始");
  setInterval(() => {
    const player = document.querySelector("#movie_player");
    const video = player.querySelector("video");
    const rightControls = player.querySelector(".ytp-right-controls");
    const miniWidth = 480;
    const miniHeight = 270;
    const shouldMinimize =
      window.pageYOffset > player.parentElement.offsetHeight * 0.75;
    if (!isActive && shouldMinimize) {
      console.info("komado:小窓化");
      player.style = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        height: ${miniHeight}px;
        width: ${miniWidth}px;
        z-index: 10000;
      `;
      video.style = `
        width: ${miniWidth}px;
        height: ${miniHeight}px;
      `;
      rightControls.style.display = "none";
      isActive = true;
    }
    if (isActive && !shouldMinimize) {
      console.info("komado:小窓解除");
      player.style = "";
      video.style = `
        width: ${player.offsetWidth}px;
        height: ${player.offsetHeight}px;
      `;
      rightControls.style.display = "block";
      isActive = false;
    }
    window.dispatchEvent(new Event("resize"));
  }, 100);
})();
