/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { format as defaultLocaleFormat, formatLocale as createCustomLocaleFormat } from 'd3-format';

import {
  resourceQuotaBytes,
  resourceQuotaPercentage
} from 'in-forge/plugins/kubernetesCluster/formatters/resourceQuota';
import { getSingle } from 'in-services/settings';
import { t } from 'in-i18n';

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
    compact: v => t('in-services:formatters.perSec', { num: zeroDecimalPlaces(v) }),
    detailed: v => t('in-services:formatters.perSec', { num: twoDecimalPlaces(v) })
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

export const activityZeroDecimalPlaces = d => (d < 0 ? t('in-services:formatters.noActivity') : zeroDecimalPlaces(d));
export const activityTwoDecimalPlaces = d => (d < 0 ? t('in-services:formatters.noActivity') : twoDecimalPlaces(d));
export const activity = {
  compact: activityZeroDecimalPlaces,
  detailed: activityTwoDecimalPlaces
};

export const zeroDecimalPlacesPerSecond = d => t('in-services:formatters.perSec', { num: zeroDecimalPlaces(d) });
export const twoDecimalPlacesPerSecond = d => t('in-services:formatters.perSec', { num: twoDecimalPlaces(d) });

export const percentageZeroDecimalPlaces = d =>
  t('in-services:formatters.percent', { num: zeroDecimalPlaces(d * 100) });
export const percentageTwoDecimalPlaces = d => t('in-services:formatters.percent', { num: twoDecimalPlaces(d * 100) });
export const percentage = {
  compact: percentageZeroDecimalPlaces,
  detailed: percentageTwoDecimalPlaces
};

export const percentagePlainZeroDecimalPlaces = d => t('in-services:formatters.percent', { num: zeroDecimalPlaces(d) });
export const percentagePlainTwoDecimalPlaces = d => t('in-services:formatters.percent', { num: twoDecimalPlaces(d) });
export const percentagePlain = {
  compact: percentagePlainZeroDecimalPlaces,
  detailed: percentagePlainTwoDecimalPlaces
};

export const bytesZeroDecimalPlaces = d => formatBytes(d, zeroDecimalPlaces);
export const bytesTwoDecimalPlaces = d => formatBytes(d, twoDecimalPlaces);
export const bytes = {
  compact: bytesZeroDecimalPlaces,
  detailed: bytesTwoDecimalPlaces,
  detailedWithRaw: v =>
    t('in-services:formatters.detailedBytes', {
      bytesTwoDecimalPlaces: bytesTwoDecimalPlaces(v),
      numCompact: number.compact(v)
    }),
  perSecond: {
    compact: v => t('in-services:formatters.perSec', { num: bytesZeroDecimalPlaces(v) }),
    detailed: v => t('in-services:formatters.perSec', { num: bytesTwoDecimalPlaces(v) })
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
  fixedCompact: v => t('in-services:formatters.timeUnits', { context: 'us', num: number.compact(v) }),
  detailed: timeByMicroTwoDecimalPlaces
};
export const millis = {
  compact: v => formatTime(v, timeMilliUnits, number.compact),
  fixedCompact: v => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) }),
  detailed: timeByMillisTwoDecimalPlaces,
  fixedDetailed: v => t('in-services:formatters.timeUnits', { context: 'ms', num: number.detailed(v) }),
  fixed: {
    compact: v => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) }),
    detailed: v => t('in-services:formatters.timeUnits', { context: 'ms', num: number.detailed(v) })
  },
  forcedFixedCompact: {
    compact: v => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) }),
    detailed: v => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) })
  },
  // 'ms' are always formatted to compact zero decimal format,
  // 's' and 'min' can have both compact and detailed formats
  forcedCompactOnMs: {
    compact: v => formatTime(v, timeMilliUnits, number.compact),
    detailed: v => (v < 1000 ? formatTime(v, timeMilliUnits, number.compact) : timeByMillisTwoDecimalPlaces(v))
  },
  // t < 999,999 - in milliseconds, always formatted to compact zero decimal format
  // t >= 1,000,000 - in seconds, can have both compact and detailed formats
  largeInSeconds: {
    compact: v =>
      v < 1000000
        ? t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) })
        : t('in-services:formatters.timeUnits', { context: 's', num: number.compact(v / 1000) }),
    detailed: v =>
      v < 1000000
        ? t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) })
        : t('in-services:formatters.timeUnits', { context: 's', num: number.detailed(v / 1000) })
  }
};
export const seconds = {
  detailed: v => formatTime(v, timeSecondUnits, number.detailed),
  fromMillisFixedDetailed: v => t('in-services:formatters.timeUnits', { context: 's', num: number.detailed(v / 1000) }),
  fixedDetailed: v => t('in-services:formatters.timeUnits', { context: 's', num: number.detailed(v) }),
  fixedCompact: v => t('in-services:formatters.timeUnits', { context: 's', num: number.compact(v) })
};
export const minutes = {
  compact: v => formatTime(v, timeMinuteUnits, number.compact),
  detailed: timeByMinutesTwoDecimalPlaces
};
export const millisToTwoDecimalSeconds = v => (v > 1000 ? millis.detailed(v) : millis.compact(v));

