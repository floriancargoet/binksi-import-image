import { importMap } from "./importMap";
import { importTileset } from "./importTileset";
import imageUp from "../icons/image-up.svg";

//! CODE_EDITOR

declare global {
  interface BipsiEditor {
    loadedEditorPlugins?: Set<String>;
  }
}

const PLUGIN_NAME = "import-image";

function setupEditorPlugin() {
  // Prevent repeating this setup
  EDITOR.loadedEditorPlugins ??= new Set();
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
  importImageButton.addEventListener("click", importTileset);
  importMapButton.addEventListener("click", importMap);
}

if (!EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
  setupEditorPlugin();
}
