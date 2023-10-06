import { U32ColorToHex } from "./utils";

//! CODE_EDITOR

interface Tile {
  uid: string;
  index: number;
  imageData: ImageData;
  colors: Array<number>;
}

class ImportedMap {
  tileIndex = 1;
  tiles: Record<string, Tile> = {};
  rooms: Array<Array<Array<Tile>>> = [];
  mapColors = new Set<number>();

  constructor(img: HTMLImageElement) {
    this.createTilesFromMapImage(img);
  }

  get transparentColor() {
    const [first] = this.mapColors;
    return first!; // There's always as least one color
  }

  createTilesFromMapImage(img: HTMLImageElement) {
    // Check the dimensions match a whole number of rooms.
    const roomSize = 16 * TILE_PX;
    if (img.height % roomSize !== 0 || img.width % roomSize !== 0) {
      throw new Error(
        `The dimensions of the map must be a multiple of ${roomSize}.`
      );
    }
    // Create rooms and tiles.
    const roomCols = img.width / roomSize;
    const roomRows = img.height / roomSize;
    // Canvas so we can read pixels for color detection.
    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = TILE_PX;
    tileCanvas.height = TILE_PX;
    const tileCtx = tileCanvas.getContext("2d", { willReadFrequently: true })!; // optimisation
    tileCtx.imageSmoothingEnabled = false;

    for (let row = 0; row < roomRows; row++) {
      for (let col = 0; col < roomCols; col++) {
        const room: Array<Array<Tile>> = [];
        this.rooms.push(room);
        // Iterate over tiles in room
        for (let yRoom = 0; yRoom < 16; yRoom++) {
          const roomLine: Array<Tile> = [];
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
      // FIXME: excluding transparency
      throw new Error("A map can have at most 7 colors.");
    }
  }

  getOrCreateTile(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(0, 0, TILE_PX, TILE_PX);
    const uid = ctx.canvas.toDataURL("image/png");
    return (this.tiles[uid] ??= this.createTile(uid, imageData));
  }

  createTile(uid: string, imageData: ImageData): Tile {
    const d = new Uint32Array(imageData.data.buffer); // endianness dependant!
    const colors = new Set<number>();
    // const counts = {};
    for (let i = 0; i < d.length; i++) {
      const color = d[i]!;
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

  async drawTileset(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let x = 0,
      y = 0;
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
        } else {
          pixels[i] = 0xffffffff;
        }
      }
    });
  }
}

type Options = {
  keepColors: boolean | Array<number>;
};

const defaultOptions: Options = {
  keepColors: false,
};

export async function importMap(options?: Partial<Options>) {
  const fullOptions: Options = { ...defaultOptions, ...options };

  const [file] = await maker.pickFiles("image/png");
  if (!file) return;
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
      data.tiles.push({ id: tiles[i]!.index, frames: [i] });
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
      palette.colors[i + 1] = U32ColorToHex(colors[i]!);
    }

    // Rooms
    const transparentColor = map.transparentColor;

    map.rooms.forEach((mapRoom, i) => {
      const overwrittenRoom = data.rooms[i];
      const bipsiRoom = makeBlankRoom(i + 1, data.palettes[0]!.id);
      if (overwrittenRoom) {
        bipsiRoom.events = overwrittenRoom.events;
        bipsiRoom.wallmap = overwrittenRoom.wallmap;
      }
      bipsiRoom.tilemap = mapRoom.map((line) => line.map((tile) => tile.index));
      bipsiRoom.foremap = mapRoom.map((line) =>
        line.map((tile) => {
          // find which one is not the transparent color
          let index = 0;
          const [color0 = -1, color1 = -1] = tile.colors;
          if (color0 !== transparentColor) {
            index = colors.indexOf(color0);
          } else {
            index = colors.indexOf(color1);
          }
          return index + 1;
        })
      );
      if (
        overwrittenRoom &&
        (fullOptions.keepColors === true ||
          (Array.isArray(fullOptions.keepColors) &&
            fullOptions.keepColors.includes(i)))
      ) {
        bipsiRoom.foremap = overwrittenRoom.foremap;
        bipsiRoom.backmap = overwrittenRoom.backmap;
      }
      data.rooms[i] = bipsiRoom;
    });
    EDITOR.roomSelectWindow.select.selectedIndex = 0;

    EDITOR.requestRedraw();
  });
}
