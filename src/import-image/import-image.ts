import { Options, importMap } from "./importMap";
import { importTileset } from "./importTileset";
import imageUp from "../../icons/image-up.svg";
import caret from "../../icons/caret.svg";
import { autoCloseToggledWindow } from "../utils";

declare global {
  interface BipsiEditor {
    loadedEditorPlugins?: Set<String>;
  }
}

//! CODE_EDITOR
const PLUGIN_NAME = "import-image";

//!CONFIG import-map-options (json) {"keepColors": false}

function setupEditorPlugin() {
  // Prevent repeating this setup
  EDITOR.loadedEditorPlugins ??= new Set();
  EDITOR.loadedEditorPlugins.add(PLUGIN_NAME);

  // Create a togglable window
  const importImageWindow = createToggleWindow({
    windowId: "import-image-window",
    toggleId: "import-image-toggle",
    inputTitle: "import image",
    inputName: "show-import-image",
    windowContent: `
      <h3>import image as tileset</h3>
      <div style="display:flex;flex-direction: row;">
        <ul style="flex:1">
          <li>image must be white with transparent background</li>
          <li>image size must be a multiple of ${TILE_PX}.</li>
        </ul>
        <button name="import-tileset" title="import image as tileset" style="flex:none;width:64px;height:48px;">
          <span style="font-size:10px">tileset</span>
          ${imageUp}
        </button>
      </div>

      <h3>import image as map</h3>
      <div style="display:flex;flex-direction: row;">
        <ul style="flex:1">
          <li>TODO</li>
        </ul>
        <button name="import-map" title="import image as map" style="flex:none;width:64px;height:48px;">
          <span style="font-size:10px">map</span>
          ${imageUp}
        </button>
      </div>`,
    toggleContent: `
        ${imageUp}
        ${caret}
      `,
  });
  importImageWindow.window.style.height = "auto";

  ONE("#controls").append(importImageWindow.window);
  ONE("#draw-room-tab-controls .viewport-toolbar").append(
    importImageWindow.button
  );

  const importImageButton = ONE(
    '[name="import-tileset"]',
    importImageWindow.window
  );
  const importMapButton = ONE('[name="import-map"]', importImageWindow.window);
  EDITOR.roomPaintTool.tab(importImageWindow.button, "tile");
  importImageButton.addEventListener("click", async () => {
    await importTileset();
    // Close window
    importImageWindow.toggle.checked = false;
  });
  importMapButton.addEventListener("click", async () => {
    let options: Partial<Options> = {};
    try {
      const rawOptions = FIELD(CONFIG, "import-map-options", "json");
      if (rawOptions != null && typeof rawOptions === "object") {
        options = rawOptions as Partial<Options>;
      } else {
        console.log("Incorrect import-map-options");
      }
    } catch (e) {
      console.log("Incorrect import-map-options");
    }
    await importMap(options);
    // Close window
    importImageWindow.toggle.checked = false;
  });
}

if (!EDITOR.loadedEditorPlugins?.has(PLUGIN_NAME)) {
  setupEditorPlugin();
}

type ToggleWindowOptions = {
  windowId: string;
  toggleId: string;
  inputTitle: string;
  inputName: string;
  windowContent: string;
  toggleContent: string;
};
function createToggleWindow({
  windowId,
  toggleId,
  inputName,
  inputTitle,
  toggleContent,
  windowContent,
}: ToggleWindowOptions) {
  const windowEl = document.createElement("div");
  windowEl.id = windowId;
  windowEl.className = "popup-window";
  windowEl.hidden = true;
  windowEl.innerHTML = windowContent;

  const toggleButtonEl = document.createElement("label");
  toggleButtonEl.id = toggleId;
  toggleButtonEl.className = "toggle picker-toggle";
  toggleButtonEl.hidden = true;
  toggleButtonEl.innerHTML = `
    <input type="checkbox" name="${inputName}" title="${inputTitle}">
    ${toggleContent}
  `;

  // bipsi's ui.toggle requires the element to be in the DOM
  // so we directly use the CheckboxWrapper
  const toggle = new CheckboxWrapper(
    ALL(`[name="${inputName}"]`, toggleButtonEl) as Array<HTMLInputElement>
  );

  toggle?.addEventListener("change", () => {
    windowEl.hidden = !toggle.checked;
  });

  autoCloseToggledWindow(windowEl, toggle);
  return {
    window: windowEl,
    button: toggleButtonEl,
    toggle,
  };
}
