/*
//!CONFIG image (file)
//
//!CONFIG body-style (json) { "backgroundColor": "black", "backgroundSize": "contain", "backgroundRepeat": "no-repeat", "backgroundPosition": "center center" }
//
//!CONFIG player-container-bbox (json) { "top": 0, "left": 0, "width": 100, "height": 100 }
*/
const styleEl = document.createElement("style");
document.head.append(styleEl);
styleEl.innerHTML = `
  #player-container {
    position: absolute;
  }

  /* Only enable crisp-edges on the #player */
  * {
    image-rendering: auto;
  }
  #player {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-crisp-edges;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    /* Cancel bipsi's original positionning */
    top: 0px;
    left: 0px;
    transform-origin: top left;
    --player-scale-x: 1;
    --player-scale-y: 1;
    transform: scale(var(--player-scale-x), var(--player-scale-y)) !important;
  }
  /* WebGlazy overrides */
  #canvasContainer {
    position: absolute;
    /* this element will be moved inside the #player to inherit its transformation */
  }
`;
// New container for the player
const playerContainer = document.createElement("div");
playerContainer.id = "player-container";
document.body.append(playerContainer);
playerContainer.append(document.getElementById("player"));
let backgroundImage = new Image();
let playerInBGSpace = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
};
wrap.after(window, "start", () => {
    // Move WebGlazy if it exists
    const glazyCanvas = ONE("#canvasContainer");
    if (glazyCanvas) {
        document.getElementById("player").append(glazyCanvas);
    }
    playerInBGSpace = {
        ...playerInBGSpace,
        ...FIELD(CONFIG, "player-container-bbox", "json"),
    };
    const imageId = FIELD(CONFIG, "image", "file");
    const imageURL = PLAYBACK.getFileObjectURL(imageId);
    backgroundImage.src = imageURL;
    Object.assign(document.body.style, {
        backgroundImage: `url(${imageURL})`,
        ...FIELD(CONFIG, "body-style", "json"),
    });
    window.addEventListener("resize", positionContainer);
    backgroundImage.addEventListener("load", positionContainer);
    positionContainer();
});
function positionContainer() {
    // Find the background ratio & bounding box
    const { width, height } = backgroundImage;
    const { clientWidth, clientHeight } = document.body;
    const ratio = Math.min(clientWidth / width, clientHeight / height);
    const bgLeft = (clientWidth - ratio * width) / 2;
    const bgTop = (clientHeight - ratio * height) / 2;
    const containerTop = Math.round(bgTop + ratio * playerInBGSpace.top);
    const containerLeft = Math.round(bgLeft + ratio * playerInBGSpace.left);
    const containerWidth = Math.round(ratio * playerInBGSpace.width);
    const containerHeight = Math.round(ratio * playerInBGSpace.height);
    Object.assign(playerContainer.style, {
        top: containerTop + "px",
        left: containerLeft + "px",
        width: containerWidth + "px",
        height: containerHeight + "px",
    });
    // Scale the player (the deformation is by choice)
    const playerCanvas = document.getElementById("player-canvas");
    const player = document.getElementById("player");
    const scaleX = containerWidth / playerCanvas.width;
    const scaleY = containerHeight / playerCanvas.height;
    player.style.setProperty("--player-scale-x", String(scaleX));
    player.style.setProperty("--player-scale-y", String(scaleY));
}
