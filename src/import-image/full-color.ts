import { getBooleanConfig } from "../all-utils";

//! CODE_ALL_TYPES

let useFullColor = getBooleanConfig("use-full-color");
let hideColorTools = useFullColor && getBooleanConfig("hide-color-tools");

//! CODE_EDITOR

// Listen to config changes
wrap.after(BipsiEditor.prototype, "refreshEditorPluginConfig", (config: BipsiDataEvent) => {
  if (CONFIG === config) {
    // Refresh local variables
    useFullColor = getBooleanConfig("use-full-color");
    hideColorTools = useFullColor && getBooleanConfig("hide-color-tools");
    // Enable/disable color tools
    updateColorTools();
  }
});

// Make a disablable version of recolorMask.
// We don't disable it globally because it's still needed by DialoguePlayback
let disableRecolorMask = false;
wrap.splice(window, "recolorMask", function recolorMask(original, mask, style, destination) {
  if (disableRecolorMask) {
    return mask;
  }
  return original(mask, style, destination);
});

// Make a forceable version of BipsiEditor.getSelections to return fake bg & fg
let forceSelections = false;
wrap.splice(BipsiEditor.prototype, "getSelections", function (original, ...args) {
  const selections = original.apply(this, args);
  if (forceSelections) {
    selections.bg = "#000000";
    selections.fg = "#ffffff";
  }
  return selections;
});

// Disable recolorMask while executing redrawTileBrowser.
wrap.splice(BipsiEditor.prototype, "redrawTileBrowser", async function (original, ...args) {
  // This is called before the change has reached refreshEditorPluginConfig so we need to get the value ourselves…
  disableRecolorMask = getBooleanConfig("use-full-color");
  await original.apply(this, args);
  disableRecolorMask = false;
});

// Disable recolorMask while executing redraw. Also force bg & fg to hit the correct code paths.
wrap.splice(TileEditor.prototype, "redraw", function (original) {
  disableRecolorMask = forceSelections = useFullColor;
  original.apply(this);
  disableRecolorMask = forceSelections = false;
});

function updateColorTools() {
  // @ts-ignore
  ONE("#tile-paint-row").style = useFullColor
    ? "pointer-events: none; cursor: not-allowed; opacity: .75"
    : "";

  ONE("[name=room-paint-tool][value=color]").parentElement!.hidden = hideColorTools;
  ONE("[name=show-palette-window]").parentElement!.hidden = hideColorTools;
  ONE("[name=show-color-window]").parentElement!.hidden = hideColorTools;
}

const hiddenColorsPalette = {
  id: -1,
  colors: [
    "transparent",
    "#000000",
    "#AAAAAA",
    "#FF00FF",
    "#000000",
    "#000000",
    "#000000",
    "#000000",
  ],
};

// Draw room thumbnail with a special palette.
wrap.splice(window, "drawRoomThumbnail", function (original, rendering, palette, room) {
  original(rendering, hideColorTools ? hiddenColorsPalette : palette, room);
});

//! CODE_ALL_TYPES

wrap.replace(window, "drawRecolorLayer", function (destination, render) {
  fillRendering2D(BACKG_PAGE);
  fillRendering2D(COLOR_PAGE);
  fillRendering2D(TILES_PAGE);

  render(BACKG_PAGE, COLOR_PAGE, TILES_PAGE);

  if (getBooleanConfig("use-full-color")) {
    destination.drawImage(TILES_PAGE.canvas, 0, 0);
  } else {
    BACKG_PAGE.globalCompositeOperation = "destination-out";
    BACKG_PAGE.drawImage(TILES_PAGE.canvas, 0, 0);
    BACKG_PAGE.globalCompositeOperation = "source-over";

    COLOR_PAGE.globalCompositeOperation = "destination-in";
    COLOR_PAGE.drawImage(TILES_PAGE.canvas, 0, 0);
    COLOR_PAGE.globalCompositeOperation = "source-over";

    destination.drawImage(BACKG_PAGE.canvas, 0, 0);
    destination.drawImage(COLOR_PAGE.canvas, 0, 0);
  }
});

wrap.replace(window, "drawRecolorLayerDynamic", function (destination, render) {
  const { width, height } = destination.canvas;
  resizeRendering2D(BACKG_PAGE_D, width, height);
  resizeRendering2D(COLOR_PAGE_D, width, height);
  resizeRendering2D(TILES_PAGE_D, width, height);

  fillRendering2D(BACKG_PAGE_D);
  fillRendering2D(COLOR_PAGE_D);
  fillRendering2D(TILES_PAGE_D);

  render(BACKG_PAGE_D, COLOR_PAGE_D, TILES_PAGE_D);

  if (getBooleanConfig("use-full-color")) {
    destination.drawImage(TILES_PAGE_D.canvas, 0, 0);
  } else {
    BACKG_PAGE_D.globalCompositeOperation = "destination-out";
    BACKG_PAGE_D.drawImage(TILES_PAGE_D.canvas, 0, 0);
    BACKG_PAGE_D.globalCompositeOperation = "source-over";

    COLOR_PAGE_D.globalCompositeOperation = "destination-in";
    COLOR_PAGE_D.drawImage(TILES_PAGE_D.canvas, 0, 0);
    COLOR_PAGE_D.globalCompositeOperation = "source-over";

    destination.drawImage(BACKG_PAGE_D.canvas, 0, 0);
    destination.drawImage(COLOR_PAGE_D.canvas, 0, 0);
  }
});
