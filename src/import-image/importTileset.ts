//! CODE_EDITOR

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

async function ensureTilesetFormat(img: HTMLImageElement) {
  // Check the dimensions match a whole number of tiles.
  if (img.height % TILE_PX !== 0 || img.width % TILE_PX !== 0) {
    throw new Error(
      `The dimensions of the tileset must be a multiple of ${TILE_PX}.`
    );
  }
  // Ensure the tileset is 16 tiles wide.
  if (img.width !== 16 * TILE_PX) {
    img = await reformatTo16Wide(img);
  }
  // TODO: convert to white on transparent.
  return img;
}

async function reformatTo16Wide(img: HTMLImageElement) {
  // We need to reformat this image.
  // 1 - create canvas for the output image.
  // 2 - iterate over tiles in the input
  // 3 - find the corresponding coordinates in the output & copy the tile over.
  const inputColumns = img.width / TILE_PX;
  const inputRows = img.height / TILE_PX;
  const outputColumns = 16;
  const outputRows = Math.ceil((inputColumns * inputRows) / outputColumns);
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
