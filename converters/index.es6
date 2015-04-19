'use strict';

import prettyBytes from 'pretty-bytes';

/**
 * Format a number of bytes to improve readability for humans. Turn a raw
 * number to something like 10 Mb or 834.5 Gb.
 *
 * @param {number} bytes - The amount on bytes that should be formatted.
 * @returns {string} Human readable amount of bytes, e.g. 10 Mb
 * @throws An error when the bytes are NaN
 */
export function formatBytes(bytes) {
  return prettyBytes(bytes);
}
