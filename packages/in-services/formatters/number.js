/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { format as defaultLocaleFormat, formatLocale as createCustomLocaleFormat } from 'd3-format';

import { getSingle } from 'in-services/settings';

const isLocaleAware = !getSingle('formatNumbersAccordingToEnUs') && window.instana.numberLocale;
const format = isLocaleAware ? createCustomLocaleFormat(window.instana.numberLocale).format : defaultLocaleFormat;
export const byteBase = 1024;
export const decimalSeparator = (isLocaleAware && window.instana.numberLocale.decimal) || '.';
export const thousandsSeparator = (isLocaleAware && window.instana.numberLocale.thousands) || ',';

export const zeroDecimalPlaces = format(',.0f');
export const twoDecimalPlaces = format(',.2f');
export const fourDecimalPlaces = format(',.4f');
export const number = {
  compact: zeroDecimalPlaces,
  detailed: twoDecimalPlaces,
  perSecond: {
    compact: v => zeroDecimalPlaces(v) + '/s',
    detailed: v => twoDecimalPlaces(v) + '/s'
  },
  forcedCompact: {
    compact: zeroDecimalPlaces,
    detailed: zeroDecimalPlaces
  },
  forcedDetailed: {
    compact: twoDecimalPlaces,
    detailed: twoDecimalPlaces
  }
};

export const positiveNumber = v => (v > 0 ? v : '-');

export const activityZeroDecimalPlaces = d => (d < 0 ? 'No activity' : zeroDecimalPlaces(d));
export const activityTwoDecimalPlaces = d => (d < 0 ? 'No activity' : twoDecimalPlaces(d));
export const activity = {
  compact: activityZeroDecimalPlaces,
  detailed: activityTwoDecimalPlaces
};

export const zeroDecimalPlacesPerSecond = d => zeroDecimalPlaces(d) + '/s';
export const twoDecimalPlacesPerSecond = d => twoDecimalPlaces(d) + '/s';

export const percentageZeroDecimalPlaces = d => zeroDecimalPlaces(d * 100) + '%';
export const percentageTwoDecimalPlaces = d => twoDecimalPlaces(d * 100) + '%';
export const percentage = {
  compact: percentageZeroDecimalPlaces,
  detailed: percentageTwoDecimalPlaces
};

export const percentagePlainZeroDecimalPlaces = d => zeroDecimalPlaces(d) + '%';
export const percentagePlainTwoDecimalPlaces = d => twoDecimalPlaces(d) + '%';
export const percentagePlain = {
  compact: percentagePlainZeroDecimalPlaces,
  detailed: percentagePlainTwoDecimalPlaces
};

export const bytesZeroDecimalPlaces = d => formatBytes(d, zeroDecimalPlaces);
export const bytesTwoDecimalPlaces = d => formatBytes(d, twoDecimalPlaces);
export const bytes = {
  compact: bytesZeroDecimalPlaces,
  detailed: bytesTwoDecimalPlaces,
  detailedWithRaw: v => `${bytesTwoDecimalPlaces(v)} (${number.compact(v)} B)`,
  perSecond: {
    compact: v => bytesZeroDecimalPlaces(v) + '/s',
    detailed: v => bytesTwoDecimalPlaces(v) + '/s'
  }
};

