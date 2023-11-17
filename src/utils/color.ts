/**
 * hex转rgb
 */
interface Rgb {
  r: number;
  g: number;
  b: number;
}
export function hexToRgb(hex: string): Rgb {
  // 移除可能存在的 # 符号
  hex = hex.replace(/^#/, '');
  // 将 hex 分解为 r、g、b 部分
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

/**
 * rgb转hex
 */
export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.split(', ').map(Number);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
