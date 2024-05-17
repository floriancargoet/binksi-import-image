export async function ensureTilesetFormat(img: HTMLImageElement) {
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

export async function reformatTo16Wide(img: HTMLImageElement) {
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