// call and beacon latency can be 0ms, we want to show '< 1ms' instead
function latencyFormatterWrapper(formatter) {
  return {
    compact: v => (v < 1 ? t('in-services:formatters.lt1ms') : formatter.compact(v)),
    detailed: v => (v < 1 ? t('in-services:formatters.lt1ms') : formatter.detailed(v))
  };
}

export const latency = latencyFormatterWrapper(millis.forcedCompactOnMs);
export const latencyFixed = latencyFormatterWrapper(millis.forcedFixedCompact);

// display '< 1ms' label for mean latency values between 0ms and 1ms
// exclude 0 because mean latency can be 0 when there are no calls
export function meanLatencyFormatterWrapper(formatter) {
  return {
    compact: v => (v > 0 && v < 1 ? t('in-services:formatters.lt1ms') : formatter.compact(v)),
    detailed: v => (v > 0 && v < 1 ? t('in-services:formatters.lt1ms') : formatter.detailed(v))
  };
}

export const meanLatency = meanLatencyFormatterWrapper(millis.forcedCompactOnMs);
export const meanLatencyFixed = meanLatencyFormatterWrapper(millis.forcedFixedCompact);
export const meanLatencyLargeInSeconds = meanLatencyFormatterWrapper(millis.largeInSeconds);

export const bytesPerSecondZeroDecimalPlaces = d =>
  t('in-services:formatters.perSec', { num: formatBytes(d, zeroDecimalPlaces) });
export const bytesPerSecondTwoDecimalPlaces = d =>
  t('in-services:formatters.perSec', { num: formatBytes(d, twoDecimalPlaces) });

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

export const millisPerSecondZeroDecimalPlaces = d =>
  t('in-services:formatters.perSec', { num: millis.fixedCompact(d * 1000) });

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

export const withSiPrefixOneDecimalPlace = d => {
  if (d < 1000 && d > -1000) {
    return `${d}`;
  }
  const s = siPrefixThreeDecimalPlacesFormatRule(d);
  const match = s.match(withSiPrefixThreeDecimalPlacesRegExp);

  const sign = match[1] || '';
  const major = match[2];
  let minor = match[3];
  const prefix = match[4];

  if (minor.length > 1) {
    minor = minor.substring(0, 1);
  }

  return `${sign}${major}${decimalSeparator}${minor}${prefix}`;
};