export const timeByNanoTwoDecimalPlaces = t => formatTime(t, timeNanoUnits, number.detailed);
export const timeByMicroTwoDecimalPlaces = t => formatTime(t, timeMicroUnits, number.detailed);
export const timeByMillisTwoDecimalPlaces = t => formatTime(t, timeMilliUnits, number.detailed);
export const timeByMillisFourDecimalPlaces = t => formatTime(t, timeMilliUnits, fourDecimalPlaces);
export const timeBySecondsTwoDecimalPlaces = t => formatTime(t, timeSecondUnits, number.compact);
export const timeByMinutesTwoDecimalPlaces = t => formatTime(t, timeMinuteUnits, number.detailed);
export const micros = {
  compact: t => formatTime(t, timeMicroUnits, number.compact),
  fixedCompact: t => number.compact(t) + 'µs',
  detailed: timeByMicroTwoDecimalPlaces
};
export const millis = {
  compact: t => formatTime(t, timeMilliUnits, number.compact),
  fixedCompact: t => number.compact(t) + 'ms',
  detailed: timeByMillisTwoDecimalPlaces,
  fixedDetailed: t => number.detailed(t) + 'ms',
  fixed: {
    compact: t => number.compact(t) + 'ms',
    detailed: t => number.detailed(t) + 'ms'
  },
  forcedFixedCompact: {
    compact: t => number.compact(t) + 'ms',
    detailed: t => number.compact(t) + 'ms'
  },
  // 'ms' are always formatted to compact zero decimal format,
  // 's' and 'min' can have both compact and detailed formats
  forcedCompactOnMs: {
    compact: t => formatTime(t, timeMilliUnits, number.compact),
    detailed: t => (t < 1000 ? formatTime(t, timeMilliUnits, number.compact) : timeByMillisTwoDecimalPlaces(t))
  },
  // t < 999,999 - in milliseconds, always formatted to compact zero decimal format
  // t >= 1,000,000 - in seconds, can have both compact and detailed formats
  largeInSeconds: {
    compact: t => (t < 1000000 ? number.compact(t) + 'ms' : number.compact(t / 1000) + 's'),
    detailed: t => (t < 1000000 ? number.compact(t) + 'ms' : number.detailed(t / 1000) + 's')
  }
};
export const seconds = {
  detailed: t => formatTime(t, timeSecondUnits, number.detailed),
  fromMillisFixedDetailed: t => number.detailed(t / 1000) + 's',
  fixedDetailed: t => number.detailed(t) + 's',
  fixedCompact: t => number.compact(t) + 's'
};
export const minutes = {
  compact: t => formatTime(t, timeMinuteUnits, number.compact),
  detailed: timeByMinutesTwoDecimalPlaces
};
export const millisToTwoDecimalSeconds = value => (value > 1000 ? millis.detailed(value) : millis.compact(value));

// call and beacon latency can be 0ms, we want to show '< 1ms' instead
function latencyFormatterWrapper(formatter) {
  return {
    compact: v => (v < 1 ? '< 1ms' : formatter.compact(v)),
    detailed: v => (v < 1 ? '< 1ms' : formatter.detailed(v))
  };
}

export const latency = latencyFormatterWrapper(millis.forcedCompactOnMs);
export const latencyFixed = latencyFormatterWrapper(millis.forcedFixedCompact);

// display '< 1ms' label for mean latency values between 0ms and 1ms
// exclude 0 because mean latency can be 0 when there are no calls
export function meanLatencyFormatterWrapper(formatter) {
  return {
    compact: t => (t > 0 && t < 1 ? '< 1ms' : formatter.compact(t)),
    detailed: t => (t > 0 && t < 1 ? '< 1ms' : formatter.detailed(t))
  };
}

export const meanLatency = meanLatencyFormatterWrapper(millis.forcedCompactOnMs);
export const meanLatencyFixed = meanLatencyFormatterWrapper(millis.forcedFixedCompact);
export const meanLatencyLargeInSeconds = meanLatencyFormatterWrapper(millis.largeInSeconds);

export const bytesPerSecondZeroDecimalPlaces = d => formatBytes(d, zeroDecimalPlaces) + '/s';
export const bytesPerSecondTwoDecimalPlaces = d => formatBytes(d, twoDecimalPlaces) + '/s';

export const kiloBytesZeroDecimalPlaces = d => formatBytes(d * byteBase, zeroDecimalPlaces);
export const kiloBytesTwoDecimalPlaces = d => formatBytes(d * byteBase, twoDecimalPlaces);
export const kiloBytes = {
  compact: kiloBytesZeroDecimalPlaces,
  detailed: kiloBytesTwoDecimalPlaces
};

