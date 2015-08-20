

import d3 from 'd3';

const commaWithoutDecimalPlacesFormatter = d3.format(',.0f');

/**
 * Convenience function that can be used to format numbers without decimal
 * places and separators for large numbers.
 *
 * @param {number} num - The number to format
 * @returns {string} Human readable number without decimal places and
 *  thousand separators.
 */
export const formatNumberShort = commaWithoutDecimalPlacesFormatter;

/**
 * Format a number of bytes to improve readability for humans. Turn a raw
 * number to something like 10 Mb or 834.5 Gb.
 *
 * @param {number} num - The amount on bytes that should be formatted.
 * @param {number} numberOfDecimalPlaces - The desired number of decimal places
 * @returns {string} Human readable amount of bytes, e.g. 10 Mb
 * @throws An error when the bytes are NaN
 */
export function formatBytes(num, numberOfDecimalPlaces = 2) {
  const base = 1024;
  if (typeof num !== 'number' || isNaN(num)) {
    throw new TypeError('Expected a number');
  }

  let exponent;
  let unit;
  const neg = num < 0;
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? '-' : '') + num + ' B';
  }

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(base)), units.length - 1);
  num = (num / Math.pow(base, exponent)).toFixed(numberOfDecimalPlaces) * 1;
  unit = units[exponent];

  return (neg ? '-' : '') + num + ' ' + unit;
}


/**
 * Convenience function that can be used to format bytes without decimal
 * places. Exposed to avoid currying in dashboard implementations
 *
 * @param {number} num - The amount on bytes that should be formatted.
 * @returns {string} Human readable amount of bytes, e.g. 10 Mb
 */
export function formatBytesShort(num) {
  return formatBytes(num, 0);
}

/**
 * Formats a percentage value (generally 0 - 1) including percent character
 * without decimal places.
 * @param {number} v A number
 * @returns {string} The number in percentage with a percent character
 */
export function formatPercentageShort(v) {
  return commaWithoutDecimalPlacesFormatter(v * 100) + '%';
}

/**
 * takes three parameters for red green and blue and transformates them into
 * a string e.g. 0f3ec1
 *
 * @param {r, g ,b} the values for red green and blue between 0 and 255.
 * @returns {string} the encoded color value as hex.
 */
export function rgbToHex(r, g, b) {
  const hex = r << 16 ^ g << 8 ^ b << 0;
  return ('000000' + hex.toString(16)).slice(-6);
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

  const r = (hex >> 16 & 255);
  const g = (hex >> 8 & 255);
  const b = (hex & 255);
  return {r, g, b};
}

/**
 * as hexToRGB, but values are between [0, 1]
 */
export function hexToRGBNormalized(style) {
  const rgb = hexToRGB(style);
  return {r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255};
}
