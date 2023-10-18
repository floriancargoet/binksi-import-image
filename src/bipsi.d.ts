/**
 * @typedef {Object} BipsiDataSettings
 * @property {string} title
 */
/**
 * @typedef {Object} BipsiDataEventField
 * @property {string} key
 * @property {string} type
 * @property {any} data
 */
/**
 * @typedef {Object} BipsiDataEvent
 * @property {number} id
 * @property {number[]} position
 * @property {BipsiDataEventField[]} fields
 */
/**
 * @typedef {Object} BipsiDataRoom
 * @property {number} id
 * @property {number} palette
 * @property {number[][]} tilemap
 * @property {number[][]} backmap
 * @property {number[][]} foremap
 * @property {number[][]} wallmap
 * @property {BipsiDataEvent[]} events
 */
/**
 * @typedef {Object} BipsiDataTile
 * @property {number} id
 * @property {number[]} frames
 */
/**
 * @typedef {Object} BipsiDataPalette
 * @property {number} id
 * @property {string[]} colors
 */
/**
 * @typedef {Object} BipsiDataProject
 * @property {BipsiDataRoom[]} rooms
 * @property {BipsiDataPalette[]} palettes
 * @property {string} tileset
 * @property {BipsiDataTile[]} tiles
 */
/**
 * @typedef {Object} BipsiDataLocation
 * @property {number} room
 * @property {number[]} position
 */
/**
 * Return a list of resource ids that a particular bipsi project depends on.
 * @param {BipsiDataProject} data
 * @returns {string[]}
 */
declare function getManifest(data: BipsiDataProject): string[];
/**
 * @param {HTMLCanvasElement} tileset
 * @param {number} index
 */
declare function getTileCoords(
  tileset: HTMLCanvasElement,
  index: number
): {
  x: number;
  y: number;
  size: number;
};
/**
 * @param {CanvasRenderingContext2D} tileset
 * @param {number} tileIndex
 * @param {CanvasRenderingContext2D} destination
 * @returns {CanvasRenderingContext2D}
 */
declare function copyTile(
  tileset: CanvasRenderingContext2D,
  tileIndex: number,
  destination?: CanvasRenderingContext2D
): CanvasRenderingContext2D;
/**
 * @param {CanvasRenderingContext2D} tileset
 * @param {number} tileIndex
 * @param {CanvasRenderingContext2D} tile
 */
declare function drawTile(
  tileset: CanvasRenderingContext2D,
  tileIndex: number,
  tile: CanvasRenderingContext2D
): void;
/**
 * @param {BipsiDataTile[]} tiles
 * @param {number} frame
 * @returns {Map<number, number>}
 */
declare function makeTileToFrameMap(
  tiles: BipsiDataTile[],
  frame: number
): Map<number, number>;
/**
 * @param {CanvasRenderingContext2D} destination
 * @param {CanvasRenderingContext2D} tileset
 * @param {Map<number, number>} tileToFrame
 * @param {BipsiDataPalette} palette
 * @param {{ tilemap: number[][], backmap: number[][], foremap: number[][] }} layer
 */
declare function drawTilemapLayer(
  destination: CanvasRenderingContext2D,
  tileset: CanvasRenderingContext2D,
  tileToFrame: Map<number, number>,
  palette: BipsiDataPalette,
  {
    tilemap,
    backmap,
    foremap,
  }: {
    tilemap: number[][];
    backmap: number[][];
    foremap: number[][];
  }
): void;
/**
 * @param {CanvasRenderingContext2D} destination
 * @param {CanvasRenderingContext2D} tileset
 * @param {Map<number, number>} tileToFrame
 * @param {BipsiDataPalette} palette
 * @param {BipsiDataEvent[]} events
 */
declare function drawEventLayer(
  destination: CanvasRenderingContext2D,
  tileset: CanvasRenderingContext2D,
  tileToFrame: Map<number, number>,
  palette: BipsiDataPalette,
  events: BipsiDataEvent[]
): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {BipsiDataPalette} palette
 * @param {BipsiDataRoom} room
 */
declare function drawRoomThumbnail(
  rendering: CanvasRenderingContext2D,
  palette: BipsiDataPalette,
  room: BipsiDataRoom
): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {BipsiDataPalette} palette
 */
declare function drawPaletteThumbnail(
  rendering: CanvasRenderingContext2D,
  palette: BipsiDataPalette
): void;
/**
 * @param {any[][]} map
 * @param {number} dx
 * @param {number} dy
 */
declare function cycleMap(map: any[][], dx: number, dy: number): void;
/**
 * @param {BipsiDataEvent[]} events
 * @param {number} dx
 * @param {number} dy
 */
declare function cycleEvents(
  events: BipsiDataEvent[],
  dx: number,
  dy: number
): void;
/**
 * @param {BipsiDataEvent[]} events
 * @param {number} x
 * @param {number} y
 */
declare function getEventsAt(
  events: BipsiDataEvent[],
  x: number,
  y: number,
  ignore?: any
): BipsiDataEvent[];
/**
 * @template {{id: number}} T
 * @param {T[]} items
 * @param {number} id
 * @returns {T}
 */
declare function getById<
  T extends {
    id: number;
  }
>(items: T[], id: number): T;
/**
 * @param {BipsiDataProject} data
 * @param {number} id
 * @returns {BipsiDataRoom}
 */
declare function getRoomById(data: BipsiDataProject, id: number): BipsiDataRoom;
/**
 * @param {BipsiDataProject} data
 * @param {number} id
 * @returns {BipsiDataPalette}
 */
declare function getPaletteById(
  data: BipsiDataProject,
  id: number
): BipsiDataPalette;
/**
 * @param {BipsiDataProject} data
 * @param {number} id
 * @returns {BipsiDataEvent}
 */
declare function getEventById(
  data: BipsiDataProject,
  id: number
): BipsiDataEvent;
/**
 * @param {BipsiDataProject} data
 * @param {number} id
 * @returns {BipsiDataTile}
 */
declare function getTileById(data: BipsiDataProject, id: number): BipsiDataTile;
/**
 * @param {BipsiDataTile[]} tiles
 */
declare function findFreeFrame(tiles: BipsiDataTile[]): number;
/**
 * @param {{id: number}[]} items
 * @returns {number}
 */
declare function nextId(
  items: {
    id: number;
  }[]
): number;
/**
 * @param {CanvasRenderingContext2D} tileset
 * @param {BipsiDataTile[]} tiles
 */
declare function resizeTileset(
  tileset: CanvasRenderingContext2D,
  tiles: BipsiDataTile[]
): void;
declare const URL_PARAMS: URLSearchParams;
declare const BIPSI_HD: string | true;
declare const SAVE_SLOT: string;
declare const storage: {
  appID: any;
  generateMeta: any;
  error: any;
  readonly available: boolean;
  openDatabase(): Promise<IDBDatabase>;
  stores(mode: any): Promise<{
    transaction: IDBTransaction;
    projects: IDBObjectStore;
    meta: IDBObjectStore;
  }>;
  list(): Promise<any[]>;
  save(projectData: any, key: any): Promise<any>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<any>;
};
declare const TILE_PX: 8 | 16;
declare const ROOM_SIZE: 16;
declare const SCREEN_ZOOM: 2;
declare const ROOM_PX: number;
declare const SCREEN_PX: number;
declare namespace constants {
  let frameInterval: number;
  let tileset: string;
  let wallTile: string;
  let eventTile: string;
  let startTile: string;
  let pluginTile: string;
  let colorwheelMargin: number;
}
declare const TEMP_ROOM: CanvasRenderingContext2D;
declare const TEMP_SCREEN: CanvasRenderingContext2D;
/** @param {BipsiDataProject} data */
declare function nextRoomId(data: BipsiDataProject): number;
/** @param {BipsiDataProject} data */
declare function nextTileId(data: BipsiDataProject): number;
/** @param {BipsiDataProject} data */
declare function nextEventId(data: BipsiDataProject): number;
/** @param {BipsiDataProject} data */
declare function nextPaletteId(data: BipsiDataProject): number;
type BipsiDataSettings = {
  title: string;
};
type BipsiDataEventField = {
  key: string;
  type: string;
  data: any;
};
type BipsiDataEvent = {
  id: number;
  position: number[];
  fields: BipsiDataEventField[];
};
type BipsiDataRoom = {
  id: number;
  palette: number;
  tilemap: number[][];
  backmap: number[][];
  foremap: number[][];
  wallmap: number[][];
  events: BipsiDataEvent[];
};
type BipsiDataTile = {
  id: number;
  frames: number[];
};
type BipsiDataPalette = {
  id: number;
  colors: string[];
};
type BipsiDataProject = {
  rooms: BipsiDataRoom[];
  palettes: BipsiDataPalette[];
  tileset: string;
  tiles: BipsiDataTile[];
};
type BipsiDataLocation = {
  room: number;
  position: number[];
};
/**
 * @param {number} width
 * @param {number} height
 * @returns {CanvasRenderingContext2D}
 */
declare function createRendering2D(
  width: number,
  height: number
): CanvasRenderingContext2D;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {string | CanvasGradient | CanvasPattern | undefined} fillStyle
 */
declare function fillRendering2D(
  rendering: CanvasRenderingContext2D,
  fillStyle?: string | CanvasGradient | CanvasPattern | undefined
): void;
/**
 * @param {CanvasRenderingContext2D} source
 * @param {CanvasRenderingContext2D} destination
 * @param {{ x: number, y: number, w: number, h: number }} rect
 */
declare function copyRendering2D(
  source: CanvasRenderingContext2D,
  destination?: CanvasRenderingContext2D,
  rect?: {
    x: number;
    y: number;
    w: number;
    h: number;
  }
): CanvasRenderingContext2D;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {number} width
 * @param {number} height
 */
declare function resizeRendering2D(
  rendering: CanvasRenderingContext2D,
  width: number,
  height: number
): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 */
declare function invertMask(rendering: CanvasRenderingContext2D): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {number} dx
 * @param {number} dy
 */
