export function U32ColorToRGBA(n: number) {
  const u32a = new Uint32Array([n]);
  const u8a = new Uint8ClampedArray(u32a.buffer);
  return Array.from(u8a);
}

export function U32ColorToHex(n: number) {
  const [r, g, b] = U32ColorToRGBA(n);
  const h = ("000000" + (r * 256 * 256 + g * 256 + b).toString(16)).slice(-6);
  return "#" + h;
}
