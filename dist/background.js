//!CONFIG image (file)
//
//!CONFIG player-container-bbox (json) { "top": 175, "left": 128, "width": 680, "height": 368 }
const styleEl = document.createElement("style");
document.head.append(styleEl);
styleEl.innerHTML = `
  #player {
  }
  #player-container {
    position: absolute;
  }
`;
// new container for the player
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
    playerInBGSpace = {
        ...playerInBGSpace,
        ...FIELD(CONFIG, "player-container-bbox", "json"),
    };
    const imageId = FIELD(CONFIG, "image", "file");
    const imageURL = PLAYBACK.getFileObjectURL(imageId);
    backgroundImage.src = imageURL;
    Object.assign(document.body.style, {
        backgroundImage: `url(${imageURL})`,
        backgroundColor: "white",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
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
    Object.assign(playerContainer.style, {
        top: bgTop + ratio * playerInBGSpace.top,
        left: bgLeft + ratio * playerInBGSpace.left,
        width: ratio * playerInBGSpace.width,
        height: ratio * playerInBGSpace.height,
    });
}
