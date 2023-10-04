//! CODE_EDITOR
(function () {
'use strict';

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
    this.mapColors = /* @__PURE__ */ new Set();
    this.createTilesFromMapImage(img);
  }
  get transparentColor() {
    const [first] = this.mapColors;
    return first;
  }
  createTilesFromMapImage(img) {
    const roomSize = 16 * TILE_PX;
    if (img.height % roomSize !== 0 || img.width % roomSize !== 0) {
      throw new Error(
        `The dimensions of the map must be a multiple of ${roomSize}.`
      );
    }
    const roomCols = img.width / roomSize;
    const roomRows = img.height / roomSize;
    const tileCtx = createRendering2D(TILE_PX, TILE_PX);
    for (let row = 0; row < roomRows; row++) {
      for (let col = 0; col < roomCols; col++) {
        const room = [];
        this.rooms.push(room);
        for (let yRoom = 0; yRoom < 16; yRoom++) {
          const roomLine = [];
          room.push(roomLine);
          for (let xRoom = 0; xRoom < 16; xRoom++) {
            const yMap = row * 16 + yRoom;
            const xMap = col * 16 + xRoom;
            fillRendering2D(tileCtx);
            tileCtx.drawImage(
              img,
              xMap * TILE_PX,
              yMap * TILE_PX,
              TILE_PX,
              TILE_PX,
              0,
              0,
              TILE_PX,
              TILE_PX
            );
            const tile = this.getOrCreateTile(tileCtx);
            roomLine.push(tile);
          }
        }
      }
    }
    if (this.mapColors.size > 7) {
      throw new Error("A map can have at most 7 colors.");
    }
  }
  getOrCreateTile(ctx) {
    const imageData = ctx.getImageData(0, 0, TILE_PX, TILE_PX);
    const uid = ctx.canvas.toDataURL("image/png");
    if (!this.tiles[uid]) {
      this.tiles[uid] = this.createTile(uid, imageData);
    }
    return this.tiles[uid];
  }
  createTile(uid, imageData) {
    const d = new Uint32Array(imageData.data.buffer);
    const colors = /* @__PURE__ */ new Set();
    for (let i = 0; i < d.length; i++) {
      const color = d[i];
      colors.add(color);
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
      colors: [...colors]
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
    const transparentColor = this.transparentColor;
    withPixels(ctx, (pixels) => {
      for (let i = 0; i < pixels.length; i++) {
        if (pixels[i] === transparentColor) {
          pixels[i] = 0;
        } else {
          pixels[i] = 4294967295;
        }
      }
    });
  }
}
async function importMap() {
  const [file] = await maker.pickFiles("image/png");
  const url = URL.createObjectURL(file);
  const map = new ImportedMap(await loadImage(url));
  EDITOR.stateManager.makeChange(async (data) => {
    const tileset = await EDITOR.forkTileset();
    const tiles = Object.values(map.tiles);
    data.tiles = [];
    for (let i = 0; i < tiles.length; i++) {
      data.tiles.push({ id: tiles[i].index, frames: [i] });
    }
    resizeTileset(tileset, data.tiles);
    EDITOR.tileBrowser.selectedTileIndex = 0;
    map.drawTileset(tileset);
    const colors = [...map.mapColors];
    const palette = makeBlankPalette(0);
    data.palettes = [palette];
    for (let i = 0; i < colors.length; i++) {
      palette.colors[i + 1] = U32ColorToHex(colors[i]);
    }
    const transparentColor = map.transparentColor;
    map.rooms.forEach((mapRoom, i) => {
      const overwrittenRoom = data.rooms[i];
      const bipsiRoom = makeBlankRoom(i + 1, data.palettes[0].id);
      if (overwrittenRoom) {
        bipsiRoom.events = overwrittenRoom.events;
        bipsiRoom.wallmap = overwrittenRoom.wallmap;
      }
      bipsiRoom.tilemap = mapRoom.map((line) => line.map((tile) => tile.index));
      bipsiRoom.foremap = mapRoom.map(
        (line) => line.map((tile) => {
          let index;
          if (tile.colors[0] !== transparentColor) {
            index = colors.indexOf(tile.colors[0]);
          } else {
            index = colors.indexOf(tile.colors[1]);
          }
          return index + 1;
        })
      );
      data.rooms[i] = bipsiRoom;
    });
    EDITOR.roomSelectWindow.select.selectedIndex = 0;
    EDITOR.requestRedraw();
  });
}

async function importTileset() {
  const [file] = await maker.pickFiles("image/png");
  const url = URL.createObjectURL(file);
  let img = await loadImage(url);
  img = await ensureTilesetFormat(img);
  const tileCount = Math.floor(img.height / TILE_PX) * 16;
  EDITOR.stateManager.makeChange(async (data) => {
    const tileset = await EDITOR.forkTileset();
    data.tiles = [];
    for (let i = 0; i < tileCount; i++) {
      data.tiles.push({ id: i + 1, frames: [i] });
    }
    resizeTileset(tileset, data.tiles);
    EDITOR.tileBrowser.selectedTileIndex = 0;
    const ctx = tileset.canvas.getContext("2d");
    ctx.clearRect(0, 0, tileset.canvas.width, tileset.canvas.height);
    ctx.drawImage(img, 0, 0);
    EDITOR.requestRedraw();
  });
}
async function ensureTilesetFormat(img) {
  if (img.height % TILE_PX !== 0 || img.width % TILE_PX !== 0) {
    throw new Error(
      `The dimensions of the tileset must be a multiple of ${TILE_PX}.`
    );
  }
  if (img.width !== 16 * TILE_PX) {
    img = await reformatTo16Wide(img);
  }
  return img;
}
async function reformatTo16Wide(img) {
  const inputColumns = img.width / TILE_PX;
  const inputRows = img.height / TILE_PX;
  const outputColumns = 16;
  const outputRows = Math.ceil(inputColumns * inputRows / outputColumns);
  const output = createRendering2D(
    outputColumns * TILE_PX,
    outputRows * TILE_PX
  );
  for (let inputY = 0; inputY < inputRows; inputY++) {
    for (let inputX = 0; inputX < inputColumns; inputX++) {
      const index = inputX + inputY * inputColumns;
      const outputX = index % outputColumns;
      const outputY = (index - outputX) / outputColumns;
      output.drawImage(
        img,
        inputX * TILE_PX,
        inputY * TILE_PX,
        TILE_PX,
        TILE_PX,
        outputX * TILE_PX,
        outputY * TILE_PX,
        TILE_PX,
        TILE_PX
      );
    }
  }
  return await loadImage(output.canvas.toDataURL());
}

const PLUGIN_NAME = "import-image";
function setupEditorPlugin() {
  EDITOR.loadedEditorPlugins ?? (EDITOR.loadedEditorPlugins = /* @__PURE__ */ new Set());
  EDITOR.loadedEditorPlugins.add(PLUGIN_NAME);
  const tpl = document.createElement("template");
  tpl.innerHTML = `<div class="horizontal-capsule" id="import-image-toolbar">
      <button class="icon-button" name="import-tileset" title="import tileset">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"></path>
        </svg>
      </button>
      <button class="icon-button" name="import-map" title="import map">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"></path>
        </svg>
      </button>
    </div>`;
  const tileToolbar = ONE("#draw-room-tab-controls .viewport-toolbar");
  tileToolbar.append(tpl.content);
  const importImageButton = ONE('[name="import-tileset"]', tileToolbar);
  const importMapButton = ONE('[name="import-map"]', tileToolbar);
  EDITOR.roomPaintTool.tab(importImageButton, "tile");
  EDITOR.roomPaintTool.tab(importMapButton, "tile");
  importImageButton.addEventListener("click", importTileset);
  importMapButton.addEventListener("click", importMap);
}
if (!EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
  setupEditorPlugin();
}

})();