declare function cycleRendering2D(
  rendering: CanvasRenderingContext2D,
  dx: number,
  dy: number
): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 */
declare function mirrorRendering2D(rendering: CanvasRenderingContext2D): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 */
declare function flipRendering2D(rendering: CanvasRenderingContext2D): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {number} turns
 */
declare function turnRendering2D(
  rendering: CanvasRenderingContext2D,
  turns?: number
): void;
/**
 * @callback pixelsAction
 * @param {Uint32Array} pixels
 */
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {pixelsAction} action
 */
declare function withPixels(
  rendering: CanvasRenderingContext2D,
  action: pixelsAction
): void;
/**
 * @param {CanvasRenderingContext2D} mask
 * @param {string} style
 * @param {CanvasRenderingContext2D} destination
 */
declare function recolorMask(
  mask: CanvasRenderingContext2D,
  style: string,
  destination?: CanvasRenderingContext2D
): CanvasRenderingContext2D;
/**
 * @param {number} x0
 * @param {number} y0
 * @param {number} x1
 * @param {number} y1
 * @param {(x: number, y: number) => void} plot
 */
declare function lineplot(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  plot: (x: number, y: number) => void
): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {number} x
 * @param {number} y
 * @param {number} color
 */
declare function floodfill(
  rendering: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
  tolerance?: number
): void;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {number} x
 * @param {number} y
 * @param {number} color
 * @returns {CanvasRenderingContext2D}
 */
declare function floodfillOutput(
  rendering: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number
): CanvasRenderingContext2D;
/**
 * @param {{r:number,g:number,b:number}} rgb
 */
declare function rgbToHex(rgb: { r: number; g: number; b: number }): string;
/**
 * @param {string} hex
 * @param {number} alpha
 */
declare function hexToUint32(hex: string, alpha?: number): number;
/**
 * @param {number} number
 * @param {string} prefix
 */
declare function numberToHex(number: number, prefix?: string): string;
/**
 * @param {string} text
 * @param {Record<string, number>} palette
 * @returns {CanvasRenderingContext2D}
 */
declare function textToRendering2D(
  text: string,
  palette?: Record<string, number>
): CanvasRenderingContext2D;
/**
 * @param {{ h: number, s: number, v: number }} hsv
 */
declare function HSVToRGB(hsv: { h: number; s: number; v: number }): {
  r: number;
  g: number;
  b: number;
};
/**
 * @param {{ r: number, g: number, b: number }} rgb
 */
declare function RGBToHSV(rgb: { r: number; g: number; b: number }): {
  h: number;
  s: number;
  v: number;
};
declare function HSVToCone(hsv: any): {
  x: number;
  y: number;
  z: any;
};
declare function uint32ToRGB(uint32: any): {
  r: number;
  g: number;
  b: number;
  uint32: any;
};
declare function hexToRGB(hex: any): {
  b: number;
  g: number;
  r: number;
  uint32: number;
};
declare function RGBToUint32(rgb: any): number;
/**
 * @param {CanvasRenderingContext2D} rendering
 * @param {string[]} palette
 */
declare function recolorToPalette(
  rendering: CanvasRenderingContext2D,
  palette: string[]
): void;
/**
 * Copy image contents to a new canvas rendering context.
 * @param {HTMLImageElement} image
 */
declare function imageToRendering2D(
  image: HTMLImageElement
): CanvasRenderingContext2D;
/**
 * Create an html image from a given src (probably a datauri).
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
declare function loadImage(src: string): Promise<HTMLImageElement>;
declare function loadImageLazy(src: any): HTMLImageElement;
/**
 * In the given rendering, replace every instance of a color in the prev palette
 * with the corresponding color in the next palette, ignoring colors that don't
 * appear. This is broken in firefox because colors are not stored exactly.
 * @param {CanvasRenderingContext2D} rendering
 * @param {string[]} prev
 * @param {string[]} next
 */
declare function swapPalette(
  rendering: CanvasRenderingContext2D,
  prev: string[],
  next: string[]
): void;
/**
 * Replace every color in the given rendering. Each existing color is matched
 * to the closest color in the prev palette and replaced with the corresponding
 * color in the next palette.
 * @param {CanvasRenderingContext2D} rendering
 * @param {number[]} prev
 * @param {number[]} next
 */
declare function swapPaletteSafe(
  rendering: CanvasRenderingContext2D,
  prev: number[],
  next: number[]
): void;
/**
 * @param {HTMLCanvasElement} canvas
 */
declare function canvasToBlob(canvas: HTMLCanvasElement): Promise<any>;
declare namespace MASK_PALETTE {
  export let _: number;
  let _default: number;
  export { _default as default };
}
type pixelsAction = (pixels: Uint32Array) => any;
/**
 * @param {CanvasRenderingContext2D} destination
 * @param {CanvasRenderingContext2D} tileset
 * @param {Map<number, number>} tileToFrame
 * @param {BipsiDataPalette} palette
 * @param {BipsiDataRoom} room
 */
declare function drawRoomPreview(
  destination: CanvasRenderingContext2D,
  tileset: CanvasRenderingContext2D,
  tileToFrame: Map<number, number>,
  palette: BipsiDataPalette,
  room: BipsiDataRoom
): void;
/**
 * @param {CanvasRenderingContext2D} destination
 * @param {BipsiPlayback} playback
 * @param {number} roomId
 */
declare function drawRoomPreviewPlayback(
  destination: CanvasRenderingContext2D,
  playback: BipsiPlayback,
  roomId: number
): void;
/**
 * @param {CanvasRenderingContext2D} destination
 * @param {BipsiPlayback} playback
 * @param {number} roomId
 */
declare function drawRoomThumbPlayback(
  destination: CanvasRenderingContext2D,
  playback: BipsiPlayback,
  roomId: number
): void;
declare function generateRoomPreviewURL(
  destination: any,
  playback: any,
  roomId: any
): Promise<void>;
/**
 * @param {BipsiPlayback} playback
 * @returns {Promise<[string, number][]>}
 */
declare function recordFrames(
  playback: BipsiPlayback
): Promise<[string, number][]>;
/**
 * @param {EventTarget} target
 * @param {string} event
 * @returns
 */
declare function wait(target: EventTarget, event: string): Promise<any>;
/**
 * Return a random integer at least min and below max. Why is that the normal
 * way to do random ints? I have no idea.
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
declare function getRandomInt(min: number, max: number): number;
declare function getRandomFloat(min: any, max: any): any;
declare namespace DIALOGUE_DEFAULTS {
  let anchorX: number;
  let anchorY: number;
  let lines: number;
  let lineGap: number;
  let padding: number;
  let glyphRevealDelay: number;
  let backgroundColor: any;
  let panelColor: string;
  let textColor: string;
}
declare const CONT_ICON_DATA: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAADNJREFUCJmNzrENACAMA0E/++/8NAhRBEg6yyc5SePUoNqwDICnWP04ww1tWOHfUqqf1UwGcw4T9WFhtgAAAABJRU5ErkJggg==";
declare const STOP_ICON_DATA: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAYAAAD68A/GAAAAAXNSR0IArs4c6QAAACJJREFUCJljZICC/////2fAAhgZGRn////PwIRNEhsYCgoBIkQHCf7H+yAAAAAASUVORK5CYII=";
declare class DialoguePlayback extends EventTarget {
  constructor(width: any, height: any);
  dialogueRendering: CanvasRenderingContext2D;
  /** @type {DialoguePage[]} */
  queuedPages: DialoguePage[];
  pagesSeen: number;
  options: {};
  /** @type {PromiseLike<void>} */
  waiter: PromiseLike<void>;
  get empty(): boolean;
  load(): Promise<void>;
  contIcon: CanvasRenderingContext2D;
  stopIcon: CanvasRenderingContext2D;
  clear(): void;
  /** @param {DialoguePage} page */
  setPage(page: DialoguePage): void;
  currentPage: DialoguePage;
  pageTime: number;
  showGlyphCount: any;
  showGlyphElapsed: number;
  pageGlyphCount: number;
  /**
   * @param {string} script
   * @param {Partial<DialogueOptions>} options
   * @returns {Promise}
   */
  queue(script: string, options?: Partial<DialogueOptions>): Promise<any>;
  /** @param {number} dt */
  update(dt: number): void;
  render(): void;
  getOptions(options: any): any;
  revealNextChar(): void;
  revealAll(): void;
  cancel(): void;
  skip(): void;
  completed(): boolean;
  moveToNextPage(): void;
  applyStyle(): void;
  showCharTime: number;
}
type DialoguePage = {
  glyphs: BlitsyPage;
  options: Partial<DialogueOptions>;
};
type DialogueOptions = {
  font: any;
  anchorX: number;
  anchorY: number;
  lines: number;
  lineGap: number;
  lineWidth: number;
  padding: number;
  glyphRevealDelay: number;
  backgroundColor: string;
  panelColor: string;
  textColor: string;
  portraitX: string;
  portraitY: string;
};
/**
 * @template {any} T
 * @param {T[]} array
 * @param {T} value
 * @returns {boolean}
 */
declare function arrayDiscard<T extends unknown>(array: T[], value: T): boolean;
/**
 * @param {HTMLCanvasElement} canvas
 * @param {MouseEvent} event
 */
declare function mouseEventToCanvasPixelCoords(
  canvas: HTMLCanvasElement,
  event: MouseEvent
): {
  x: number;
  y: number;
};
/**
 * @param {HTMLCanvasElement} canvas
 * @param {ui.PointerDrag} drag
 */