export const siPrefixPerSecond = {
  compact: d => t('in-services:formatters.perSec2', { num: withSiPrefixZeroDecimalPlaces(d) }),
  detailed: d => t('in-services:formatters.perSec2', { num: withSiPrefixThreeDecimalPlaces(d) })
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
export const msZeroDecimalPlaces = d =>
  t('in-services:formatters.timeUnits', { context: 'ms', num: zeroDecimalPlaces(d) });
export const msTwoDecimalPlaces = d =>
  t('in-services:formatters.timeUnits', { context: 'ms', num: twoDecimalPlaces(d) });
export const ms = {
  compact: msZeroDecimalPlaces,
  detailed: msTwoDecimalPlaces
};

export const muSecondsZeroDecimalPlaces = d =>
  t('in-services:formatters.timeUnits', { context: 'us', num: zeroDecimalPlaces(d) });
export const muSecondsTwoDecimalPlaces = d =>
  t('in-services:formatters.timeUnits', { context: 'us', num: twoDecimalPlaces(d) });
export const muSecondsToMillisZeroDecimalPlaces = d =>
  t('in-services:formatters.timeUnits', { context: 'ms', num: zeroDecimalPlaces(d / 1000) });
export const muSecondsToMillisTwoDecimalPlaces = d =>
  t('in-services:formatters.timeUnits', { context: 'ms', num: twoDecimalPlaces(d / 1000) });
export const muSecondsToMillis = {
  compact: muSecondsToMillisZeroDecimalPlaces,
  detailed: muSecondsToMillisTwoDecimalPlaces
};

export const hitRateZeroDecimalPlaces = d =>
  d < 0 ? t('in-services:formatters.noActivity') : percentageZeroDecimalPlaces(d);
export const hitRateTwoDecimalPlaces = d =>
  d < 0 ? t('in-services:formatters.noActivity') : percentageTwoDecimalPlaces(d);
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

export const bitReadableString = v => (v > 0 ? t('in-services:formatters.yes') : t('in-services:formatters.no'));

export const temperatureZeroDecimalPlaces = d => t('in-services:formatters.temperature', { num: zeroDecimalPlaces(d) });
export const temperatureTwoDecimalPlaces = d => t('in-services:formatters.temperature', { num: twoDecimalPlaces(d) });
export const temperature = {
  compact: temperatureZeroDecimalPlaces,
  detailed: temperatureTwoDecimalPlaces
};

export const health = {
  compact(v) {
    if (v === 1) {
      return t('in-services:formatters.healthy');
    } else if (v === 0) {
      return t('in-services:formatters.unhealthy');
    }
    return twoDecimalPlaces(v);
  },
  detailed(v) {
    if (v === 1) {
      return t('in-services:formatters.healthy');
    } else if (v === 0) {
      return t('in-services:formatters.unhealthy');
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
    return t('in-services:formatters.byteUnits', { context: 'B', num: numberFormatter(0) });
  }
  let exponent;
  let unit;
  const neg = num < 0;
  const units = ['B', 'kiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return t('in-services:formatters.byteUnits', { context: 'B', num: (neg ? '-' : '') + numberFormatter(num) });
  }

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(byteBase)), units.length - 1);
  num = numberFormatter(num / Math.pow(byteBase, exponent));
  unit = units[exponent];

  return t('in-services:formatters.byteUnits', { context: unit, num: (neg ? '-' : '') + num });
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
function formatTime(v, units, formatNumber) {
  if (typeof v !== 'number' || isNaN(v)) {
    return t('in-services:formatters.timeUnits', { context: 'us', num: 0 });
  }

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    if (v < unit.range) {
      return t('in-services:formatters.timeUnits', { context: unit.unit, num: formatNumber(v) });
    }

    v /= unit.range;
  }

  return t('in-services:formatters.timeUnits', { context: units[units.length - 1].unit, num: formatNumber(v) });
}

function isLatencyFormatter(numberFormatter) {
  return (
    numberFormatter === latency ||
    numberFormatter === latencyFixed ||
    numberFormatter === latency.compact ||
    numberFormatter === latency.detailed ||
    numberFormatter === latencyFixed.compact ||
    numberFormatter === latencyFixed.detailed ||
    isOfAnyFormatterFunction(numberFormatter, [
      latency.compact,
      latency.detailed,
      latencyFixed.compact,
      latencyFixed.detailed
    ])
  );
}

function isMillisFormatter(numberFormatter) {
  return (
    numberFormatter === millis ||
    numberFormatter === ms ||
    numberFormatter === millis.fixed ||
    numberFormatter === millis.forcedFixedCompact ||
    numberFormatter === millis.forcedCompactOnMs ||
    isOfAnyFormatterFunction(numberFormatter, [
      millis.detailed,
      millis.compact,
      millis.fixedDetailed,
      millis.fixedCompact,
      msZeroDecimalPlaces,
      msTwoDecimalPlaces
    ])
  );
}

function isMicrosFormatter(numberFormatter) {
  return (
    numberFormatter === micros ||
    numberFormatter === muSecondsToMillis ||
    isOfAnyFormatterFunction(numberFormatter, [micros.detailed, micros.fixedDetailed, micros.compact])
  );
}