export const megaBytesZeroDecimalPlaces = d => formatBytes(d * byteBase * byteBase, zeroDecimalPlaces);
export const megaBytesTwoDecimalPlaces = d => formatBytes(d * byteBase * byteBase, twoDecimalPlaces);
export const megaBytes = {
  compact: megaBytesZeroDecimalPlaces,
  detailed: megaBytesTwoDecimalPlaces
};

export const millisPerSecondZeroDecimalPlaces = d => millis.fixedCompact(d * 1000) + '/s';

const siPrefixZeroDecimalPlacesFormatRule = format(',.3s');
const siPrefixZeroDecimalPlacesFormatRuleForSmallValues = format(',.0s');
const withSiPrefixZeroDecimalPlacesRegExp = new RegExp(`^(-|\\+)?(\\d+)(\\${decimalSeparator}(\\d+))?(.*)$`, 'i');
export const withSiPrefixZeroDecimalPlaces = d => {
  if (d == null) {
    d = 0;
  }
  if ((0 < d && d < 1) || (-1 < d && d < 0)) {
    return siPrefixZeroDecimalPlacesFormatRuleForSmallValues(d);
  }
  const s = siPrefixZeroDecimalPlacesFormatRule(d);
  const match = s.match(withSiPrefixZeroDecimalPlacesRegExp);

  const sign = match[1] || '';
  const major = match[2];
  const prefix = match[5];

  return `${sign}${major}${prefix}`;
};

const siPrefixThreeDecimalPlacesFormatRule = format(',.6s');
const withSiPrefixThreeDecimalPlacesRegExp = new RegExp(`^(-|\\+)?(\\d+)\\${decimalSeparator}(\\d+)(.*)$`, 'i');
export const withSiPrefixThreeDecimalPlaces = d => {
  const s = siPrefixThreeDecimalPlacesFormatRule(d);
  const match = s.match(withSiPrefixThreeDecimalPlacesRegExp);

  const sign = match[1] || '';
  const major = match[2];
  let minor = match[3];
  const prefix = match[4];

  while (minor.length < 3) {
    minor += '0';
  }

  if (minor.length > 3) {
    minor = minor.substring(0, 3);
  }

  return `${sign}${major}${decimalSeparator}${minor}${prefix}`;
};
export const siPrefix = {
  compact: withSiPrefixZeroDecimalPlaces,
  detailed: withSiPrefixThreeDecimalPlaces
};

export const siPrefixPerSecond = {
  compact: d => withSiPrefixZeroDecimalPlaces(d) + ' / sec',
  detailed: d => withSiPrefixThreeDecimalPlaces(d) + ' / sec'
};

export const withSiMultiplyPrefixZeroDecimalPlaces = d => withSiPrefixZeroDecimalPlaces(d | 0);
export const withSiMultiplyPrefixThreeDecimalPlaces = d => {
  if (d == null) {
    d = 0;
  }
  if (d < 1) {
    return d.toFixed(3);
  }
  return withSiPrefixThreeDecimalPlaces(d);
};
export const siMultiplyPrefix = {
  compact: withSiMultiplyPrefixZeroDecimalPlaces,
  detailed: withSiMultiplyPrefixThreeDecimalPlaces
};

// deprecated in favor of millis
export const msZeroDecimalPlaces = d => zeroDecimalPlaces(d) + 'ms';
export const msTwoDecimalPlaces = d => twoDecimalPlaces(d) + 'ms';
export const ms = {
  compact: msZeroDecimalPlaces,
  detailed: msTwoDecimalPlaces
};

export const muSecondsZeroDecimalPlaces = d => zeroDecimalPlaces(d) + 'µs';
export const muSecondsTwoDecimalPlaces = d => twoDecimalPlaces(d) + 'µs';
export const muSecondsToMillisZeroDecimalPlaces = d => zeroDecimalPlaces(d / 1000) + 'ms';
export const muSecondsToMillisTwoDecimalPlaces = d => twoDecimalPlaces(d / 1000) + 'ms';
export const muSecondsToMillis = {
  compact: muSecondsToMillisZeroDecimalPlaces,
  detailed: muSecondsToMillisTwoDecimalPlaces
};

