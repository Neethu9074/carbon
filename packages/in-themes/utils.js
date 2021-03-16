/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function addTransparency(hex, opacity) {
  const rgb = hexToRGB(hex);
  rgb.r = 255 * (1 - opacity) + rgb.r * opacity;
  rgb.g = 255 * (1 - opacity) + rgb.g * opacity;
  rgb.b = 255 * (1 - opacity) + rgb.b * opacity;
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function hexToRGBA(hex, opacity) {
  const rgb = hexToRGB(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

function rgbToHex(r, g, b) {
  const hex = (r << 16) ^ (g << 8) ^ (b << 0);
  return '#' + ('000000' + hex.toString(16)).slice(-6);
}

function hexToRGB(style) {
  const color = /^#([0-9a-f]{6})$/i.exec(style);
  let hex = parseInt(color[1], 16);

  hex = Math.floor(hex);

  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return { r, g, b };
}
