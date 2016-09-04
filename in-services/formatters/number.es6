import {format} from 'd3-format';

const byteBase = 1024;

export const zeroDecimalPlaces = format(',.0f');
export const twoDecimalPlaces = format(',.2f');

export const zeroDecimalPlacesPerSecond = d => zeroDecimalPlaces(d) + '/s';

export const percentageZeroDecimalPlaces = d => zeroDecimalPlaces(d * 100) + '%';
export const percentageTwoDecimalPlaces = d => twoDecimalPlaces(d * 100) + '%';

export const bytesZeroDecimalPlaces = d => formatBytes(d, 0);
export const bytesTwoDecimalPlaces = d => formatBytes(d, 2);

export const timeByMillisTwoDecimalPlaces = t => formatTime(t * 1000);
export const timeByMicroTwoDecimalPlaces = t => formatTime(t);

export const bytesPerSecondZeroDecimalPlaces = d => formatBytes(d, 0) + '/s';
export const bytesPerSecondTwoDecimalPlaces = d => formatBytes(d, 2) + '/s';

export const kiloBytesZeroDecimalPlaces = d => formatBytes(d * byteBase, 0);
export const kiloBytesTwoDecimalPlaces = d => formatBytes(d * byteBase, 2);

export const withSiPrefixZeroDecimalPlaces = format(',.0s');
const siPrefixThreeDecimalPlacesFormatRule = format(',.6s');
export const withSiPrefixThreeDecimalPlaces = d => {
  const match = siPrefixThreeDecimalPlacesFormatRule(d).match(/^(\d+)\.(\d+)(.*)$/i);

  const major = match[1];
  let minor = match[2];
  const prefix = match[3];

  while (minor.length < 3) {
    minor += '0';
  }

  if (minor.length > 3) {
    minor = minor.substring(0, 3);
  }

  return `${major}.${minor}${prefix}`;
};

export const withSiMultiplyPrefixZeroDecimalPlaces = d => withSiPrefixZeroDecimalPlaces(d | 0);
export const withSiMultiplyPrefixThreeDecimalPlaces = d => {
  if (d < 1) {
    return d.toFixed(3);
  }
  return withSiPrefixThreeDecimalPlaces(d);
};

export const msZeroDecimalPlaces = d => zeroDecimalPlaces(d) + 'ms';
export const msTwoDecimalPlaces = d => twoDecimalPlaces(d) + 'ms';
export const muSecondsZeroDecimalPlaces = d => zeroDecimalPlaces(d) + 'µs';
export const muSecondsTwoDecimalPlaces = d => twoDecimalPlaces(d) + 'µs';
export const muSecondsToMillisZeroDecimalPlaces = d => zeroDecimalPlaces(d / 1000) + 'ms';
export const muSecondsToMillisTwoDecimalPlaces = d => twoDecimalPlaces(d / 1000) + 'ms';

export const time = millis => {
  if (millis < 1) {
    return muSecondsZeroDecimalPlaces(millis * 1000);
  }
  return msZeroDecimalPlaces(millis);
};


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


/**
 * Format a time to improve readability for humans. Turn a raw
 * number to something like 10 ms or 30 s.
 *
 * @param {number} num - The amount on bytes that should be formatted
 * @returns {string} Human readable amount of time
 * @throws An error when the time are NaN
 */
function formatTime(t) {
  if (typeof t !== 'number' || isNaN(t)) {
    throw new TypeError('Expected a number');
  }

  const formatValue = v => ((v * 100) | 0) / 100;

  const units = [{
      unit: 'µs',
      range: 1000
    }, {
      unit: 'ms',
      range: 1000
    }, {
      unit: 's',
      range: 60
    }, {
      unit: 'min',
      range: 60
    }, {
      unit: 'h',
      range: 24
    }, {
      unit: 'd',
      range: Number.MAX_VALUE
    }
  ];

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    if (t < unit.range) {
      return formatValue(t) + unit.unit;
    }

    t /= unit.range;
  }

  return formatValue(t) + units[units.length - 1].unit;
}
