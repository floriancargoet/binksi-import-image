//! CODE_EDITOR
//! CODE_EDITOR
function U32ColorToRGBA(n) {
    const u32a = new Uint32Array([n]);
    const u8a = new Uint8ClampedArray(u32a.buffer);
    return Array.from(u8a);
}
function U32ColorToHex(n) {
    const [r, g, b] = U32ColorToRGBA(n);
    const h = ("000000" + (r * 256 * 256 + g * 256 + b).toString(16)).slice(-6);
    return "#" + h;
}
function autoCloseToggledWindow(windowElement, toggle) {
    window.addEventListener("click", (event) => {
        const target = event.target;
        const ignore = windowElement.hidden ||
            !event.isTrusted ||
            windowElement.contains(target) ||
            toggle.inputs.includes(target);
        if (ignore)
            return;
        toggle.checked = false;
    });
}
function createToggleWindow({ windowId, toggleId, inputName, inputTitle, toggleContent, windowContent, }) {
    const windowEl = document.createElement("div");
    windowEl.id = windowId;
    windowEl.className = "popup-window";
    windowEl.hidden = true;
    windowEl.innerHTML = windowContent;
    const toggleButtonEl = document.createElement("label");
    toggleButtonEl.id = toggleId;
    toggleButtonEl.className = "toggle picker-toggle";
    toggleButtonEl.hidden = true;
    toggleButtonEl.innerHTML = `
      <input type="checkbox" name="${inputName}" title="${inputTitle}">
      ${toggleContent}
    `;
    // bipsi's ui.toggle requires the element to be in the DOM
    // so we directly use the CheckboxWrapper
    const toggle = new CheckboxWrapper(ALL(`[name="${inputName}"]`, toggleButtonEl));
    toggle?.addEventListener("change", () => {
        windowEl.hidden = !toggle.checked;
    });
    autoCloseToggledWindow(windowEl, toggle);
    return {
        window: windowEl,
        button: toggleButtonEl,
        toggle,
    };
}
function getBooleanConfig(name, defaultValue = false) {
    const value = FIELD(CONFIG, name, "json");
    if (typeof value !== "boolean")
        return defaultValue;
    return value;
}
function setBooleanConfig(name, value) {
    // We want a sync change so we rewrite makeChange
    EDITOR.stateManager.makeCheckpoint();
    const pluginEvent = findEventById(EDITOR.stateManager.present, CONFIG.id);
    replaceFields(pluginEvent, name, "json", value);
    EDITOR.stateManager.changed();
}

