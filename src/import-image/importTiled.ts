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

export async function importTiledMap() {
  //JSM
  const [file] = await maker.pickFiles("application/json");
  if (!file) return;
  const mapdata = await maker.textFromFile(file);
  // Create bipsi rooms & tiles
  EDITOR.stateManager.makeChange(async (data) => {
    const jsondata = JSON.parse(mapdata);
    const firstPalette = data.palettes[0];
    if (!firstPalette) return;

    // Rooms
    let room = 0;
    const map = jsondata["layers"]; // layers in Tiled = rooms in bipsi
    for (const oneroom of map) {
      // create or edit room
      const roomdata =
        data.rooms[room] ?? (data.rooms[room] = makeBlankRoom(room, firstPalette.id));
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

export async function importTiledTilesetAnimation() {
  const [file] = await maker.pickFiles("application/json");
  if (!file) return;
  const mapdata = await maker.textFromFile(file);
  EDITOR.stateManager.makeChange(async (data) => {
    try {
      const importedData = JSON.parse(mapdata);
      for (const importedTile of importedData.tiles) {
        const bipsiTile = data.tiles[importedTile.id];
        if (bipsiTile) {
          // ignore the duration attribute and keep the tileid
          bipsiTile.frames = importedTile.animation.map((x: any) => x.tileid);
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
}