export const hitRateZeroDecimalPlaces = d => (d < 0 ? 'No activity' : percentageZeroDecimalPlaces(d));
export const hitRateTwoDecimalPlaces = d => (d < 0 ? 'No activity' : percentageTwoDecimalPlaces(d));
export const hitRate = {
  compact: hitRateZeroDecimalPlaces,
  detailed: hitRateTwoDecimalPlaces
};

export const time = _ms => {
  if (_ms < 1) {
    return muSecondsZeroDecimalPlaces(_ms * 1000);
  }
  return msZeroDecimalPlaces(_ms);
};

export const timeNs = _ns => {
  const _ms = _ns / 1000000;
  return time(_ms);
};
export const nanos = {
  compact: timeNs,
  detailed: timeNs
};

export const bitReadableString = v => (v > 0 ? 'Yes' : 'No');

export const temperatureZeroDecimalPlaces = d => zeroDecimalPlaces(d) + '°C';
export const temperatureTwoDecimalPlaces = d => twoDecimalPlaces(d) + '°C';
export const temperature = {
  compact: temperatureZeroDecimalPlaces,
  detailed: temperatureTwoDecimalPlaces
};

export const health = {
  compact(v) {
    if (v === 1) {
      return 'Healthy';
    } else if (v === 0) {
      return 'Unhealthy';
    }
    return twoDecimalPlaces(v);
  },
  detailed(v) {
    if (v === 1) {
      return 'Healthy';
    } else if (v === 0) {
      return 'Unhealthy';
    }
    return twoDecimalPlaces(v);
  }
};

/**
 * Format a number of bytes to improve readability for humans. Turn a raw
 * number to something like 10 Mb or 834.5 Gb.
 *
 * @param {number} num - The amount on bytes that should be formatted.
 * @param {number} numberFormatter - The formatter to use when formatting the number. Defines
 *  decimal separators, number of decimal places etc.
 * @returns {string} Human readable amount of bytes, e.g. 10 Mb
 * @throws An error when the bytes are NaN
 */
function formatBytes(num, numberFormatter) {
  if (typeof num !== 'number' || isNaN(num)) {
    return numberFormatter(0) + ' B';
  }
  let exponent;
  let unit;
  const neg = num < 0;
  const units = ['B', 'kiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return (neg ? '-' : '') + numberFormatter(num) + ' B';
  }

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(byteBase)), units.length - 1);
  num = numberFormatter(num / Math.pow(byteBase, exponent));
  unit = units[exponent];

  return (neg ? '-' : '') + num + ' ' + unit;
}

const timeNanoUnits = [
  {
    unit: 'ns',
    range: 1000
  },
  {
    unit: 'µs',
    range: 1000
  },
  {
    unit: 'ms',
    range: 1000
  },
  {
    unit: 's',
    range: 60
  },
  {
    unit: 'min',
    range: 60
  },
  {
    unit: 'h',
    range: 24
  },
  {
    unit: 'd',
    range: Number.MAX_VALUE
  }
];
const timeMicroUnits = timeNanoUnits.slice(1);
const timeMilliUnits = timeNanoUnits.slice(2);
const timeSecondUnits = timeNanoUnits.slice(3);
const timeMinuteUnits = timeNanoUnits.slice(4);

/**
 * Format a time to improve readability for humans. Turn a raw
 * number to something like 10 ms or 30 s.
 *
 * @param {number} num - The amount on bytes that should be formatted
 * @returns {string} Human readable amount of time
 * @throws An error when the time are NaN
 */
function formatTime(t, units, formatNumber) {
  if (typeof t !== 'number' || isNaN(t)) {
    return '0µs';
  }

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    if (t < unit.range) {
      return formatNumber(t) + unit.unit;
    }

    t /= unit.range;
  }

  return formatNumber(t) + units[units.length - 1].unit;
}

