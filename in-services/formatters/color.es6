/**
 * takes three parameters for red green and blue and transformates them into
 * a string e.g. 0f3ec1
 *
 * @param {r, g ,b} the values for red green and blue between 0 and 255.
 * @returns {string} the encoded color value as hex.
 */
export function rgbToHex(r, g, b) {
  const hex = r << 16 ^ g << 8 ^ b << 0;
  return '#' + ('000000' + hex.toString(16)).slice(-6);
}

/**
 * takes a hex string and transformates them into
 * rgb space e.g. #0f3ec1
 *
 * @param {style} the hex string to be transformed.
 * @returns {r, g, b} the encoded color values [0, 255].
 */
export function hexToRGB(style) {
  const color = /^\#([0-9a-f]{6})$/i.exec(style);
  let hex = parseInt(color[1], 16);

  hex = Math.floor(hex);

  const r = hex >> 16 & 255;
  const g = hex >> 8 & 255;
  const b = hex & 255;
  return { r, g, b };
}

/**
 * as hexToRGB, but values are between [0, 1]
 */
export function hexToRGBNormalized(style) {
  const rgb = hexToRGB(style);
  return { r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255 };
}
