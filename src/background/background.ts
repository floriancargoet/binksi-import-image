/*
//!CONFIG image (file)
//
//!CONFIG body-style (json) { "backgroundColor": "black" }
//
//!CONFIG player-container-bbox (json) { "top": 0, "left": 0, "width": 100, "height": 100 }
*/

Object.assign(document.body.style, FIELD(CONFIG, "body-style", "json"));

const styleEl = document.createElement("style");
document.head.append(styleEl);
styleEl.innerHTML = `
  #background-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    inset: 0;
    margin: auto;
    --ratio: 1;
    // aspect-ratio trick
    width: 100vw;
    height: calc(100vw / var(--ratio));
    max-height: 100vh;
    max-width: calc(100vh * var(--ratio));
  }
  #background-container img {
    width: 100%;
    height: 100%;
  }
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

// Container for the background
// We use a container with an computed aspect-ratio so that we can have extra stuff aligned to the background (like subtitles)
const backgroundContainer = document.createElement("div");
backgroundContainer.id = "background-container";
document.body.append(backgroundContainer);

const backgroundImage = new Image();
backgroundContainer.append(backgroundImage);

// Container for the player
const playerContainer = document.createElement("div");
playerContainer.id = "player-container";
backgroundContainer.append(playerContainer);
// Move the player there
playerContainer.append(document.getElementById("player")!);

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
    document.getElementById("player")!.append(glazyCanvas);
  }
  playerInBGSpace = {
    ...playerInBGSpace,
    ...FIELD(CONFIG, "player-container-bbox", "json"),
  };
  const imageId = FIELD(CONFIG, "image", "file");
  backgroundImage.src = PLAYBACK.getFileObjectURL(imageId);

  window.addEventListener("resize", positionContainer);
  backgroundImage.addEventListener("load", positionContainer);
  positionContainer();
});

function positionContainer() {
  // Find the background ratio
  const { naturalWidth, naturalHeight } = backgroundImage;
  // Apply aspect-ratio to container
  backgroundContainer.style.setProperty(
    "--ratio",
    String(naturalWidth / naturalHeight)
  );
  // Apply scale to bbox
  const { clientWidth, clientHeight } = backgroundContainer;
  const bgScale = Math.min(
    clientWidth / naturalWidth,
    clientHeight / naturalHeight
  );
  const containerTop = Math.round(bgScale * playerInBGSpace.top);
  const containerLeft = Math.round(bgScale * playerInBGSpace.left);
  const containerWidth = Math.round(bgScale * playerInBGSpace.width);
  const containerHeight = Math.round(bgScale * playerInBGSpace.height);
  Object.assign(playerContainer.style, {
    top: containerTop + "px",
    left: containerLeft + "px",
    width: containerWidth + "px",
    height: containerHeight + "px",
  });

  // Scale the player to fit the bbox (the deformation is by choice)
  const playerCanvas = document.getElementById(
    "player-canvas"
  ) as HTMLCanvasElement;
  const player = document.getElementById("player")!;
  const scaleX = containerWidth / playerCanvas.width;
  const scaleY = containerHeight / playerCanvas.height;
  player.style.setProperty("--player-scale-x", String(scaleX));
  player.style.setProperty("--player-scale-y", String(scaleY));
}
