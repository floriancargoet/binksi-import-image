//! CODE_ALL_TYPES

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

export function getBooleanConfig(name: string, defaultValue = false) {
  const value = FIELD(CONFIG, name, "json");
  if (typeof value !== "boolean") return defaultValue;
  return value;
}

export function setBooleanConfig(name: string, value: boolean) {
  // We want a sync change so we rewrite makeChange
  EDITOR.stateManager.makeCheckpoint();
  const pluginEvent = findEventById(EDITOR.stateManager.present, CONFIG.id);
  replaceFields(pluginEvent, name, "json", value);
  EDITOR.stateManager.changed();
}
