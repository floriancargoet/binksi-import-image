interface Maker {
  pickFiles(accept?: string, multiple?: boolean): Promise<Array<File>>;
}
interface BipsiDataEventField {
  key: string;
  type: string;
  data: any;
}

interface BipsiDataEvent {
  id: number;
  position: Array<number>;
  fields: Array<BipsiDataEventField>;
}

interface BipsiDataRoom {
  id: number;
  palette: number;
  tilemap: Array<Array<number>>;
  backmap: Array<Array<number>>;
  foremap: Array<Array<number>>;
  wallmap: Array<Array<number>>;
  events: Array<BipsiDataEvent>;
}

interface BipsiDataTile {
  id: number;
  frames: Array<number>;
}

interface BipsiDataPalette {
  id: number;
  colors: Array<string>;
}

interface BipsiDataProject {
  rooms: Array<BipsiDataRoom>;
  palettes: Array<BipsiDataPalette>;
  tileset: string;
  tiles: Array<BipsiDataTile>;
}

class BipsiEditor {
  forkTileset();
  requestRedraw();
  tileBrowser: TileBrowser;
  stateManager: StateManager<BipsiDataProject>;
  roomSelectWindow: RoomSelect;
  roomPaintTool: RadioGroupWrapper;
}

class TileBrowser {
  selectedTileIndex: number;
}

class StateManager<TState> {
  makeChange(action: (data: TState) => Promise<void>);
}
class RadioGroupWrapper extends EventTarget {
  selectedIndex: number;

  tab(element: HTMLElement, ...values: Array<string>);
}

class CheckboxWrapper extends EventTarget {
  checked: boolean;
  inputs: Array<HTMLInputElement>;
  constructor(inputs: HTMLInputElement[]);
  setCheckedSilent(checked: boolean);
}

class RoomSelect {
  constructor(name: any, template: HTMLTemplateElement);
  updateRooms(rooms: Array<{ id: number; thumb: HTMLCanvasElement }>);
  select: RadioGroupWrapper;
}

interface BipsiDataTile {
  id: number;
  frames: Array<number>;
}

interface UI {
  toggle: (name: string) => CheckboxWrapper;
}

declare const TILE_PX: nuumber;
declare const EDITOR: BipsiEditor;
declare const maker: Maker;
declare const ui: UI;

declare function loadImage(str: string): Promise<HTMLImageElement>;
declare function resizeTileset(
  tileset: CanvasRenderingContext2D,
  tiles: Array<BipsiDataTile>
);

declare function createRendering2D(
  width: number,
  height: number
): CanvasRenderingContext2D;

declare function withPixels(
  rendering: CanvasRenderingContext2D,
  action: (pixels: Uint32Array) => void
);

declare function makeBlankPalette(id: number): {
  id: number;
  colors: Array<string>;
};

declare function makeBlankRoom(id: number, palette: number): BipsiDataRoom;

declare function fillRendering2D(
  rendering: CanvasRenderingContext2D,
  fillStyle?: string | CanvasGradient | CanvasPattern | undefined
);

declare function ONE(
  query: string,
  element: ParentNode = undefined
): HTMLElement;

declare function ALL(
  query: string,
  element: ParentNode = undefined
): Array<HTMLElement>;

declare function FIELD(
  event: BipsiDataEvent,
  name: string,
  type: string = undefined
): unknown;

declare const CONFIG: BipsiDataEvent;