function isMillisFormatter(numberFormatter) {
  return (
    numberFormatter === millis ||
    numberFormatter === millis.detailed ||
    numberFormatter === millis.compact ||
    numberFormatter === millis.fixedDetailed ||
    numberFormatter === millis.fixedCompact ||
    numberFormatter === ms ||
    numberFormatter === msZeroDecimalPlaces ||
    numberFormatter === msTwoDecimalPlaces
  );
}

function isMicrosFormatter(numberFormatter) {
  return (
    numberFormatter === micros ||
    numberFormatter === micros.detailed ||
    numberFormatter === micros.fixedDetailed ||
    numberFormatter === micros.compact ||
    numberFormatter === muSecondsToMillis
  );
}

function isSecondsFormatter(numberFormatter) {
  return (
    numberFormatter === seconds ||
    numberFormatter === seconds.fromMillisFixedDetailed ||
    numberFormatter === seconds.fixedCompact
  );
}

function isPercentageFormatter(numberFormatter) {
  return (
    numberFormatter === percentage ||
    numberFormatter === percentageZeroDecimalPlaces ||
    numberFormatter === percentageTwoDecimalPlaces ||
    numberFormatter === percentagePlain ||
    numberFormatter === percentagePlainZeroDecimalPlaces ||
    numberFormatter === percentagePlainTwoDecimalPlaces ||
    numberFormatter === hitRate
  );
}

function isRateFormatter(numberFormatter) {
  return numberFormatter === number.perSecond || numberFormatter === zeroDecimalPlacesPerSecond;
}

function isByteRateFormatter(numberFormatter) {
  return (
    numberFormatter === bytes.perSecond ||
    numberFormatter === bytesPerSecondZeroDecimalPlaces ||
    numberFormatter === bytesPerSecondTwoDecimalPlaces
  );
}

function isKiloByteRateFormatter(numberFormatter) {
  return (
    numberFormatter === kiloBytes.perSecond ||
    numberFormatter === kiloBytesZeroDecimalPlaces ||
    numberFormatter === kiloBytesTwoDecimalPlaces
  );
}

export function numberFormatterToFormatterType(numberFormatter) {
  if (isMillisFormatter(numberFormatter)) {
    return 'MILLIS';
  } else if (isMicrosFormatter(numberFormatter)) {
    return 'MICROS';
  } else if (isSecondsFormatter(numberFormatter)) {
    return 'SECONDS';
  } else if (isPercentageFormatter(numberFormatter)) {
    return 'PERCENTAGE';
  } else if (isRateFormatter(numberFormatter)) {
    return 'RATE';
  } else if (isByteRateFormatter(numberFormatter)) {
    return 'BYTE_RATE';
  } else if (isKiloByteRateFormatter(numberFormatter)) {
    return 'KILO_BYTE_RATE';
  } else if (numberFormatter === number) {
    return 'NUMBER';
  } else if (numberFormatter === bytes) {
    return 'BYTES';
  } else if (numberFormatter === kiloBytes) {
    return 'KILO_BYTES';
  } else {
    return 'UNDEFINED';
  }
}

export function valueWithFormatterToReadableString(value, valueFormat) {
  if (valueFormat === 'PERCENTAGE') {
    return percentage.compact(value);
  } else if (valueFormat === 'SECONDS') {
    return seconds.fixedCompact(value);
  } else if (valueFormat === 'MICROS') {
    return micros.compact(value);
  } else if (valueFormat === 'MILLIS') {
    return millis.compact(value);
  } else if (valueFormat === 'BYTES') {
    return bytes.detailed(value);
  } else if (valueFormat === 'KILO_BYTES') {
    return kiloBytes.detailed(value);
  } else if (valueFormat === 'BYTE_RATE') {
    return bytes.perSecond.detailed(value);
  } else if (valueFormat === 'KILO_BYTE_RATE') {
    return kiloBytes.perSecond.detailed(value);
  } else if (valueFormat === 'RATE') {
    return number.perSecond.detailed(value);
  }
  return value.toString();
}