declare function trackCanvasStroke(
  canvas: HTMLCanvasElement,
  drag: {
    pointerId: any;
    clickMovementLimit: number;
    totalMovement: number;
    downEvent: MouseEvent;
    lastEvent: MouseEvent;
    listeners: {
      pointerup: (event: any) => void;
      pointermove: (event: any) => void;
    };
    unlisten(): void;
    addEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    dispatchEvent(event: Event): boolean;
    removeEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
): {
  x: number;
  y: number;
}[];
declare function nanoid(size?: number): string;
/**
 * Create an html element with the given attributes and children.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tagName
 * @param {*} attributes
 * @param  {...(Node | string)} children
 * @returns {HTMLElementTagNameMap[K]}
 */
declare function html<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes?: any,
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K];
/** @param {number} milliseconds */
declare function sleep(milliseconds: number): any;
/**
 * @template T
 * @param {IDBRequest<T>} request
 * @returns {Promise<T>}
 */
declare function promisfyRequest<T>(request: IDBRequest<T>): Promise<T>;
/**
 * @param {IDBTransaction} transaction
 * @returns {Promise}
 */
declare function promisfyTransaction(transaction: IDBTransaction): Promise<any>;
declare namespace maker {
  export let resourceHandlers: Map<string, ResourceHandler<any, any>>;
  export { ResourceManager };
  export { StateManager };
  /**
   * Ask the browser to download the given blob as a file with the given name.
   * @param {Blob} blob
   * @param {string} name
   */
  export function saveAs(blob: Blob, name: string): void;
  /**
   * Open the browser file picker, optionally restricted to files of a given file
   * type pattern and optionally accepting multiple files.
   * @param {string} accept
   * @param {boolean} multiple
   * @returns {Promise<File[]>}
   */
  export function pickFiles(
    accept?: string,
    multiple?: boolean
  ): Promise<File[]>;
  /**
   * Read plain text from a file.
   * @param {File} file
   * @return {Promise<string>}
   */
  export function textFromFile(file: File): Promise<string>;
  /**
   * Read image from a file.
   * @param {File} file
   * @return {Promise<string>}
   */
  export function dataURIFromFile(file: File): Promise<string>;
  /**
   * Create a DOM for an html page from html source code
   * @param {string} source
   * @returns
   */
  export function htmlFromText(source: string): DocumentFragment;
  /**
   * @param {string} text
   */
  export function textToBlob(text: string, type?: string): Blob;
  /**
   *
   * @param {ParentNode} html
   */
  export function bundleFromHTML(html: ParentNode, query?: string): any;
  /**
   *
   * @param {ParentNode} html
   */
  export function storyFromHTML(html: ParentNode, query?: string): string;
  export { ProjectStorage };
  type ManifestFunction<TProject> = (project: TProject) => string[];
  type ResourceBundle = {
    [x: string]: ResourceData;
  };
  type ProjectBundle<TProject> = {
    project: TProject;
    resources: maker.ResourceBundle;
  };
  type ResourceHandler<TData, TInstance> = {
    load: (data: TData) => Promise<TInstance>;
    copy: (instance: TInstance) => Promise<TInstance>;
    save: (instance: TInstance) => Promise<TData>;
  };
}
declare namespace ui {
  /**
   * Get a wrapper for the radio input elements sharing the given name.
   * @param {string} name
   * @returns {RadioGroupWrapper}
   */
  export function radio(name: string): RadioGroupWrapper;
  export function toggle(name: any): CheckboxWrapper;
  /**
   * @param {string} name
   * @returns {HTMLInputElement}
   */
  export function slider(name: string): HTMLInputElement;
  /**
   * @param {string} name
   * @returns {HTMLInputElement | HTMLTextAreaElement}
   */
  export function text(name: string): HTMLInputElement | HTMLTextAreaElement;
  export let actions: Map<string, ButtonAction>;
  /**
   * Get an action linked to all button elements sharing the given name.
   * Optionally provide a default listener for the action.
   * @param {string} name
   * @param {() => void} listener
   * @returns {ButtonAction}
   */
  export function action(name: string, listener?: () => void): ButtonAction;
  /**
   * Get the html select element with the given name.
   * @param {string} name
   * @returns {HTMLSelectElement}
   */
  export function select(name: string): HTMLSelectElement;
  export { PointerDrag };
  /**
   * Wrap a pointer down event and track its subsequent movement until release.
   * @param {PointerEvent} event
   * @returns {ui.PointerDrag}
   */
  export function drag(event: PointerEvent): {
    pointerId: any;
    clickMovementLimit: number;
    totalMovement: number;
    downEvent: MouseEvent;
    lastEvent: MouseEvent;
    listeners: {
      pointerup: (event: any) => void;
      pointermove: (event: any) => void;
    };
    unlisten(): void;
    addEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    dispatchEvent(event: Event): boolean;
    removeEventListener(
      type: string,
      callback: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  };
}
declare class RadioGroupWrapper extends EventTarget {
  /** @param {HTMLInputElement[]} inputs */
  constructor(inputs: HTMLInputElement[]);
  onRadioChange: () => void;
  inputs: any[];
  set selectedIndex(arg: any);
  get selectedIndex(): any;
  get selectedInput(): any;
  get value(): any;
  get valueAsNumber(): number;
  setSelectedIndexSilent(value: any): void;
  setValueSilent(value: any): void;
  /**
   * @param {HTMLElement} element
   * @param  {...string} values
   */
  tab(element: HTMLElement, ...values: string[]): void;
  /**
   * @param {HTMLInputElement} radioElement
   */
  add(radioElement: HTMLInputElement): void;
  /**
   * @param {HTMLInputElement} radioElement
   */
  remove(radioElement: HTMLInputElement): void;
  removeAll(): void;
  replaceInputs(inputs: any): void;
}
declare class CheckboxWrapper extends EventTarget {
  /** @param {HTMLInputElement[]} inputs */
  constructor(inputs: HTMLInputElement[]);
  inputs: HTMLInputElement[];
  set checked(arg: boolean);
  get checked(): boolean;
  setCheckedSilent(value: any): void;
}
declare class ButtonAction extends EventTarget {
  /** @param {HTMLButtonElement[]} buttons */
  constructor(buttons: HTMLButtonElement[]);
  buttons: HTMLButtonElement[];
  set disabled(arg: any);
  get disabled(): any;
  _disabled: any;
  invoke(force?: boolean): void;
}
/**
 * Get a child element matching CSS selector.
 * @param {string} query
 * @param {ParentNode} element
 * @returns {HTMLElement}
 */
declare function ONE(query: string, element?: ParentNode): HTMLElement;
/**
 * Get all children elements matching CSS selector.
 * @param {string} query
 * @param {HTMLElement | Document} element
 * @returns {HTMLElement[]}
 */
declare function ALL(
  query: string,
  element?: HTMLElement | Document
): HTMLElement[];
declare const urlAlphabet: "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";
/**
 * Deep copy an object by serializing it to json and parsing it again.
 * @template T
 * @param {T} object
 * @returns {T}
 */
declare function COPY<T>(object: T): T;
/**
 * Create an array of zeroes to the given length.
 * @param {number} length
 * @returns {number[]}
 */
declare function ZEROES(length: number): number[];
/**
 * Create an array of a value repeated to the given length.
 * @template T
 * @param {number} length
 * @param {T} value
 * @returns {T[]}
 */
declare function REPEAT<T>(length: number, value: T): T[];
type ResourceData = {
  type: string;
  data: any;
};
declare class ResourceManager {
  lastId: number;
  /** @type {Map<string, { type: string, instance: any }>} */
  resources: Map<
    string,
    {
      type: string;
      instance: any;
    }
  >;
  /**
   * Generate a new unique id for a resource.
   * @returns {string}
   */
  generateId(): string;
  /**
   * Clear all resources.
   */
  clear(): void;
  /**
   * Get the resource instance with the given id.
   * @param {string} id
   * @returns {any}
   */
  get(id: string): any;
  /**
   * Add a resource instance at a specific id.
   * @param {string} id
   * @param {any} instance
   * @param {string} type
   */
  set(id: string, instance: any, type: string): void;
  /**
   * Add an instance as a new resource and return its new id.
   * @param {any} instance
   * @param {string} type
   * @returns {string}
   */
  add(instance: any, type: string): string;
  /**
   * Copy the existing resource with the given id and add it as a new resource.
   * @param {string} id
   * @returns
   */
  fork(id: string): Promise<{
    id: string;
    instance: any;
  }>;
  /**
   * Discard all resources except those at the ids given.
   * @param {Iterable<string>} keepIds
   */
  prune(keepIds: Iterable<string>): void;
  /**
   * Copy all resources from another resource manager.
   * @param {maker.ResourceManager} other
   */
  copyFrom(other: {
    lastId: number;
    /** @type {Map<string, { type: string, instance: any }>} */
    resources: Map<
      string,
      {
        type: string;
        instance: any;
      }
    >;
    /**
     * Generate a new unique id for a resource.
     * @returns {string}
     */
    generateId(): string;
    /**
     * Clear all resources.
     */
    clear(): void;
    /**
     * Get the resource instance with the given id.
     * @param {string} id
     * @returns {any}
     */
    get(id: string): any;
    /**
     * Add a resource instance at a specific id.
     * @param {string} id
     * @param {any} instance
     * @param {string} type
     */
    set(id: string, instance: any, type: string): void;
    /**
     * Add an instance as a new resource and return its new id.
     * @param {any} instance
     * @param {string} type
     * @returns {string}
     */
    add(instance: any, type: string): string;
    /**
     * Copy the existing resource with the given id and add it as a new resource.
     * @param {string} id
     * @returns
     */
    fork(id: string): Promise<{
      id: string;
      instance: any;
    }>;
    /**
     * Discard all resources except those at the ids given.
     * @param {Iterable<string>} keepIds
     */
    prune(keepIds: Iterable<string>): void;
    copyFrom(other: any): Promise<any>;
    /**
     * Save all resources in an object mapping id to type and save data.
     * @param {Iterable<string>} ids
     * @returns {Promise<maker.ResourceBundle>}
     */
    save(ids: Iterable<string>): Promise<maker.ResourceBundle>;
    /**
     * Load all resources from the given bundle.
     * @param {maker.ResourceBundle} bundle
     */
    load(bundle: maker.ResourceBundle): Promise<any>;
  }): Promise<any>;
  /**
   * Save all resources in an object mapping id to type and save data.
   * @param {Iterable<string>} ids
   * @returns {Promise<maker.ResourceBundle>}
   */
  save(ids: Iterable<string>): Promise<maker.ResourceBundle>;
  /**
   * Load all resources from the given bundle.
   * @param {maker.ResourceBundle} bundle
   */
  load(bundle: maker.ResourceBundle): Promise<any>;
}
declare class StateManager<TState> extends EventTarget {
  /**
   * Create a state manager, optionally providing a function that describes
   * how to determine resource dependencies of a given state.
   * @param {maker.ManifestFunction<TState>} getManifest
   */
  constructor(getManifest?: maker.ManifestFunction<TState>);
  /** @type {maker.ManifestFunction<TState>} */
  getManifest: maker.ManifestFunction<TState>;
  resources: {
    lastId: number;
    /** @type {Map<string, { type: string, instance: any }>} */
    resources: Map<
      string,
      {
        type: string;
        instance: any;
      }
    >;
    /**
     * Generate a new unique id for a resource.
     * @returns {string}
     */
    generateId(): string;
    /**
     * Clear all resources.
     */
    clear(): void;
    /**
     * Get the resource instance with the given id.
     * @param {string} id
     * @returns {any}
     */
    get(id: string): any;
    /**
     * Add a resource instance at a specific id.
     * @param {string} id
     * @param {any} instance
     * @param {string} type
     */
    set(id: string, instance: any, type: string): void;
    /**
     * Add an instance as a new resource and return its new id.
     * @param {any} instance
     * @param {string} type
     * @returns {string}
     */
    add(instance: any, type: string): string;
    /**
     * Copy the existing resource with the given id and add it as a new resource.
     * @param {string} id
     * @returns
     */
    fork(id: string): Promise<{
      id: string;
      instance: any;
    }>;
    /**
     * Discard all resources except those at the ids given.
     * @param {Iterable<string>} keepIds
     */
    prune(keepIds: Iterable<string>): void;
    /**
     * Copy all resources from another resource manager.
     * @param {maker.ResourceManager} other
     */
    copyFrom(other: any): Promise<any>;
    /**
     * Save all resources in an object mapping id to type and save data.
     * @param {Iterable<string>} ids
     * @returns {Promise<maker.ResourceBundle>}
     */
    save(ids: Iterable<string>): Promise<{
      [x: string]: ResourceData;
    }>;
    /**
     * Load all resources from the given bundle.
     * @param {maker.ResourceBundle} bundle
     */
    load(bundle: { [x: string]: ResourceData }): Promise<any>;
  };
  /** @type {TState[]} */
  history: TState[];
  index: number;
  historyLimit: number;
  /**
   * The present state in history.
   */
  get present(): TState;
  /**
   * Is there any edit history to undo to?
   */
  get canUndo(): boolean;
  /**
   * Are there any undone edits to redo?
   */
  get canRedo(): boolean;
  /**
   * Replace all state with the project and resources in the given project
   * bundle.
   * @param {maker.ProjectBundle<TState>} bundle
   */
  loadBundle(bundle: maker.ProjectBundle<TState>): Promise<void>;
  /**
   * Replace all state by copying from another state manager.
   * @param {maker.StateManager<TState>} other
   */
  copyFrom(other: StateManager<TState>): Promise<void>;
  /**
   * Replace all state by copying just the present and dependent resources
   * from another state manager.
   * @param {maker.StateManager<TState>} other
   */
  copyPresentFrom(other: StateManager<TState>): Promise<void>;
  /**
   * Copy the present state and dependent resources into a project bundle.
   * @returns {Promise<maker.ProjectBundle<TState>>}
   */
  makeBundle(): Promise<maker.ProjectBundle<TState>>;
  /**
   * Save the current state as a checkpoint in history that can be returned to
   * with undo/redo.
   */
  makeCheckpoint(): void;
  /**
   * Dispatch the change event signalling that the present state has been
   * updated.
   */
  changed(): void;
  /**
   * Discard all resources that are no longer required accord to the manifest
   * function.
   */
  pruneResources(): void;
  /**
   * Make a history checkpoint, replace the current state with a forked
   * version via callback, and then dispatch the change event.
   * @param {(data: TState) => Promise} action
   */
  makeChange(action: (data: TState) => Promise<any>): Promise<void>;
  /**
   * Revert the state to the previous checkpoint in history.
   */
  undo(): void;
  /**
   * Return the state to the most recently undone checkpoint in history.
   */
  redo(): void;
}
declare class ProjectStorage {
  constructor(appID: any, generateMeta?: any);
  appID: any;
  generateMeta: any;
  error: any;
  get available(): boolean;
  openDatabase(): Promise<IDBDatabase>;
  stores(mode: any): Promise<{
    transaction: IDBTransaction;
    projects: IDBObjectStore;
    meta: IDBObjectStore;
  }>;
  /**
   * @returns {Promise<any[]>}
   */
  list(): Promise<any[]>;
  /**
   * @param {any} projectData
   * @returns {Promise}
   */
  save(projectData: any, key: any): Promise<any>;
  /**
   * @param {string} key
   * @returns {Promise<any>}
   */
  load(key: string): Promise<any>;
  /**
   * @param {string} key
   */
  delete(key: string): Promise<any>;
}
declare class PointerDrag extends EventTarget {
  /**
   * @param {MouseEvent} event
   */
  constructor(
    event: MouseEvent,
    {
      clickMovementLimit,
    }?: {
      clickMovementLimit?: number;
    }
  );
  pointerId: any;
  clickMovementLimit: number;
  totalMovement: number;
  downEvent: MouseEvent;
  lastEvent: MouseEvent;
  listeners: {
    pointerup: (event: any) => void;
    pointermove: (event: any) => void;
  };
  unlisten(): void;
}
/**
 * Use inline style to resize canvas to fit its parent, preserving the aspect
 * ratio of its internal dimensions.
 * @param {HTMLCanvasElement} canvas
 */
declare function fitCanvasToParent(canvas: HTMLCanvasElement): void;
/**
 * @param {HTMLElement} element
 */
declare function scaleElementToParent(
  element: HTMLElement,
  margin?: number
): number;
/**
 * @param {any} message
 * @param {string} origin
 */
declare function postMessageParent(message: any, origin: string): void;
/**
 * @param {BipsiDataEvent} event
 * @param {string} key
 */
declare function eventIsTagged(event: BipsiDataEvent, key: string): boolean;
/**
 * @param {BipsiDataRoom} room
 * @param {number} x
 * @param {number} y
 */
declare function cellIsSolid(
  room: BipsiDataRoom,
  x: number,
  y: number
): boolean;
/**
 *
 * @param {BipsiDataEvent} event
 * @param {string} name
 * @param {string} type
 */
declare function allFields(
  event: BipsiDataEvent,
  name: string,
  type?: string
): BipsiDataEventField[];
/**
 *
 * @param {BipsiDataEvent} event
 */
declare function allTags(event: BipsiDataEvent): string[];
/**
 *
 * @param {BipsiDataEvent} event
 * @param {string} name
 * @param {string} type
 */
declare function oneField(
  event: BipsiDataEvent,
  name: string,
  type?: string
): any;
/**
 * @param {BipsiDataProject} data
 */
declare function allEvents(data: BipsiDataProject): any;
/**
 * @param {BipsiDataProject} data
 * @param {BipsiDataEvent} event
 */
declare function roomFromEvent(
  data: BipsiDataProject,
  event: BipsiDataEvent
): any;
/**
 * @param {BipsiDataProject} data
 * @param {BipsiDataLocation} location
 * @returns {BipsiDataEvent?}
 */
declare function getEventAtLocation(
  data: BipsiDataProject,
  location: BipsiDataLocation
): BipsiDataEvent | null;
/**
 * @param {BipsiDataProject} data
 * @param {BipsiDataEvent} event
 * @returns {BipsiDataLocation}
 */
declare function getLocationOfEvent(
  data: BipsiDataProject,
  event: BipsiDataEvent
): BipsiDataLocation;
/**
 * @param {BipsiDataProject} data
 * @param {BipsiDataEvent} event
 * @param {BipsiDataLocation} location
 */
declare function moveEvent(
  data: BipsiDataProject,
  event: BipsiDataEvent,
  location: BipsiDataLocation
): void;
/**
 * @param {BipsiDataProject} data
 * @param {number} eventId
 * @param {BipsiDataLocation} location
 */
declare function moveEventById(
  data: BipsiDataProject,
  eventId: number,
  location: BipsiDataLocation
): void;
/**
 * @param {BipsiDataProject} data
 * @param {BipsiDataEvent} event
 */
declare function removeEvent(
  data: BipsiDataProject,
  event: BipsiDataEvent
): void;
declare function shuffleArray(array: any): void;
/**
 * @param {BipsiDataProject} data
 * @param {number} eventId
 */
declare function findEventById(data: BipsiDataProject, eventId: number): any;
declare function findEventsByTag(data: any, tag: any): any;
declare function findEventByTag(data: any, tag: any): any;
/**
 * @param {BipsiDataEvent} event
 */
declare function allEventTags(event: BipsiDataEvent): string[];
declare function drawRecolorLayer(destination: any, render: any): void;
declare function drawRecolorLayerDynamic(destination: any, render: any): void;
/**
 * @param {BipsiPlayback} playback
 * @param {BipsiDataEvent} event
 * @returns {Promise}
 */
declare function standardEventTouch(
  playback: BipsiPlayback,
  event: BipsiDataEvent
): Promise<any>;
declare function sample(playback: any, id: any, type: any, values: any): any;
declare function makeShuffleIterator(values: any): {};
declare function makeCycleIterator(values: any): {};
declare function makeSequenceIterator(values: any): {};
declare function makeSequenceOnceIterator(values: any): {};
/**
 * @param {BipsiPlayback} playback
 * @param {BipsiDataEvent} event
 * @returns {Promise}
 */
declare function runEventRemove(
  playback: BipsiPlayback,
  event: BipsiDataEvent
): Promise<any>;
declare function fakedownToTag(text: any, fd: any, tag: any): any;
declare function parseFakedown(text: any): any;
/**
 * @param {BipsiDataEvent} event
 * @param {string} name
 * @param {string?} type
 */
declare function clearFields(
  event: BipsiDataEvent,
  name: string,
  type?: string | null
): void;
/**
 * @param {BipsiDataEvent} event
 * @param {string} name
 * @param {string} type
 * @param {any[]} values
 */
declare function replaceFields(
  event: BipsiDataEvent,
  name: string,
  type: string,
  ...values: any[]
): void;
declare function replace(format: any, ...args: any[]): any;
declare function replaceVariables(text: any, variables: any): any;
declare function bindScriptingDefines(defines: any): {};
/**
 * @param {BipsiPlayback} playback
 * @param {BipsiDataEvent} event
 */
declare function addScriptingConstants(
  defines: any,
  playback: BipsiPlayback,
  event: BipsiDataEvent
): void;
declare const AsyncFunction: any;
declare namespace ERROR_STYLE {
  let glyphRevealDelay: number;
  let lines: number;
  let panelColor: string;
  let textColor: string;
  let anchorX: number;
  let anchorY: number;
}
declare const BEHAVIOUR_BEFORE: '\nlet script = $FIELD("before", "javascript");\nif (script) {\n    await RUN_JS(script);\n}\n';
declare const BEHAVIOUR_AFTER: '\nlet script = $FIELD("after", "javascript");\nif (script) {\n    await RUN_JS(script);\n}\n';
declare const BEHAVIOUR_PAGE_COLOR: '\nlet color = FIELD(EVENT, "page-color", "text");\nif (color) {\n    SET_CSS("--page-color", color);\n}\n';
declare const BEHAVIOUR_IMAGES: '\nlet backdrops = FIELDS_OR_LIBRARY("backdrop");\nif (backdrops.length) {\n    SHOW_IMAGE("BACKDROP", backdrops, 0, 0, 0);\n} else if (IS_TAGGED(EVENT, "clear-backdrop")) {\n    HIDE_IMAGE("BACKDROP");\n}\n\nlet backgrounds = FIELDS_OR_LIBRARY("background");\nif (backgrounds.length > 0) {\n    SHOW_IMAGE("BACKGROUND", backgrounds, 1, 0, 0);\n} else if (IS_TAGGED(EVENT, "clear-background")) {\n    HIDE_IMAGE("BACKGROUND");\n}\n\nlet foregrounds = FIELDS_OR_LIBRARY("foreground");\nif (foregrounds.length > 0) {\n    SHOW_IMAGE("FOREGROUND", foregrounds, 2, 0, 0);\n} else if (IS_TAGGED(EVENT, "clear-foreground")) {\n    HIDE_IMAGE("FOREGROUND");\n}\n\nlet overlays = FIELDS_OR_LIBRARY("overlay");\nif (overlays.length > 0) {\n    SHOW_IMAGE("OVERLAY", overlays, 3, 0, 0);\n} else if (IS_TAGGED(EVENT, "clear-overlay")) {\n    HIDE_IMAGE("OVERLAY");\n}\n';
declare const BEHAVIOUR_MUSIC: '\nlet music = FIELD_OR_LIBRARY("music");\n\nif (music) {\n    PLAY_MUSIC(music);\n} else if (IS_TAGGED(EVENT, "stop-music")) {\n    STOP_MUSIC();\n}\n';
declare const BEHAVIOUR_TITLE: '\nlet title = FIELD(EVENT, "title", "dialogue");\nif (title) {\n    await TITLE(title, FIELD(EVENT, "say-style", "json"));\n}\n';
declare const BEHAVIOUR_DIALOGUE: '\nlet id = FIELD(EVENT, "say-shared-id", "text") ?? "SAY-ITERATORS/" + EVENT_ID(EVENT);\nlet mode = FIELD(EVENT, "say-mode", "text") ?? "cycle";\nlet say = SAMPLE(id, mode, FIELDS(EVENT, "say", "dialogue"));\nif (say) {\n    await SAY(say, FIELD(EVENT, "say-style", "json"));\n} else if (say === undefined) {\n    let nosays = FIELD(EVENT, "no-says", "javascript");\n    if (nosays) {\n        await RUN_JS(nosays);\n    }\n}\n';
declare const BEHAVIOUR_EXIT: '\nlet destination = FIELD(EVENT, "exit", "location");\nif (destination) {\n    MOVE(AVATAR, destination);\n}\n';
declare const BEHAVIOUR_REMOVE: '\nif (IS_TAGGED(EVENT, "one-time")) {\n    REMOVE(EVENT);\n}\n';
declare const BEHAVIOUR_ENDING: '\nlet ending = FIELD(EVENT, "ending", "dialogue");\nif (ending !== undefined) {\n    if (ending.length > 0) {\n        await TITLE(ending, FIELD(EVENT, "say-style", "json"));\n    }\n    RESTART();\n}\n';
declare const BEHAVIOUR_SET_AVATAR: '\nlet graphic = FIELD(EVENT, "set-avatar", "tile");\nif (graphic) {\n    SET_GRAPHIC(AVATAR, graphic);\n}\n';
declare const BEHAVIOUR_TOUCH_LOCATION: '\nlet location = FIELD(EVENT, "touch-location", "location");\nlet event = location ? EVENT_AT(location) : undefined;\nif (event) {\n    await TOUCH(event);\n}\n';
declare const BEHAVIOUR_ADD_BEHAVIOUR: '\nADD_BEHAVIOURS(...FIELDS(EVENT, "add-behaviour", "javascript"));\nADD_BEHAVIOURS(...FIELDS(EVENT, "add-behavior", "javascript"));\n';
declare const START_SCRIPTS: string[];
declare const STANDARD_SCRIPTS: string[];
declare const BACKG_PAGE: CanvasRenderingContext2D;
declare const COLOR_PAGE: CanvasRenderingContext2D;
declare const TILES_PAGE: CanvasRenderingContext2D;
declare const BACKG_PAGE_D: CanvasRenderingContext2D;
declare const COLOR_PAGE_D: CanvasRenderingContext2D;
declare const TILES_PAGE_D: CanvasRenderingContext2D;
interface ParagraphHandlerContext {
  tags: Array<string>;
  paragraphText: string;
  sayStyle: Partial<DialogueOptions>;
}
declare class BipsiPlayback extends EventTarget {
  constructor(font: any);
  stateManager: StateManager<BipsiDataProject>;
  stateBackup: StateManager<BipsiDataProject>;
  rendering: CanvasRenderingContext2D;
  font: any;
  dialoguePlayback: DialoguePlayback;
  time: number;
  frameCount: number;
  frameDelay: number;
  ready: boolean;
  busy: boolean;
  error: boolean;
  inputWait: any;
  inputWaitResolve: any;
  objectURLs: any;
  imageElements: any;
  music: HTMLAudioElement;
  autoplay: boolean;
  variables: any;
  images: any;
  extra_behaviours: any[];
  choiceExpected: boolean;
  story: any;
  init(): Promise<void>;
  initWithStory(story: any): Promise<void>;
  /** @type {BipsiDataProject} */
  get data(): BipsiDataProject;
  backup(): Promise<void>;
  /**
   * @param {maker.StateManager<BipsiDataProject>} stateManager
   */
  copyFrom(stateManager: StateManager<BipsiDataProject>): Promise<void>;
  /**
   * @param {maker.ProjectBundle<BipsiDataProject>} bundle
   */
  loadBundle(bundle: maker.ProjectBundle<BipsiDataProject>): Promise<void>;
  clear(): void;
  ended: boolean;
  getFileObjectURL(id: any): any;
  getFileImageElement(id: any): any;
  restart(): Promise<void>;
  start(): Promise<void>;
  avatarId: any;
  libraryId: any;
  spawnAt(target: any, event: any): Promise<void>;
  showPortrait(character: any, sentiment: any, options: any): Promise<boolean>;
  sayWithPortrait(
    text: any,
    character: any,
    sentiment: any,
    options: any
  ): Promise<void>;
  getSayStyle(character: any, style: any): any;
  static paragraphHandlers: Array<
    (
      this: BipsiPlayback,
      context: ParagraphHandlerContext
    ) => void | boolean | Promise<void | boolean>
  >;
  runParagraphHandlers(
    context: ParagraphHandlerContext
  ): Promise<void | boolean>;
  continueStory(EVENT: any): any;
  update(dt: any): void;
  render(frame?: any): void;
  end(): void;
  log(...data: any[]): void;
  setVariable(key: any, value: any): void;
  sendVariables(): void;
  get canMove(): boolean;
  waitInput(): Promise<any>;
  proceed(): Promise<void>;
  title(script: any, options?: {}): Promise<void>;
  say(script: any, options?: {}): Promise<void>;
  move(dx: any, dy: any): Promise<void>;
  eventDebugInfo(event: any): string;
  /**
   * @param {BipsiDataEvent} event
   */
  touch(event: BipsiDataEvent): Promise<void>;
  runJS(event: any, js: any, debug?: boolean): Promise<void>;
  makeScriptingDefines(event: any): {};
  playMusic(src: any): void;
  stopMusic(): void;
  setBackground(image: any): void;
  background: any;
  showImage(
    imageID: any,
    fileIDs: any,
    layer: any,
    x: any,
    y: any
  ): Promise<void>;
  hideImage(imageID: any): void;
  showError(text: any): void;
  getActivePalette(): BipsiDataPalette;
}
declare const ITERATOR_FUNCS: {
  shuffle: typeof makeShuffleIterator;
  cycle: typeof makeCycleIterator;
  sequence: typeof makeSequenceIterator;
  "sequence-once": typeof makeSequenceOnceIterator;
};
declare const WALK_DIRECTIONS: {
  L: number[];
  R: number[];
  U: number[];
  D: number[];
  "<": number[];
  ">": number[];
  "^": number[];
  v: number[];
};
declare function FIELD(event: any, name: any, type?: any): any;
declare function FIELDS(event: any, name: any, type?: any): any[];
declare function IS_TAGGED(event: any, name: any): boolean;
declare namespace SCRIPTING_FUNCTIONS {
  export function SAY(dialogue: any, options: any): any;
  export function SAY_FIELD(name: any, options?: any, event?: any): any;
  export function TITLE(dialogue: any, options: any): any;
  export function TOUCH(event: any): any;
  export function EVENT_AT(location: any): BipsiDataEvent;
  export function LOCATION_OF(event: any): BipsiDataLocation;
  export function FIND_EVENTS(tag: any): any;
  export function FIND_EVENT(tag: any): any;
  export function PLAY_MUSIC(file: any): void;
  export function STOP_MUSIC(): void;
  export function SHOW_IMAGE(
    id: any,
    files: any,
    layer: any,
    x: any,
    y: any
  ): void;
  export function HIDE_IMAGE(id: any): void;
  export function FILE_TEXT(file: any): any;
  export function FIELD_OR_LIBRARY(field: any, event?: any): any;
  export function FIELDS_OR_LIBRARY(field: any, event?: any): any[];
  export function DO_STANDARD(): Promise<any>;
  export function MOVE(event: any, location: any): void;
  export { FIELD };
  export { FIELDS };
  export function SET_FIELDS(
    event: any,
    name: any,
    type: any,
    ...values: any[]
  ): void;
  export function $FIELD(name: any, type?: any, event?: any): any;
  export function $FIELDS(name: any, type?: any, event?: any): any[];
  export function $SET_FIELDS(name: any, type?: any, ...values: any[]): void;
  export { IS_TAGGED };
  export function TAG(event: any, name: any): void;
  export function UNTAG(event: any, name: any): void;
  export function $IS_TAGGED(name: any, event?: any): boolean;
  export function $TAG(name: any, event?: any): void;
  export function $UNTAG(name: any, event?: any): void;
  export function REMOVE(event?: any): void;
  export function $REMOVE(event?: any): void;
  export function SET_GRAPHIC(event: any, tile: any): void;
  export function $SET_GRAPHIC(tile: any, event?: any): void;
  export function WALK(
    event: any,
    sequence: any,
    delay?: number,
    wait?: number
  ): Promise<void>;
  export function $WALK(
    sequence: any,
    delay?: number,
    wait?: number,
    event?: any
  ): Promise<void>;
  export function GET(key: any, fallback?: any, target?: any): any;
  export function SET(key: any, value: any, target?: any): void;
  export function $GET(key: any, fallback?: any, target?: any): any;
  export function $SET(key: any, value: any, target?: any): void;
  export function EVENT_ID(event: any): any;
  export function TEXT_REPLACE(text: any, ...values: any[]): any;
  export function LOG(...data: any[]): void;
  export function DELAY(seconds: any): any;
  export function RESTART(): void;
  export function SAMPLE(id: any, type: any, ...values: any[]): any;
  export function SET_CSS(name: any, value: any): void;
  export function RUN_JS(script: any, event?: any): any;
  export function ADD_BEHAVIOURS(...scripts: any[]): void;
  export function POST(message: any, origin?: string): void;
  export function WAIT_INPUT(): Promise<any>;
  export function SET_INK_VAR(field: any, value: any): void;
  export function GET_INK_VAR(field: any): any;
  export function DIVERT_TO(knot_name: any): any;
}
declare function preload(): Promise<void>;
declare function startEditor(font: any): Promise<BipsiEditor>;
declare function makePlayback(
  font: any,
  bundle: any,
  story: any
): Promise<BipsiPlayback>;
declare function start(): Promise<void>;
declare let PLAYBACK: BipsiPlayback;
declare let EDITOR: BipsiEditor;
/**
 * @typedef {Object} Vector2
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef {Object} Rect
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */
/**
 * @param {number} min
 * @param {number} max
 */
declare function range(min: number, max: number): any;
/**
 * @typedef {Object} BlitsyFontCharacter
 * @property {number} codepoint
 * @property {CanvasImageSource} image
 * @property {Rect} rect
 * @property {number} spacing
 * @property {Vector2?} offset
 */
/**
 * @typedef {Object} BipsiDataFont
 * @property {string} name
 * @property {number} charWidth
 * @property {number} charHeight
 * @property {number[][]} runs
 * @property {Object.<number, { spacing: number, offset: Vector2, size: Vector2 }>} special
 * @property {string} atlas
 */
/**
 * @typedef {Object} BlitsyFont
 * @property {string} name
 * @property {number} lineHeight
 * @property {Map<number, BlitsyFontCharacter>} characters
 */
/**
 * @typedef {Object} BlitsyGlyph
 * @property {HTMLCanvasElement} image
 * @property {Rect} rect
 * @property {Vector2} position
 * @property {Vector2} offset
 * @property {boolean} hidden
 * @property {string} fillStyle
 * @property {Map<string, any>} styles
 */
/**
 * @typedef {Object} BlitsyTextRenderOptions
 * @property {BlitsyFont} font
 * @property {number} lineCount
 * @property {number} lineWidth
 */
/** @typedef {BlitsyGlyph[]} BlitsyPage */
/**
 * @param {BipsiDataFont} data
 */
declare function loadBipsiFont(data: BipsiDataFont): Promise<{
  name: string;
  lineHeight: number;
  characters: any;
}>;
/** @param {HTMLScriptElement} script */
declare function loadBasicFont(script: HTMLScriptElement): Promise<{
  name: string;
  lineHeight: number;
  characters: any;
}>;
/** @param {string} data */
declare function parseRuns(data: string): any[];
/**
 * @param {BlitsyFont} font
 * @param {string} char
 */
declare function getFontChar(font: BlitsyFont, char: string): any;
/**
 * @param {BlitsyPage} page
 * @param {number} width
 * @param {number} height
 * @param {number} ox
 * @param {number} oy
 */
declare function renderPage(
  page: BlitsyPage,
  width: number,
  height: number,
  ox?: number,
  oy?: number
): CanvasRenderingContext2D;
/**
 * @param {string} script
 * @param {BlitsyTextRenderOptions} options
 * @param {*} styleHandler
 * @returns {BlitsyPage[]}
 */
declare function scriptToPages(
  script: string,
  options: BlitsyTextRenderOptions,
  styleHandler?: any
): BlitsyPage[];
declare function tokeniseScript(script: any): any[];
declare function textBufferToCommands(buffer: any): any;
declare function markupBufferToCommands(buffer: any):
  | {
      type: string;
      target: string;
    }[]
  | {
      type: string;
      style: any;
    }[];
/** @param {any[]} tokens */
declare function tokensToCommands(tokens: any[]): any;
/**
 * @param {*} commands
 * @param {BlitsyTextRenderOptions} options
 * @param {*} styleHandler
 */
declare function commandsToPages(
  commands: any,
  options: BlitsyTextRenderOptions,
  styleHandler: any
): any[];
/**
 * Find spans of unbreakable commands that are too long to fit within a page
 * width and amend those spans so that breaking permitted in all positions.
 * @param {*} commands
 * @param {BlitsyTextRenderOptions} options
 */
declare function commandsBreakLongSpans(
  commands: any,
  options: BlitsyTextRenderOptions
): void;
/**
 * @param {BlitsyFont} font
 * @param {string} line
 */
declare function computeLineWidth(font: BlitsyFont, line: string): any;
/**
 * Segment the given array into contiguous runs of elements that are not
 * considered breakable.
 */
declare function filterToSpans(array: any, breakable: any): any[][];
declare function find(array: any, start: any, step: any, predicate: any): any[];
declare function defaultStyleHandler(styles: any, style: any): void;
type Vector2 = {
  x: number;
  y: number;
};
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type BlitsyFontCharacter = {
  codepoint: number;
  image: CanvasImageSource;
  rect: Rect;
  spacing: number;
  offset: Vector2 | null;
};
type BipsiDataFont = {
  name: string;
  charWidth: number;
  charHeight: number;
  runs: number[][];
  special: {
    [x: number]: {
      spacing: number;
      offset: Vector2;
      size: Vector2;
    };
  };
  atlas: string;
};
type BlitsyFont = {
  name: string;
  lineHeight: number;
  characters: Map<number, BlitsyFontCharacter>;
};
type BlitsyGlyph = {
  image: HTMLCanvasElement;
  rect: Rect;
  position: Vector2;
  offset: Vector2;
  hidden: boolean;
  fillStyle: string;
  styles: Map<string, any>;
};
type BlitsyTextRenderOptions = {
  font: BlitsyFont;
  lineCount: number;
  lineWidth: number;
};
type BlitsyPage = BlitsyGlyph[];
declare namespace wrap {
  function before(object: any, method: any, callback: any): void;
  function after(object: any, method: any, callback: any): void;
  function replace(object: any, method: any, callback: any): void;
  function splice(object: any, method: any, callback: any): void;
}
declare class ColorSelectItem {
  constructor(root: any, inputs: any);
  root: any;
  inputs: any;
  setup(id: any, colors: any): void;
  remove(): void;
}
declare class ColorSelect {
  /**
   * @param {*} name
   * @param {HTMLTemplateElement} template
   */
  constructor(name: any, template: HTMLTemplateElement);
  template: HTMLTemplateElement;
  name: any;
  select: RadioGroupWrapper;
  items: IndexedItemPool;
  /**
   * @param {BipsiDataPalette[]} palettes
   */
  updatePalettes(palettes: BipsiDataPalette[]): void;
}
/**
 * @returns {maker.ProjectBundle<BipsiDataProject>}
 */
declare function makeBlankBundle(): maker.ProjectBundle<BipsiDataProject>;
/**
 * @returns {BipsiDataProject}
 */
declare function makeBlankProject(): BipsiDataProject;
/**
 * @param {number} id
 * @param {number} palette
 * @returns {BipsiDataRoom}
 */
declare function makeBlankRoom(id: number, palette: number): BipsiDataRoom;
declare function makeBlankPalette(id: any): {
  id: any;
  colors: string[];
};
declare function generateGrid(
  width: any,
  height: any,
  gap: any
): CanvasRenderingContext2D;
/**
 * Update the given bipsi project data so that it's valid for this current
 * version of bipsi.
 * @param {BipsiDataProject} project
 */
declare function updateProject(project: BipsiDataProject): void;
declare function makeCanvasRounder(
  canvas: any,
  cells: any
): (position: any) => {
  x: number;
  y: number;
};
declare function generateColorWheel(
  width: any,
  height: any
): CanvasRenderingContext2D;
declare function prepareTemplate(element: any): {
  parent: any;
  element: any;
};
declare const TEMP_TILESET0: CanvasRenderingContext2D;
declare const TILE_ZOOM: 20;
declare const ROOM_ZOOM: 2;
declare const TILE_GRID: CanvasRenderingContext2D;
declare const ROOM_GRID: CanvasRenderingContext2D;
declare const TILE_SELECT_ZOOM: 5;
declare const TILE_ICON_SCALE: number;
declare class PaletteEditor {
  /**
   * @param {BipsiEditor} editor
   */
  constructor(editor: BipsiEditor);
  editor: BipsiEditor;
  temporary: any;
  /** @type {HTMLCanvasElement} */
  colorHueSat: HTMLCanvasElement;
  colorHueSatRendering: CanvasRenderingContext2D;
  colorWheelGraphic: HTMLCanvasElement;
  colorIndex: RadioGroupWrapper;
  colorValue: HTMLInputElement;
  colorHex: HTMLInputElement | HTMLTextAreaElement;
  init(): Promise<void>;
  /**
   * @param {BipsiDataProject} data
   * @returns
   */
  getSelections(data?: BipsiDataProject): any;
  /**
   * @returns {BipsiDataPalette}
   */
  getPreviewPalette(): BipsiDataPalette;
  refreshDisplay(): void;
  updateTemporaryFromData(): void;
  updateTemporaryFromHex(): void;
  updateTemporaryFromHSV(): void;
  commitSelectedColorFromTemporary(): void;
}
declare namespace FIELD_DEFAULTS {
  let tag: boolean;
  let tile: number;
  namespace colors {
    let fg: number;
    let bg: number;
  }
  let dialogue: string;
  namespace location {
    let room: number;
    let position: number[];
  }
  let javascript: string;
  let json: string;
  let text: string;
}
declare class EventFieldEditor extends EventTarget {
  /**
   * @param {EventEditor} eventEditor
   * @param {HTMLElement} fieldElement
   */
  constructor(eventEditor: EventEditor, fieldElement: HTMLElement);
  eventEditor: EventEditor;
  fieldElement: HTMLElement;
  nameInput: HTMLElement;
  typeSelect: HTMLElement;
  changed(): void;
  setActive(value: any): void;
  getData(): {
    key: any;
    type: any;
  };
  pushData(field: any): void;
  pullData(field: any): void;
}
declare namespace EVENT_TEMPLATES {
  export let empty: any[];
  let tag_1: {
    key: string;
    type: string;
    data: boolean;
  }[];
  export { tag_1 as tag };
  export let exit: {
    key: string;
    type: string;
    data: {
      room: number;
      position: number[];
    };
  }[];
  export let message: (
    | {
        key: string;
        type: string;
        data: string;
      }
    | {
        key: string;
        type: string;
        data: boolean;
      }
  )[];
  export let character: (
    | {
        key: string;
        type: string;
        data: number;
      }
    | {
        key: string;
        type: string;
        data: {
          bg: number;
          fg: number;
        };
      }
    | {
        key: string;
        type: string;
        data: boolean;
      }
  )[];
  export let ending: {
    key: string;
    type: string;
    data: string;
  }[];
  export let player: (
    | {
        key: string;
        type: string;
        data: boolean;
      }
    | {
        key: string;
        type: string;
        data: number;
      }
    | {
        key: string;
        type: string;
        data: {
          bg: number;
          fg: number;
        };
      }
    | {
        key: string;
        type: string;
        data: string;
      }
  )[];
  export let code: {
    key: string;
    type: string;
    data: string;
  }[];
  export let setup: (
    | {
        key: string;
        type: string;
        data: boolean;
      }
    | {
        key: string;
        type: string;
        data: string;
      }
  )[];
  export let library: {
    key: string;
    type: string;
    data: boolean;
  }[];
  export let plugin: (
    | {
        key: string;
        type: string;
        data: boolean;
      }
    | {
        key: string;
        type: string;
        data: number;
      }
    | {
        key: string;
        type: string;
        data: string;
      }
  )[];
}
declare class EventEditor {
  /**
   * @param {BipsiEditor} editor
   */
  constructor(editor: BipsiEditor);
  editor: BipsiEditor;
  fieldContainer: any;
  fieldTemplate: any;
  fieldEditors: any[];
  selectedIndex: number;
  fileInfo: HTMLElement;
  actions: {
    add: ButtonAction;
    duplicate: ButtonAction;
    shiftUp: ButtonAction;
    shiftDown: ButtonAction;
    delete: ButtonAction;
  };
  eventEmptyElement: HTMLElement;
  eventPropertiesElement: HTMLElement;
  valueEditors: {
    json: HTMLElement;
    dialogue: HTMLElement;
    javascript: HTMLElement;
    fgIndex: RadioGroupWrapper;
    bgIndex: RadioGroupWrapper;
  };
  positionSelect: HTMLElement;
  positionSelectRendering: any;
  dialoguePreviewToggle: CheckboxWrapper;
  get showDialoguePreview(): boolean;
  resetDialoguePreview(): void;
  /**
   * @param {BipsiDataProject} data
   */
  getSelections(data?: BipsiDataProject): {
    event: BipsiDataEvent;
    field: BipsiDataEventField;
    fieldIndex: number;
  };
  refresh(): void;
  refreshPositionSelect(index: any, position?: any): void;
  setSelectedIndex(index: any): void;
  updateFieldCount(count: any): void;
  addField(): Promise<void>;
  duplicateField(): Promise<void>;
  shiftField(di: any): Promise<void>;
  removeField(): Promise<void>;
}
declare class TileEditor {
  /**
   * @param {BipsiEditor} editor
   */
  constructor(editor: BipsiEditor);
  editor: BipsiEditor;
  animateToggle: CheckboxWrapper;
  startDrag(event: any, frameIndex: any): Promise<void>;
  redraw(): void;
}
declare class BipsiEditor extends EventTarget {
  /**
   * Setup most of the stuff for the bipsi editor (the rest is in init
   * because constructors can't be async). This includes finding the existing
   * HTML UI so it doesn't really make sense to construct this more than once
   * but a class is easy syntax for wrapping functions and state together 🤷‍♀️
   */
  constructor(font: any);
  unsavedChanges: boolean;
  ready: boolean;
  stateManager: StateManager<BipsiDataProject>;
  /** @type {Object.<string, CanvasRenderingContext2D>} */
  renderings: {
    [x: string]: CanvasRenderingContext2D;
  };
  tilesetDataURIs: any[];
  playtestIframe: HTMLIFrameElement;
  paintBackground: CheckboxWrapper;
  paintForeground: CheckboxWrapper;
  frameAdjustWindow: HTMLElement;
  showFrameAdjust: CheckboxWrapper;
  colorSelectWindow: HTMLElement;
  showColorSelect: CheckboxWrapper;
  colorSelectPreview: HTMLElement;
  logWindow: HTMLElement;
  showLog: CheckboxWrapper;
  logTextElement: HTMLElement;
  variablesWindow: HTMLElement;
  showVariables: CheckboxWrapper;
  variablesTextElement: HTMLElement;
  fieldRoomSelect: RoomSelect;
  roomSelectWindow: RoomSelect;
  paletteSelectWindow: PaletteSelect;
  colorSelect: ColorSelect;
  moveToRoomSelect: RoomSelect;
  moveToPositionSelect: HTMLElement;
  moveToPositionRendering: any;
  moveToWindow: HTMLElement;
  showMoveTo: CheckboxWrapper;
  roomListing: {
    rooms: {
      id: any;
      thumb: HTMLCanvasElement;
      preview: HTMLCanvasElement;
    }[];
    current: any;
  };
  roomSelectWindowElement: HTMLElement;
  showRoomSelect: CheckboxWrapper;
  paletteSelectWindowElement: HTMLElement;
  showPaletteSelect: CheckboxWrapper;
  tileBrowser: TileBrowser;
  eventTileBrowser: EventTileBrowser;
  tileEditor: TileEditor;
  paletteEditor: PaletteEditor;
  eventEditor: EventEditor;
  storyEditor: StoryEditor;
  font: any;
  dialoguePreviewPlayer: DialoguePlayback;
  time: number;
  tilePaintFrameSelect: RadioGroupWrapper;
  modeSelect: RadioGroupWrapper;
  roomPaintTool: RadioGroupWrapper;
  roomColorMode: RadioGroupWrapper;
  fgIndex: RadioGroupWrapper;
  bgIndex: RadioGroupWrapper;
  roomGrid: CheckboxWrapper;
  tileGrid: CheckboxWrapper;
  highlight: CheckboxWrapper;
  picker: CheckboxWrapper;
  selectedEventCell: {
    x: number;
    y: number;
  };
  selectedEventId: number;
  actions: {
    undo: ButtonAction;
    redo: ButtonAction;
    save: ButtonAction;
    export_: ButtonAction;
    exportGamedata: ButtonAction;
    import_: ButtonAction;
    import_json: ButtonAction;
    exportTileset: ButtonAction;
    clear: ButtonAction;
    reset: ButtonAction;
    update: ButtonAction;
    restartPlaytest: ButtonAction;
    captureGif: ButtonAction;
    shiftTileUp: ButtonAction;
    shiftTileDown: ButtonAction;
    shiftTileLeft: ButtonAction;
    shiftTileRight: ButtonAction;
    rotateTileClockwise: ButtonAction;
    rotateTileAnticlockwise: ButtonAction;
    flipTile: ButtonAction;
    mirrorTile: ButtonAction;
    invertTile: ButtonAction;
    copyTileFrame: ButtonAction;
    pasteTileFrame: ButtonAction;
    clearTileFrame: ButtonAction;
    newTile: ButtonAction;
    duplicateTile: ButtonAction;
    reorderTileBefore: ButtonAction;
    reorderTileAfter: ButtonAction;
    deleteTile: ButtonAction;
    newRoom: ButtonAction;
    duplicateRoom: ButtonAction;
    reorderRoomBefore: ButtonAction;
    reorderRoomAfter: ButtonAction;
    deleteRoom: ButtonAction;
    newPalette: ButtonAction;
    duplicatePalette: ButtonAction;
    reorderPaletteBefore: ButtonAction;
    reorderPaletteAfter: ButtonAction;
    deletePalette: ButtonAction;
    swapTileFrames: ButtonAction;
    copyEvent: ButtonAction;
    pasteEvent: ButtonAction;
    deleteEvent: ButtonAction;
    randomiseColor: ButtonAction;
    restartInk: ButtonAction;
    undoInk: ButtonAction;
  };
  frame: number;
  savedVariables: any;
  init(): Promise<void>;
  EVENT_TILE: HTMLImageElement;
  WALL_TILE: HTMLImageElement;
  PLUGIN_TILE: HTMLImageElement;
  /**
   * @param {BipsiDataProject} data
   */
  getSelections(data?: BipsiDataProject): {
    data: BipsiDataProject;
    tileset: any;
    roomIndex: any;
    room: BipsiDataRoom;
    paletteIndex: any;
    palette: BipsiDataPalette;
    colorIndex: any;
    tileIndex: number;
    tile: BipsiDataTile;
    frameIndex: any;
    tileSize: number;
    event: BipsiDataEvent;
    tileFrame: number;
    fgIndex: any;
    bgIndex: any;
    fg: string;
    bg: string;
  };
  /**
   * @returns {Promise<CanvasRenderingContext2D>}
   */
  forkTileset(): Promise<CanvasRenderingContext2D>;
  /**
   * @param {CanvasRenderingContext2D} rendering
   * @param {number} roomIndex
   */
  drawRoom(
    rendering: CanvasRenderingContext2D,
    roomIndex: number,
    {
      palette,
    }?: {
      palette?: any;
    }
  ): void;
  redrawFromTileChange(): void;
  requestRedraw(): void;
  requestedRedraw: boolean;
  update(dt: any): void;
  redraw(): void;
  refreshRoomSelect(): void;
  refreshPaletteSelect(): void;
  redrawDialoguePreview(): void;
  redrawTileBrowser(): Promise<void>;
  /**
   * @param {(CanvasRenderingContext2D) => void} process
   */
  processSelectedTile(
    process: (CanvasRenderingContext2D: any) => void
  ): Promise<void>;
  copySelectedTileFrame(): Promise<void>;
  copiedTileFrame: CanvasRenderingContext2D;
  pasteSelectedTileFrame(): Promise<void>;
  clearSelectedTileFrame(): Promise<void>;
  swapSelectedTileFrames(): Promise<void>;
  newTile(): Promise<void>;
  duplicateTile(): Promise<void>;
  toggleTileAnimated(): Promise<void>;
  reorderTileBefore(): Promise<void>;
  reorderTileAfter(): Promise<void>;
  deleteTile(): Promise<void>;
  newRoom(): Promise<void>;
  duplicateRoom(): Promise<void>;
  reorderRoomBefore(): Promise<void>;
  reorderRoomAfter(): Promise<void>;
  deleteRoom(): Promise<void>;
  newPalette(): Promise<void>;
  duplicatePalette(): Promise<void>;
  reorderPaletteBefore(): Promise<void>;
  reorderPaletteAfter(): Promise<void>;
  deletePalette(): Promise<void>;
  createEvent(fieldsTemplate?: any): void;
  copySelectedEvent(): void;
  copiedEvent: BipsiDataEvent;
  pasteSelectedEvent(): void;
  deleteSelectedEvent(): void;
  randomiseSelectedColor(): void;
  /**
   * Replace the current bipsi data with the given bundle.
   * @param {maker.ProjectBundle<BipsiDataProject>} bundle
   */
  loadBundle(bundle: maker.ProjectBundle<BipsiDataProject>): Promise<void>;
  loadInkSource(inkSource: any): Promise<void>;
  inkSource: any;
  loadStory(story: any): Promise<void>;
  /** @returns {string[]} */
  getManifest(): string[];
  playtest(): Promise<void>;
  gatherPluginsJavascript(): any;
  makeExportHTML(debug?: boolean): Promise<string>;
  exportProject(): Promise<void>;
  exportGamedata(): Promise<void>;
  exportTileset(): Promise<any>;
  importProject(): Promise<void>;
  importBundle(): Promise<void>;
  resetProject(): Promise<void>;
  emptyProject(): Promise<void>;
  /**
   * Open a new tab with the original editor and send the current project to it.
   */
  updateEditor(): Promise<void>;
  save(): Promise<void>;
}
/**
 * @param {string[]} palette
 * @returns {string}
 */
declare function makePaletteGradient(palette: string[]): string;
declare class PalettePicker {
  select: RadioGroupWrapper;
  optionTemplate: HTMLElement;
  /**
   * @param {string[][]} palettes
   * @param {number} selectedIndex
   */
  pick(palettes: string[][], selectedIndex?: number): Promise<any>;
}
declare class Session {
  controller: AbortController;
  cancel(): void;
  /**
   * @param {EventTarget} target
   * @param {string} type
   * @param {EventListener} listener
   */
  listen(target: EventTarget, type: string, listener: EventListener): void;
}
declare class PaletteSelectItem {
  constructor(root: any, input: any, canvas: any);
  root: any;
  input: any;
  canvas: any;
  rendering: any;
  setup(id: any, thumb: any): void;
  remove(): void;
}
declare class PaletteSelect {
  /**
   * @param {*} name
   * @param {HTMLTemplateElement} template
   */
  constructor(name: any, template: HTMLTemplateElement);
  template: HTMLTemplateElement;
  name: any;
  select: RadioGroupWrapper;
  items: IndexedItemPool;
  /**
   * @param {{ id: number, thumb: HTMLCanvasElement }[]} palettes
   */
  updatePalettes(
    palettes: {
      id: number;
      thumb: HTMLCanvasElement;
    }[]
  ): void;
}
declare class RoomSelectItem {
  constructor(root: any, input: any, canvas: any);
  root: any;
  input: any;
  canvas: any;
  rendering: any;
  setup(id: any, thumb: any): void;
  remove(): void;
}
declare class RoomSelect {
  /**
   * @param {*} name
   * @param {HTMLTemplateElement} template
   */
  constructor(name: any, template: HTMLTemplateElement);
  template: HTMLTemplateElement;
  name: any;
  select: RadioGroupWrapper;
  items: IndexedItemPool;
  /**
   * @param {{ id: number, thumb: HTMLCanvasElement }[]} rooms
   */
  updateRooms(
    rooms: {
      id: number;
      thumb: HTMLCanvasElement;
    }[]
  ): void;
}
declare function debounce(
  func: any,
  wait: any,
  immediate: any
): (...args: any[]) => void;
declare class StoryEditor {
  /**
   * @param {BipsiEditor} editor
   */
  constructor(editor: BipsiEditor);
  editor: BipsiEditor;
  inkPlayerContainer: HTMLElement;
  inkEditor: any;
  story: any;
  choiceHistory: any[];
  loadSource(inkSource: any): void;
  compile(): void;
  reset(): void;
  playtest(withChoices: any): void;
  undo(): void;
  continueStory(story: any, withChoices: any): any;
}
declare class TileSelectItem {
  constructor(root: any, input: any);
  root: any;
  input: any;
  setup(id: any, x: any, y: any, index: any): void;
  remove(): void;
}
declare class TileBrowser {
  /**
   * @param {BipsiEditor} editor
   * @param {string} name
   * @param {HTMLTemplateElement} template
   */
  constructor(editor: BipsiEditor, name: string, template: HTMLTemplateElement);
  editor: BipsiEditor;
  template: HTMLTemplateElement;
  thumbnailURIs: any[];
  itemContainer: HTMLElement;
  items: IndexedItemPool;
  select: RadioGroupWrapper;
  frame: number;
  set selectedTileIndex(arg: number);
  get selectedTileIndex(): number;
  setFrame(frame: any): void;
  redraw(): void;
  setURIs(uris: any, canvases: any): Promise<void>;
  updateCSS(): Promise<void>;
}
declare class EventTileBrowser extends TileBrowser {}
declare class IndexedItemPool {
  constructor({ create, dispose }: { create: any; dispose: any });
  create: any;
  dispose: any;
  items: any[];
  setCount(count: any): void;
  map(data: any, callback: any): void;
}

type SF = typeof SCRIPTING_FUNCTIONS;
interface ScriptingThis extends SF {
  EVENT: BipsiDataEvent;
  PLAYBACK: BipsiPlayback;
  // TODO: more
}
declare const CONFIG: BipsiDataEvent;
