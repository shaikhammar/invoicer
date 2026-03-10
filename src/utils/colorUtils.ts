/**
 * Derive a light tint from a hex colour for use as a background.
 * Returns a hex string that is ~90 % lighter (blended toward white).
 */
export function hexToLightTint(hex: string, blend = 0.88): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const lr = Math.round(r + (255 - r) * blend);
  const lg = Math.round(g + (255 - g) * blend);
  const lb = Math.round(b + (255 - b) * blend);

  return `#${lr.toString(16).padStart(2, "0")}${lg.toString(16).padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}
