import { importMap } from "./importMap";
import { importTileset } from "./importTileset";

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
