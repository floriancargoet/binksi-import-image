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

var imageUp = "<svg width=\"22\" height=\"15\" fill=\"currentColor\" viewBox=\"0 0 22 15\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z\"/><path d=\"M5 0a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9.777A4.5 4.5 0 0 1 14 11.5a4.5 4.5 0 0 1 2.256-3.898l-2.033-1.05a.5.5 0 0 0-.577.094l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L4 11V2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5.043A4.5 4.5 0 0 1 18.5 7a4.5 4.5 0 0 1 .5.03V2a2 2 0 0 0-2-2z\"/><path d=\"M18.495 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708l-.646-.647V13.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0z\"/></svg>";

const PLUGIN_NAME = "import-image";
function setupEditorPlugin() {
    // Prevent repeating this setup
    EDITOR.loadedEditorPlugins ?? (EDITOR.loadedEditorPlugins = new Set());
    EDITOR.loadedEditorPlugins.add(PLUGIN_NAME);
    // Create button
    const tpl = document.createElement("template");
    tpl.innerHTML = `<div class="horizontal-capsule" id="import-image-toolbar" hidden style="flex: none; width: 120px;">
      <button name="import-tileset" title="import image as tileset">
        <span style="font-size:10px">tileset</span>
        ${imageUp}
      </button>
      <button name="import-map" title="import image as map">
        <span style="font-size:10px">map</span>
        ${imageUp}
        </svg>
      </button>
    </div>`;
    const tileToolbar = ONE("#draw-room-tab-controls .viewport-toolbar");
    tileToolbar.append(tpl.content);
    const importToolbar = ONE("#import-image-toolbar");
    const importImageButton = ONE('[name="import-tileset"]', importToolbar);
    const importMapButton = ONE('[name="import-map"]', importToolbar);
    EDITOR.roomPaintTool.tab(importToolbar, "tile");
    importImageButton.addEventListener("click", () => importTileset());
    importMapButton.addEventListener("click", () => importMap());
}
if (!EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
    setupEditorPlugin();
}