//! CODE_EDITOR
let useFullColor = getBooleanConfig("use-full-color");
let hideColorTools = useFullColor && getBooleanConfig("hide-color-tools");
// Listen to config changes
wrap.after(BipsiEditor.prototype, "refreshEditorPluginConfig", (config) => {
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
    ONE("[name=room-paint-tool][value=color]").parentElement.hidden = hideColorTools;
    ONE("[name=show-palette-window]").parentElement.hidden = hideColorTools;
    ONE("[name=show-color-window]").parentElement.hidden = hideColorTools;
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
    }
    else {
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
    }
    else {
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

class ImportedMap {
    constructor(img) {
        this.tileIndex = 1;
        this.tiles = {};
        this.rooms = [];
        this.mapColors = new Set();
        this.createTilesFromMapImage(img);
    }
    get transparentColor() {
        const [first] = this.mapColors;
        return first; // There's always as least one color
    }
    createTilesFromMapImage(img) {
        // Check the dimensions match a whole number of rooms.
        const roomSize = 16 * TILE_PX;
        if (img.height % roomSize !== 0 || img.width % roomSize !== 0) {
            throw new Error(`The dimensions of the map must be a multiple of ${roomSize}.`);
        }
        // Create rooms and tiles.
        const roomCols = img.width / roomSize;
        const roomRows = img.height / roomSize;
        // Canvas so we can read pixels for color detection.
        const tileCanvas = document.createElement("canvas");
        tileCanvas.width = TILE_PX;
        tileCanvas.height = TILE_PX;
        const tileCtx = tileCanvas.getContext("2d", { willReadFrequently: true }); // optimisation
        tileCtx.imageSmoothingEnabled = false;
        for (let row = 0; row < roomRows; row++) {
            for (let col = 0; col < roomCols; col++) {
                const room = [];
                this.rooms.push(room);
                // Iterate over tiles in room
                for (let yRoom = 0; yRoom < 16; yRoom++) {
                    const roomLine = [];
                    room.push(roomLine);
                    for (let xRoom = 0; xRoom < 16; xRoom++) {
                        const yMap = row * 16 + yRoom;
                        const xMap = col * 16 + xRoom;
                        fillRendering2D(tileCtx);
                        tileCtx.drawImage(img, xMap * TILE_PX, yMap * TILE_PX, TILE_PX, TILE_PX, 0, 0, TILE_PX, TILE_PX);
                        const tile = this.getOrCreateTile(tileCtx);
                        roomLine.push(tile);
                    }
                }
            }
        }
        if (this.mapColors.size > 7) {
            // FIXME: excluding transparency
            throw new Error("A map can have at most 7 colors.");
        }
    }
    getOrCreateTile(ctx) {
        var _a;
        const imageData = ctx.getImageData(0, 0, TILE_PX, TILE_PX);
        const uid = ctx.canvas.toDataURL("image/png");
        return ((_a = this.tiles)[uid] ?? (_a[uid] = this.createTile(uid, imageData)));
    }
    createTile(uid, imageData) {
        const d = new Uint32Array(imageData.data.buffer); // endianness dependant!
        const colors = new Set();
        // const counts = {};
        for (let i = 0; i < d.length; i++) {
            const color = d[i];
            colors.add(color);
            // counts[color] ??= 0;
            // counts[color]++;
        }
        if (colors.size > 2) {
            throw new Error("A tile can have at most 2 colors.");
        }
        for (const c of colors) {
            this.mapColors.add(c);
        }
        return {
            uid,
            index: this.tileIndex++,
            imageData,
            colors: [...colors],
        };
    }
    async drawTileset(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let x = 0, y = 0;
        for (const tile of Object.values(this.tiles)) {
            ctx.putImageData(tile.imageData, x, y);
            x += TILE_PX;
            if (x === 16 * TILE_PX) {
                x = 0;
                y += TILE_PX;
            }
        }
        // Ensure the tileset is white/transparent
        const transparentColor = this.transparentColor;
        withPixels(ctx, (pixels) => {
            for (let i = 0; i < pixels.length; i++) {
                if (pixels[i] === transparentColor) {
                    pixels[i] = 0;
                }
                else {
                    pixels[i] = 0xffffffff;
                }
            }
        });
    }
}
const defaultOptions = {
    keepColors: false,
};
async function importMap(options) {
    const fullOptions = { ...defaultOptions, ...options };
    const [file] = await maker.pickFiles("image/png");
    if (!file)
        return;
    const url = URL.createObjectURL(file);
    const map = new ImportedMap(await loadImage(url));
    // Create bipsi rooms & tiles
    EDITOR.stateManager.makeChange(async (data) => {
        // New tileset
        const tileset = await EDITOR.forkTileset();
        // Reset tiles & create new ones
        const tiles = Object.values(map.tiles);
        data.tiles = [];
        for (let i = 0; i < tiles.length; i++) {
            data.tiles.push({ id: tiles[i].index, frames: [i] });
        }
        resizeTileset(tileset, data.tiles);
        EDITOR.tileBrowser.selectedTileIndex = 0;
        // Draw tiles on new tileset
        map.drawTileset(tileset);
        // Palette
        const colors = [...map.mapColors];
        const palette = makeBlankPalette(0);
        data.palettes[0] = palette;
        for (let i = 0; i < colors.length; i++) {
            palette.colors[i + 1] = U32ColorToHex(colors[i]);
        }
        // Rooms
        const transparentColor = map.transparentColor;
        map.rooms.forEach((mapRoom, i) => {
            const overwrittenRoom = data.rooms[i];
            const bipsiRoom = makeBlankRoom(i + 1, data.palettes[0].id);
            if (overwrittenRoom) {
                bipsiRoom.events = overwrittenRoom.events;
                bipsiRoom.wallmap = overwrittenRoom.wallmap;
            }
            bipsiRoom.tilemap = mapRoom.map((line) => line.map((tile) => tile.index));
            bipsiRoom.foremap = mapRoom.map((line) => line.map((tile) => {
                // find which one is not the transparent color
                let index = 0;
                const [color0 = -1, color1 = -1] = tile.colors;
                if (color0 !== transparentColor) {
                    index = colors.indexOf(color0);
                }
                else {
                    index = colors.indexOf(color1);
                }
                return index + 1;
            }));
            if (overwrittenRoom &&
                (fullOptions.keepColors === true ||
                    (Array.isArray(fullOptions.keepColors) &&
                        fullOptions.keepColors.includes(i)))) {
                bipsiRoom.foremap = overwrittenRoom.foremap;
                bipsiRoom.backmap = overwrittenRoom.backmap;
            }
            data.rooms[i] = bipsiRoom;
        });
        EDITOR.roomSelectWindow.select.selectedIndex = 0;
        EDITOR.requestRedraw();
    });
}

async function ensureTilesetFormat(img) {
    // Check the dimensions match a whole number of tiles.
    if (img.height % TILE_PX !== 0 || img.width % TILE_PX !== 0) {
        throw new Error(`The dimensions of the tileset must be a multiple of ${TILE_PX}.`);
    }
    // Ensure the tileset is 16 tiles wide.
    if (img.width !== 16 * TILE_PX) {
        img = await reformatTo16Wide(img);
    }
    // TODO: convert to white on transparent.
    return img;
}
async function reformatTo16Wide(img) {
    // We need to reformat this image.
    // 1 - create canvas for the output image.
    // 2 - iterate over tiles in the input
    // 3 - find the corresponding coordinates in the output & copy the tile over.
    const inputColumns = img.width / TILE_PX;
    const inputRows = img.height / TILE_PX;
    const outputColumns = 16;
    const outputRows = Math.ceil((inputColumns * inputRows) / outputColumns);
    const output = createRendering2D(outputColumns * TILE_PX, outputRows * TILE_PX);
    for (let inputY = 0; inputY < inputRows; inputY++) {
        for (let inputX = 0; inputX < inputColumns; inputX++) {
            const index = inputX + inputY * inputColumns;
            const outputX = index % outputColumns;
            const outputY = (index - outputX) / outputColumns;
            output.drawImage(img, inputX * TILE_PX, inputY * TILE_PX, TILE_PX, TILE_PX, outputX * TILE_PX, outputY * TILE_PX, TILE_PX, TILE_PX);
        }
    }
    return await loadImage(output.canvas.toDataURL());
}

//! CODE_EDITOR
async function importTileset() {
    // TODO: ensure image is only white on transparent
    // TODO: remove missing tiles from rooms
    const [file] = await maker.pickFiles("image/png");
    if (!file)
        return;
    const url = URL.createObjectURL(file);
    let img = await loadImage(url);
    img = await ensureTilesetFormat(img);
    // How many tiles do we need to create?
    const tileCount = Math.floor(img.height / TILE_PX) * 16;
    EDITOR.stateManager.makeChange(async (data) => {
        // New tileset
        const tileset = await EDITOR.forkTileset();
        // Reset tiles
        data.tiles = [];
        for (let i = 0; i < tileCount; i++) {
            data.tiles.push({ id: i + 1, frames: [i] });
        }
        resizeTileset(tileset, data.tiles);
        EDITOR.tileBrowser.selectedTileIndex = 0;
        // Draw image on tileset
        const ctx = tileset.canvas.getContext("2d");
        ctx.clearRect(0, 0, tileset.canvas.width, tileset.canvas.height);
        ctx.drawImage(img, 0, 0);
        EDITOR.requestRedraw();
    });
}

/**
🧱
@file import Tiled
@summary Import maps created with Tiled
@license MIT
@author Jean-Sébastien Monzani & Florian Cargoët (CrocMiam)
@version 1.0


@description
Import maps created with Tiled https://www.mapeditor.org/
*/
//! CODE_EDITOR
async function importTiledMap() {
    //JSM
    const [file] = await maker.pickFiles("application/json");
    if (!file)
        return;
    const mapdata = await maker.textFromFile(file);
    // Create bipsi rooms & tiles
    EDITOR.stateManager.makeChange(async (data) => {
        const jsondata = JSON.parse(mapdata);
        const firstPalette = data.palettes[0];
        if (!firstPalette)
            return;
        // Rooms
        let room = 0;
        const map = jsondata["layers"]; // layers in Tiled = rooms in bipsi
        for (const oneroom of map) {
            // create or edit room
            const roomdata = data.rooms[room] ?? (data.rooms[room] = makeBlankRoom(room, firstPalette.id));
            roomdata.id = room; // ensure that room id = index (room ids can be messy initially)
            let x = 0;
            let y = 0;
            for (const tile of oneroom["data"]) {
                // @ts-ignore
                roomdata.tilemap[y][x] = tile;
                x++;
                if (x >= oneroom.width) {
                    x = 0;
                    y++;
                }
            }
            room++;
        }
        EDITOR.requestRedraw();
    });
}
async function importTiledTilesetAnimation() {
    const [file] = await maker.pickFiles("application/json");
    if (!file)
        return;
    const mapdata = await maker.textFromFile(file);
    EDITOR.stateManager.makeChange(async (data) => {
        try {
            const importedData = JSON.parse(mapdata);
            for (const importedTile of importedData.tiles) {
                const bipsiTile = data.tiles[importedTile.id];
                if (bipsiTile) {
                    // ignore the duration attribute and keep the tileid
                    bipsiTile.frames = importedTile.animation.map((x) => x.tileid);
                }
            }
        }
        catch (e) {
            console.error(e);
        }
    });
}

var imageUp = "<svg width=\"22\" height=\"15\" fill=\"currentColor\" viewBox=\"0 0 22 15\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z\"/><path d=\"M5 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9.777A4.5 4.5 0 0 1 14 11.5a4.5 4.5 0 0 1 2.256-3.898l-2.033-1.05a.5.5 0 0 0-.577.094l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L4 11V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5.043A4.5 4.5 0 0 1 18.5 7a4.5 4.5 0 0 1 .5.03V2a2 2 0 0 0-2-2z\"/><path d=\"M18.495 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708l-.646-.647V13.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0z\"/></svg>";

var jsonUp = "<svg width=\"22\" height=\"15\" fill=\"currentColor\" viewBox=\"0 0 22 15\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.495 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708l-.646-.647V13.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0z\"/><path style=\"font-weight:500;font-size:14.2858px;line-height:1.25;font-family:'Rounded Mplus 1c';-inkscape-font-specification:'Rounded Mplus 1c Medium';letter-spacing:-.915092px;display:inline;stroke-width:.999996\" d=\"M4.428 7.214Q4.185 7.2 4 7.03q-.186-.186-.186-.43 0-.242.171-.413.186-.172.443-.186Q5.6 5.986 5.6 4.286V2.214q0-1.186.485-1.7Q6.571 0 7.671 0h1q.243 0 .4.171.172.172.172.4 0 .229-.172.4-.157.172-.4.172h-.286q-.814 0-1.085.271-.272.272-.272 1.229v1.714q0 .9-.314 1.414-.3.5-1.014.815-.029 0-.029.014 0 .029.029.029.714.314 1.014.828.314.5.314 1.4v1.714q0 .943.272 1.215.271.285 1.085.285h.286q.243 0 .4.158.172.171.172.414 0 .243-.172.4-.157.171-.4.171h-1q-1.1 0-1.586-.514Q5.6 12.186 5.6 11V8.929q0-1.7-1.172-1.715zm10.214-.585q.028 0 .028-.03 0-.013-.028-.013-.714-.315-1.029-.815-.3-.514-.3-1.414V2.643q0-.957-.271-1.229-.272-.271-1.086-.271h-.286q-.242 0-.414-.172Q11.1.8 11.1.571q0-.228.157-.4Q11.428 0 11.67 0h1q1.1 0 1.586.514t.486 1.7v2.072q0 1.7 1.171 1.714.257.014.429.186.186.171.186.414 0 .243-.186.429-.186.17-.429.185-1.171.015-1.171 1.715V11q0 1.186-.486 1.7t-1.586.514h-1q-.242 0-.414-.171-.157-.157-.157-.4 0-.243.157-.414.172-.158.414-.158h.286q.814 0 1.086-.285.271-.272.271-1.215V8.857q0-.9.3-1.4.315-.514 1.029-.828z\" transform=\"scale(.94388 1.05946)\" aria-label=\"{}\"/></svg>";

var caret = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-caret-up-fill\" viewBox=\"0 0 16 16\"><path d=\"m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z\"/></svg>";

//! CODE_EDITOR
const PLUGIN_NAME = "import-image";
//!CONFIG import-map-keep-colors (json) false
//!CONFIG use-full-color (json) false
//!CONFIG hide-color-tools (json) true
function setupEditorPlugin() {
    // Prevent repeating this setup
    EDITOR.loadedEditorPlugins ?? (EDITOR.loadedEditorPlugins = new Set());
    EDITOR.loadedEditorPlugins.add(PLUGIN_NAME);
    const useFullColor = getBooleanConfig("use-full-color");
    const keepColors = getBooleanConfig("import-map-keep-colors");
    // Create a togglable window
    const importImageWindow = createToggleWindow({
        windowId: "import-image-window",
        toggleId: "import-image-toggle",
        inputTitle: "import image",
        inputName: "show-import-image",
        windowContent: `
      <style>
        #import-image-window .block {
          display: grid;
          grid-template-columns: 1fr auto;
          padding-bottom: 6px;
          font-size: 14px;
        }
        #import-image-window hr {
          width: 100%;
          border-color: white;
          margin: 0;
          margin-bottom: 2px;
        }
        #import-image-window ul {
          margin: 0;
        }
        #import-image-window .strike {
          text-decoration: line-through;
        }
        #import-image-window button {
          width: 68px;
          height: 48px;
        }
        #import-image-window button span {
          font-size: 10px;
        }
      </style>

      <h3>import image as map</h3>
      <div class="block">
        <ul>
        <li>image will be cut into rooms</li>
        <li>tileset will be automatically generated</li>
        <li class="keep-colors-strike">palettes will be automatically generated</li>
          <li><label>
            <input type="checkbox" name="keep-colors" ${keepColors ? "checked" : ""}/>
            keep previous bipsi colors
          </label></li>
        </ul>
        <button name="import-image-map" title="import image as map">
          <span>image map</span>
          ${imageUp}
        </button>
      </div>
      <hr />
      <h3>import image as tileset</h3>
      <div class="block">
        <ul>
          <li class="use-full-color-strike">image must be white with transparent background</li>
          <li>image size must be a multiple of ${TILE_PX}.</li>
          <li><label>
            <input type="checkbox" name="use-full-color" ${useFullColor ? "checked" : ""}/>
            use full color tiles <small>(disables color tools, relies on image colors)</small>
          </label></li>
        </ul>
        <button name="import-image-tileset" title="import image as tileset">
          <span>tileset</span>
          ${imageUp}
        </button>
      </div>

      <h3>import Tiled JSON tileset animation data</h3>
      <div class="block">
        <ul>
          <li>import tiles animations from Tiled editor (.json)</li>
          <li>timing will be ignored, only the sequence of tiles is considered</li>
          <li><small><a target="_blank" href="https://doc.mapeditor.org/en/stable/manual/editing-tilesets/#tile-animation-editor">Tiled animation docs</a></small></li>
        </ul>
        <button name="import-tiled-anim-tileset" title="import tileset animation">
          <span>animation</span>
          ${jsonUp}
        </button>
      </div>

      <h3>import Tiled JSON map</h3>
      <div class="block">
        <ul>
          <li>import map from Tiled editor (.json)</li>
          <li>one layer per room</li>
          <li><small><a target="_blank" href="https://doc.mapeditor.org/en/stable/reference/json-map-format/">Tiled JSON map docs</a></<small></li>
        </ul>
        <button name="import-tiled-map" title="import Tiled JSON map">
          <span>tiled map</span>
          ${jsonUp}
        </button>
      </div>`,
        toggleContent: `
        ${imageUp}
        ${caret}
      `,
    });
    const w = importImageWindow.window;
    w.style.height = "auto";
    ONE("#controls").append(w);
    ONE("#draw-room-tab-controls .viewport-toolbar").append(importImageWindow.button);
    const useFullColorCheckbox = ONE('[name="use-full-color"]', w);
    const importImageTilesetButton = ONE('[name="import-image-tileset"]', w);
    const importImageMapButton = ONE('[name="import-image-map"]', w);
    const keepColorsCheckbox = ONE('[name="keep-colors"]', w);
    const importTiledAnimButton = ONE('[name="import-tiled-anim-tileset"]', w);
    const importTiledMapButton = ONE('[name="import-tiled-map"]', w);
    function updateStrikes() {
        const useFullColor = getBooleanConfig("use-full-color");
        for (const el of ALL(".use-full-color-strike", w)) {
            el.classList.toggle("strike", useFullColor);
        }
        const keepColors = getBooleanConfig("import-map-keep-colors");
        for (const el of ALL(".keep-colors-strike", w)) {
            el.classList.toggle("strike", keepColors);
        }
    }
    useFullColorCheckbox.addEventListener("change", async () => {
        await setBooleanConfig("use-full-color", useFullColorCheckbox.checked);
        updateStrikes();
    });
    keepColorsCheckbox.addEventListener("change", async () => {
        await setBooleanConfig("import-map-keep-colors", keepColorsCheckbox.checked);
        updateStrikes();
    });
    EDITOR.roomPaintTool.tab(importImageWindow.button, "tile");
    function click(button, handler) {
        button.addEventListener("click", async () => {
            await handler();
            // Close window
            importImageWindow.toggle.checked = false;
        });
    }
    click(importImageTilesetButton, importTileset);
    click(importTiledAnimButton, importTiledTilesetAnimation);
    click(importTiledMapButton, importTiledMap);
    click(importImageMapButton, async () => {
        await importMap({
            keepColors: getBooleanConfig("import-map-keep-colors"),
        });
    });
}
if (!EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
    setupEditorPlugin();
}
