//! CODE_EDITOR

import { ensureTilesetFormat } from "./utils";

export async function importTileset() {
  // TODO: ensure image is only white on transparent
  // TODO: remove missing tiles from rooms
  const [file] = await maker.pickFiles("image/png");
  if (!file) return;
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
    const ctx = tileset.canvas.getContext("2d")!;
    ctx.clearRect(0, 0, tileset.canvas.width, tileset.canvas.height);
    ctx.drawImage(img, 0, 0);
    EDITOR.requestRedraw();
  });
}
