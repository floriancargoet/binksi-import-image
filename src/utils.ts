//! CODE_EDITOR

export function U32ColorToRGBA(n: number) {
  const u32a = new Uint32Array([n]);
  const u8a = new Uint8ClampedArray(u32a.buffer);
  return Array.from(u8a) as [number, number, number, number];
}

export function U32ColorToHex(n: number) {
  const [r, g, b] = U32ColorToRGBA(n);
  const h = ("000000" + (r * 256 * 256 + g * 256 + b).toString(16)).slice(-6);
  return "#" + h;
}

export function autoCloseToggledWindow(windowElement: HTMLElement, toggle: CheckboxWrapper) {
  window.addEventListener("click", (event) => {
    const target = event.target as Node;
    const ignore =
      windowElement.hidden ||
      !event.isTrusted ||
      windowElement.contains(target) ||
      toggle.inputs.includes(target as HTMLInputElement);
    if (ignore) return;
    toggle.checked = false;
  });
}

type ToggleWindowOptions = {
  windowId: string;
  toggleId: string;
  inputTitle: string;
  inputName: string;
  windowContent: string;
  toggleContent: string;
};

export function createToggleWindow({
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

export function getBooleanConfig(name: string, defaultValue = false) {
  const value = FIELD(CONFIG, name, "json");
  if (typeof value !== "boolean") return defaultValue;
  return value;
}

export async function setBooleanConfig(name: string, value: boolean) {
  await EDITOR.stateManager.makeChange(async (data) => {
    const pluginEvent = findEventById(data, CONFIG.id);
    replaceFields(pluginEvent, name, "json", value);
  });
}
