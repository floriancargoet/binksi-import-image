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

export function autoCloseToggledWindow(
  windowElement: HTMLElement,
  toggle: CheckboxWrapper
) {
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
