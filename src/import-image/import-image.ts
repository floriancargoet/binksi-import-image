import "./full-color";
import { importMap } from "./importMap";
import { importTileset } from "./importTileset";
import { importTiledTilesetAnimation, importTiledMap } from "./importTiled";
import { createToggleWindow, getBooleanConfig, setBooleanConfig } from "../utils";

import imageUp from "../../icons/image-up.svg";
import jsonUp from "../../icons/json-up.svg";
import caret from "../../icons/caret.svg";

declare global {
  interface BipsiEditor {
    loadedEditorPlugins?: Set<String>;
  }
}

//! CODE_EDITOR
const PLUGIN_NAME = "import-image";

//!CONFIG import-map-keep-colors (json) false
//!CONFIG use-full-color (json) false
//!CONFIG hide-color-tools (json) true

function setupEditorPlugin() {
  // Prevent repeating this setup
  EDITOR.loadedEditorPlugins ??= new Set();
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
  const useFullColorCheckbox = ONE<HTMLInputElement>('[name="use-full-color"]', w);
  const importImageTilesetButton = ONE('[name="import-image-tileset"]', w);
  const importImageMapButton = ONE('[name="import-image-map"]', w);
  const keepColorsCheckbox = ONE<HTMLInputElement>('[name="keep-colors"]', w);
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
  function click(button: HTMLElement, handler: () => Promise<void>) {
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
