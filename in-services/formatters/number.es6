import d3 from 'd3';

const byteBase = 1024;

export const zeroDecimalPlaces = d3.format(',.0f');
export const twoDecimalPlaces = d3.format(',.2f');

export const percentageZeroDecimalPlaces = d => zeroDecimalPlaces(d * 100) + '%';
export const percentageTwoDecimalPlaces = d => twoDecimalPlaces(d * 100) + '%';

export const bytesZeroDecimalPlaces = d => formatBytes(d, 0);
export const bytesTwoDecimalPlaces = d => formatBytes(d, 2);

export const bytesPerSecondZeroDecimalPlaces = d => formatBytes(d, 0) + '/s';
export const bytesPerSecondTwoDecimalPlaces = d => formatBytes(d, 2) + '/s';

export const kiloBytesZeroDecimalPlaces = d => formatBytes(d * byteBase, 0);
export const kiloBytesTwoDecimalPlaces = d => formatBytes(d * byteBase, 2);

export const withSiPrefixZeroDecimalPlaces = d => withSiPrefix(d, 0);
export const withSiPrefixTwoDecimalPlaces = d => withSiPrefix(d, 2);

export const msZeroDecimalPlaces = d => zeroDecimalPlaces(d) + 'ms';
export const msTwoDecimalPlaces = d => twoDecimalPlaces(d) + 'ms';
export const muSecondsZeroDecimalPlaces = d => zeroDecimalPlaces(d) + 'µs';
export const muSecondsToMillisZeroDecimalPlaces = d => zeroDecimalPlaces(d / 1000) + 'ms';

/**
 * Format a number with a metric prefix according to the international system of units:

 * Wiki excerpt:
 * > A metric prefix is a unit prefix that precedes a basic unit of measure to indicate a
 * > multiple or fraction of the unit. While all metric prefixes in common use today are decadic,
 * > historically there have been a number of binary metric prefixes as well.[1] Each prefix has a
 * > unique symbol that is prepended to the unit symbol. The prefix kilo-, for example, may be
 * > added to gram to indicate multiplication by one thousand; one kilogram is equal to one
 * > thousand grams. The prefix milli-, likewise, may be added to metre to indicate division by
 * > one thousand; one millimetre is equal to one thousandth of a metre.
 * >
 * > Decimal multiplicative prefixes have been a feature of all forms of the metric system with
 * > six dating back to the system's introduction in the 1790s. Metric prefixes have even been
 * > pre-pended to non-metric units. The SI prefixes are standardized for use in the
 * > International System of Units (SI) by the International Bureau of Weights and Measures (BIPM)
 * > in resolutions dating from 1960 to 1991.[2] Since 2009, they have formed part of the
 * > International System of Quantities.
 * Source: https://en.wikipedia.org/wiki/Metric_prefix
 *
 * @param {number} num Number to format with SI prefix
 * @param {number} [numberOfDecimalPlaces=2] The desired number of decimal places to format to.
 * @return {string} The formatter number of the SI prefix.
 */
function withSiPrefix(num, numberOfDecimalPlaces = 2) {
  const prefix = d3.formatPrefix(num);
  return d3.round(prefix.scale(num), numberOfDecimalPlaces) + prefix.symbol;
}


/**
 * Format a number of bytes to improve readability for humans. Turn a raw
 * number to something like 10 Mb or 834.5 Gb.
 *
 * @param {number} num - The amount on bytes that should be formatted.
 * @param {number} numberOfDecimalPlaces - The desired number of decimal places
 * @returns {string} Human readable amount of bytes, e.g. 10 Mb
 * @throws An error when the bytes are NaN
 */
function formatBytes(num, numberOfDecimalPlaces = 2) {
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

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(byteBase)), units.length - 1);
  num = (num / Math.pow(byteBase, exponent)).toFixed(numberOfDecimalPlaces) * 1;
  unit = units[exponent];

  return (neg ? '-' : '') + num + ' ' + unit;
}