function isSecondsFormatter(numberFormatter) {
  return (
    numberFormatter === seconds ||
    isOfAnyFormatterFunction(numberFormatter, [
      seconds.fromMillisFixedDetailed,
      seconds.fixedCompact,
      seconds.fixedDetailed,
      seconds.detailed
    ])
  );
}

export function isPercentageFormatter(numberFormatter) {
  return (
    numberFormatter === percentage ||
    numberFormatter === percentageZeroDecimalPlaces ||
    // For support of custom compact/detailed objects as found in
    // in-services/formatters/backendFormatter
    numberFormatter?.compact === percentageZeroDecimalPlaces ||
    numberFormatter === percentageTwoDecimalPlaces ||
    // For support of custom compact/detailed objects as found in
    // in-services/formatters/backendFormatter
    numberFormatter?.detailed === percentageTwoDecimalPlaces ||
    numberFormatter === percentagePlain ||
    numberFormatter === percentagePlainZeroDecimalPlaces ||
    numberFormatter === percentagePlainTwoDecimalPlaces ||
    numberFormatter === hitRate ||
    isOfAnyFormatterFunction(numberFormatter, [
      percentage.compact,
      percentage.detailed,
      percentagePlain.compact,
      percentagePlain.detailed,
      resourceQuotaPercentage
    ])
  );
}

function isRateFormatter(numberFormatter) {
  return (
    numberFormatter === number.perSecond || isOfAnyFormatterFunction(numberFormatter, [zeroDecimalPlacesPerSecond])
  );
}

function isByteRateFormatter(numberFormatter) {
  return (
    numberFormatter === bytes.perSecond ||
    isOfAnyFormatterFunction(numberFormatter, [bytesPerSecondZeroDecimalPlaces, bytesPerSecondTwoDecimalPlaces])
  );
}

function isNumberFormatter(numberFormatter) {
  return numberFormatter === number || isOfAnyFormatterFunction(numberFormatter, [number.detailed, number.compact]);
}

function isBytesFormatter(numberFormatter) {
  return (
    numberFormatter === bytes ||
    isOfAnyFormatterFunction(numberFormatter, [
      bytes.detailed,
      bytes.compact,
      bytes.detailedWithRaw,
      resourceQuotaBytes
    ])
  );
}

function isKiloBytesFormatter(numberFormatter) {
  return (
    numberFormatter === kiloBytes ||
    isOfAnyFormatterFunction(numberFormatter, [
      kiloBytes.detailed,
      kiloBytes.compact,
      kiloBytesTwoDecimalPlaces,
      kiloBytesZeroDecimalPlaces
    ])
  );
}

function isMegaBytesFormatter(numberFormatter) {
  return (
    numberFormatter === megaBytes ||
    isOfAnyFormatterFunction(numberFormatter, [
      megaBytes.detailed,
      megaBytes.compact,
      megaBytesTwoDecimalPlaces,
      megaBytesZeroDecimalPlaces
    ])
  );
}

/**
 * Checks whether the given formatter is one of the provided formatter functions, of the metric definition, that is
 * wrapped in an object in in-sdk/metrics/metricDefinitions if defined as a plain function.
 */
function isOfAnyFormatterFunction(numberFormatter, formatterFunctions) {
  if (
    typeof numberFormatter === 'object' &&
    typeof numberFormatter?.compact === 'function' &&
    typeof numberFormatter?.detailed === 'function'
  ) {
    return formatterFunctions.some(
      formatterFunction =>
        formatterFunction === numberFormatter.compact && formatterFunction === numberFormatter.detailed
    );
  }
  return false;
}

export function numberFormatterToFormatterType(numberFormatter) {
  if (isLatencyFormatter(numberFormatter)) {
    return 'LATENCY';
  } else if (isMillisFormatter(numberFormatter)) {
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
  } else if (isNumberFormatter(numberFormatter)) {
    return 'NUMBER';
  } else if (isBytesFormatter(numberFormatter)) {
    return 'BYTES';
  } else if (isKiloBytesFormatter(numberFormatter)) {
    return 'KILO_BYTES';
  } else if (isMegaBytesFormatter(numberFormatter)) {
    return 'MEGA_BYTES';
  } else {
    return 'UNDEFINED';
  }
}
