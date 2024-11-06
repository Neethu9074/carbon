/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { format as defaultLocaleFormat, formatLocale as createCustomLocaleFormat } from 'd3-format';

import { t } from '@instana/i18n-react';

import {
  markAsFormatterType,
  BYTE_RATE_FORMATTER_TYPE,
  BYTES_FORMATTER_TYPE,
  SI_BYTES_FORMATTER_TYPE,
  KILO_BYTES_FORMATTER_TYPE,
  LATENCY_FORMATTER_TYPE,
  MEGA_BYTES_FORMATTER_TYPE,
  MICROS_FORMATTER_TYPE,
  MILLIS_FORMATTER_TYPE,
  NUMBER_FORMATTER_TYPE,
  PERCENTAGE_FORMATTER_TYPE,
  RATE_FORMATTER_TYPE,
  SECONDS_FORMATTER_TYPE,
  MINUTES_FORMATTER_TYPE,
  NANOS_FORMATTER_TYPE,
  PERCENTAGE_100_FORMATTER_TYPE
} from 'in-services/formatters/number/types';
import { getSingle } from 'in-services/settings';

interface CompactAndDetailedFormatter {
  compact(v: number): string;
  detailed(v: number): string;
}

const isLocaleAware = !getSingle('formatNumbersAccordingToEnUs') && window.instana.numberLocale;
const format: (specifier: string) => (num: number) => string = isLocaleAware
  ? // @ts-expect-error type definition is not exact, and d3-format fully works even with undefined values for e.g. decimal
    // The external type definitions for d3-format are "incomplete".
    // Example:
    //   decimal? string | undefined (field in numberLocale)
    // won't match with
    //   decimal: string
    //
    // All good, because implementation is actually checking via:
    //   locale.decimal === undefined ? "." : locale.decimal + ""
    //
    // Verified for d3-format@1.4.5:
    createCustomLocaleFormat({
      ...window.instana.numberLocale,
      // Some languages have alternative numerals, e.g., east arabic.
      // https://en.wikipedia.org/wiki/Eastern_Arabic_numerals
      //
      // Some of our formatters have assumptions about these numbers.
      // In order to avoid breakage, we will just disable alternative
      // numeral characters. To be revisited in the future :)
      numerals: undefined
    }).format
  : defaultLocaleFormat;
export const byteBase = 1024;
export const decimalSeparator = (isLocaleAware && window.instana.numberLocale?.decimal) || '.';
export const thousandsSeparator = (isLocaleAware && window.instana.numberLocale?.thousands) || ',';

export const zeroDecimalPlaces = format(',.0f');
export const oneDecimalPlaces = format(',.1f');
export const twoDecimalPlaces = format(',.2f');
export const sevenDecimalPlaces = format(',.7f');
export const upToTwoDecimalPlaces = format(',.2~f');
export const fourDecimalPlaces = format(',.4f');
export const number = markAsFormatterType(
  {
    compact: zeroDecimalPlaces,
    short: oneDecimalPlaces,
    detailed: twoDecimalPlaces,
    perSecond: markAsFormatterType(
      {
        compact: (v: number) => t('in-services:formatters.perSec', { num: zeroDecimalPlaces(v) }),
        detailed: (v: number) => t('in-services:formatters.perSec', { num: twoDecimalPlaces(v) })
      },
      RATE_FORMATTER_TYPE
    ),
    forcedCompact: {
      compact: zeroDecimalPlaces,
      detailed: zeroDecimalPlaces
    },
    forcedDetailed: {
      compact: twoDecimalPlaces,
      detailed: twoDecimalPlaces
    }
  },
  NUMBER_FORMATTER_TYPE
);

export const scale = markAsFormatterType(
  {
    compact: (v: number) => twoDecimalPlaces(v / 10000),
    detailed: (v: number) => sevenDecimalPlaces(v / 10000)
  },
  NUMBER_FORMATTER_TYPE
);

export const positiveNumber = (v: number) => (v > 0 ? v : '-');

export const activityZeroDecimalPlaces = (d: number) =>
  d < 0 ? t('in-services:formatters.noActivity') : zeroDecimalPlaces(d);
export const activityTwoDecimalPlaces = (d: number) =>
  d < 0 ? t('in-services:formatters.noActivity') : twoDecimalPlaces(d);
export const activity = markAsFormatterType(
  {
    compact: activityZeroDecimalPlaces,
    detailed: activityTwoDecimalPlaces
  },
  NUMBER_FORMATTER_TYPE
);

export const zeroDecimalPlacesPerSecond = markAsFormatterType(
  d => t('in-services:formatters.perSec', { num: zeroDecimalPlaces(d) }),
  RATE_FORMATTER_TYPE
);
export const twoDecimalPlacesPerSecond = markAsFormatterType(
  d => t('in-services:formatters.perSec', { num: twoDecimalPlaces(d) }),
  RATE_FORMATTER_TYPE
);

export const percentageZeroDecimalPlaces = (d: number) =>
  t('in-services:formatters.percent', { num: zeroDecimalPlaces(d * 100) });
export const percentageTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.percent', { num: twoDecimalPlaces(d * 100) });
export const percentageUpToTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.percent', { num: upToTwoDecimalPlaces(d * 100) });
export const percentage = markAsFormatterType(
  {
    compact: percentageZeroDecimalPlaces,
    detailed: percentageTwoDecimalPlaces,
    short: percentageUpToTwoDecimalPlaces
  },
  PERCENTAGE_FORMATTER_TYPE
);

export const percentagePlainZeroDecimalPlaces = (d: number) =>
  t('in-services:formatters.percent', { num: zeroDecimalPlaces(d) });
export const percentagePlainTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.percent', { num: twoDecimalPlaces(d) });
export const percentagePlain = markAsFormatterType(
  {
    compact: percentagePlainZeroDecimalPlaces,
    detailed: percentagePlainTwoDecimalPlaces
  },
  PERCENTAGE_100_FORMATTER_TYPE
);

export const bytesZeroDecimalPlaces = (d: number) => formatBytes(d, zeroDecimalPlaces, false);
export const bytesTwoDecimalPlaces = (d: number) => formatBytes(d, twoDecimalPlaces, false);
export const siBytesZeroDecimalPlaces = (d: number) => formatBytes(d, zeroDecimalPlaces, true);
export const siBytesTwoDecimalPlaces = (d: number) => formatBytes(d, twoDecimalPlaces, true);

export const bytes = markAsFormatterType(
  {
    compact: bytesZeroDecimalPlaces,
    detailed: bytesTwoDecimalPlaces,
    detailedWithRaw: markAsFormatterType(
      (v: number) =>
        t('in-services:formatters.detailedBytes', {
          bytesTwoDecimalPlaces: bytesTwoDecimalPlaces(v),
          numCompact: number.compact(v)
        }),
      BYTES_FORMATTER_TYPE
    ),
    perSecond: markAsFormatterType(
      {
        compact: (v: number) => t('in-services:formatters.perSec', { num: bytesZeroDecimalPlaces(v) }),
        detailed: (v: number) => t('in-services:formatters.perSec', { num: bytesTwoDecimalPlaces(v) })
      },
      BYTE_RATE_FORMATTER_TYPE
    )
  },
  BYTES_FORMATTER_TYPE
);
export const siBytes = markAsFormatterType(
  {
    compact: siBytesZeroDecimalPlaces,
    detailed: siBytesTwoDecimalPlaces,
    detailedWithRaw: markAsFormatterType(
      (v: number) =>
        t('in-services:formatters.detailedBytes', {
          siBytesTwoDecimalPlaces: siBytesTwoDecimalPlaces(v),
          numCompact: number.compact(v)
        }),
      SI_BYTES_FORMATTER_TYPE
    ),
    perSecond: markAsFormatterType(
      {
        compact: (v: number) => t('in-services:formatters.perSec', { num: siBytesZeroDecimalPlaces(v) }),
        detailed: (v: number) => t('in-services:formatters.perSec', { num: siBytesTwoDecimalPlaces(v) })
      },
      BYTE_RATE_FORMATTER_TYPE
    )
  },
  SI_BYTES_FORMATTER_TYPE
);

export const timeByNanoTwoDecimalPlaces = (t: number) => formatTime(t, timeNanoUnits, number.detailed);
export const timeByMicroTwoDecimalPlaces = (t: number) => formatTime(t, timeMicroUnits, number.detailed);
export const timeByMillisZeroDecimalPlaces = (t: number) => formatTime(t, timeMilliUnits, number.compact);
export const timeByMillisTwoDecimalPlaces = (t: number) => formatTime(t, timeMilliUnits, number.detailed);
export const timeByMillisFourDecimalPlaces = (t: number) => formatTime(t, timeMilliUnits, fourDecimalPlaces);
export const timeBySecondsTwoDecimalPlaces = (t: number) => formatTime(t, timeSecondUnits, number.compact);
export const timeByMinutesTwoDecimalPlaces = (t: number) => formatTime(t, timeMinuteUnits, number.detailed);
export const micros = markAsFormatterType(
  {
    compact: t => formatTime(t, timeMicroUnits, number.compact),
    fixedCompact: markAsFormatterType(
      (v: number) => t('in-services:formatters.timeUnits', { context: 'us', num: number.compact(v) }),
      MICROS_FORMATTER_TYPE
    ),
    detailed: timeByMicroTwoDecimalPlaces
  },
  MICROS_FORMATTER_TYPE
);
export const millis = markAsFormatterType(
  {
    compact: (v: number) => formatTime(v, timeMilliUnits, number.compact),
    fixedCompact: markAsFormatterType(
      (v: number) => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) }),
      MILLIS_FORMATTER_TYPE
    ),
    varying: (v: number) => conditionallyFormatTimeValues(v, timeMilliUnits),
    detailed: timeByMillisTwoDecimalPlaces,
    fixedDetailed: markAsFormatterType(
      (v: number) => t('in-services:formatters.timeUnits', { context: 'ms', num: number.detailed(v) }),
      MILLIS_FORMATTER_TYPE
    ),
    fixed: markAsFormatterType(
      {
        compact: (v: number) => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) }),
        detailed: (v: number) => t('in-services:formatters.timeUnits', { context: 'ms', num: number.detailed(v) })
      },
      MILLIS_FORMATTER_TYPE
    ),
    forcedFixedCompact: markAsFormatterType(
      {
        compact: (v: number) => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) }),
        detailed: (v: number) => t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) })
      },
      MILLIS_FORMATTER_TYPE
    ),
    // 'ms' are always formatted to compact zero decimal format,
    // 's' and 'min' can have both compact and detailed formats
    forcedCompactOnMs: markAsFormatterType(
      {
        compact: (v: number) => formatTime(v, timeMilliUnits, number.compact),
        detailed: (v: number) =>
          v < 1000 ? formatTime(v, timeMilliUnits, number.compact) : timeByMillisTwoDecimalPlaces(v)
      },
      MILLIS_FORMATTER_TYPE
    ),
    // t < 999,999 - in milliseconds, always formatted to compact zero decimal format
    // t >= 1,000,000 - in seconds, can have both compact and detailed formats
    largeInSeconds: {
      compact: (v: number) =>
        v < 1000000
          ? t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) })
          : t('in-services:formatters.timeUnits', { context: 's', num: number.compact(v / 1000) }),
      detailed: (v: number) =>
        v < 1000000
          ? t('in-services:formatters.timeUnits', { context: 'ms', num: number.compact(v) })
          : t('in-services:formatters.timeUnits', { context: 's', num: number.detailed(v / 1000) })
    }
  },
  MILLIS_FORMATTER_TYPE
);
export const seconds = markAsFormatterType(
  {
    detailed: (v: number) => formatTime(v, timeSecondUnits, number.detailed),
    fromMillisFixedDetailed: markAsFormatterType(
      (v: number) => t('in-services:formatters.timeUnits', { context: 's', num: number.detailed(v / 1000) }),
      SECONDS_FORMATTER_TYPE
    ),
    fixedDetailed: markAsFormatterType(
      (v: number) => t('in-services:formatters.timeUnits', { context: 's', num: number.detailed(v) }),
      SECONDS_FORMATTER_TYPE
    ),
    fixedCompact: markAsFormatterType(
      (v: number) => t('in-services:formatters.timeUnits', { context: 's', num: number.compact(v) }),
      SECONDS_FORMATTER_TYPE
    )
  },
  SECONDS_FORMATTER_TYPE
);
export const minutes = {
  compact: (v: number) => formatTime(v, timeMinuteUnits, number.compact),
  fixedCompact: markAsFormatterType(
    (v: number) => t('in-services:formatters.timeUnits', { context: 'min', num: number.compact(v) }),
    MINUTES_FORMATTER_TYPE
  ),
  detailed: timeByMinutesTwoDecimalPlaces
};
export const millisToTwoDecimalSeconds = (v: number) => (v > 1000 ? millis.detailed(v) : millis.compact(v));

// call and beacon latency can be 0ms, we want to show '< 1ms' instead
function latencyFormatterWrapper(formatter: CompactAndDetailedFormatter) {
  return {
    compact: (v: number) => (v < 1 ? t('in-services:formatters.lt1ms') : formatter.compact(v)),
    detailed: (v: number) => (v < 1 ? t('in-services:formatters.lt1ms') : formatter.detailed(v))
  };
}

export const latency = markAsFormatterType(latencyFormatterWrapper(millis.forcedCompactOnMs), LATENCY_FORMATTER_TYPE);
export const latencyFixed = markAsFormatterType(
  latencyFormatterWrapper(millis.forcedFixedCompact),
  LATENCY_FORMATTER_TYPE
);

// display '< 1ms' label for mean latency values between 0ms and 1ms
// exclude 0 because mean latency can be 0 when there are no calls
export function meanLatencyFormatterWrapper(formatter: CompactAndDetailedFormatter) {
  return {
    compact: (v: number) => (v > 0 && v < 1 ? t('in-services:formatters.lt1ms') : formatter.compact(v)),
    detailed: (v: number) => (v > 0 && v < 1 ? t('in-services:formatters.lt1ms') : formatter.detailed(v))
  };
}

export const meanLatency = meanLatencyFormatterWrapper(millis.forcedCompactOnMs);
export const meanLatencyFixed = meanLatencyFormatterWrapper(millis.forcedFixedCompact);
export const meanLatencyLargeInSeconds = meanLatencyFormatterWrapper(millis.largeInSeconds);

export const bytesPerSecondZeroDecimalPlaces = markAsFormatterType(
  d => t('in-services:formatters.perSec', { num: formatBytes(d, zeroDecimalPlaces, false) }),
  BYTE_RATE_FORMATTER_TYPE
);
export const bytesPerSecondTwoDecimalPlaces = markAsFormatterType(
  d => t('in-services:formatters.perSec', { num: formatBytes(d, twoDecimalPlaces, false) }),
  BYTE_RATE_FORMATTER_TYPE
);

export const kiloBytesZeroDecimalPlaces = markAsFormatterType(
  d => formatBytes(d * byteBase, zeroDecimalPlaces, false),
  KILO_BYTES_FORMATTER_TYPE
);
export const kiloBytesTwoDecimalPlaces = markAsFormatterType(
  d => formatBytes(d * byteBase, twoDecimalPlaces, false),
  KILO_BYTES_FORMATTER_TYPE
);
export const kiloBytes = markAsFormatterType(
  {
    compact: kiloBytesZeroDecimalPlaces,
    detailed: kiloBytesTwoDecimalPlaces
  },
  KILO_BYTES_FORMATTER_TYPE
);

export const megaBytesZeroDecimalPlaces = markAsFormatterType(
  d => formatBytes(d * byteBase * byteBase, zeroDecimalPlaces, false),
  MEGA_BYTES_FORMATTER_TYPE
);
export const megaBytesTwoDecimalPlaces = markAsFormatterType(
  d => formatBytes(d * byteBase * byteBase, twoDecimalPlaces, false),
  MEGA_BYTES_FORMATTER_TYPE
);
export const megaBytes = markAsFormatterType(
  {
    compact: megaBytesZeroDecimalPlaces,
    detailed: megaBytesTwoDecimalPlaces
  },
  MEGA_BYTES_FORMATTER_TYPE
);

export const millisPerSecondZeroDecimalPlaces = markAsFormatterType(
  (d: number) => t('in-services:formatters.perSec', { num: millis.fixedCompact(d * 1000) }),
  RATE_FORMATTER_TYPE
);

const siPrefixZeroDecimalPlacesFormatRule = format(',.3s');
const siPrefixZeroDecimalPlacesFormatRuleForSmallValues = format(',.0s');
const withSiPrefixZeroDecimalPlacesRegExp = new RegExp(`^(-|\\+)?(\\d+)(\\${decimalSeparator}(\\d+))?(.*)$`, 'i');
export const withSiPrefixZeroDecimalPlaces = (d: number) => {
  if (d == null) {
    d = 0;
  }
  if ((0 < d && d < 1) || (-1 < d && d < 0)) {
    return siPrefixZeroDecimalPlacesFormatRuleForSmallValues(d);
  }
  const s = siPrefixZeroDecimalPlacesFormatRule(d);
  const match = s.match(withSiPrefixZeroDecimalPlacesRegExp);
  if (!match) {
    return '';
  }

  const sign = match[1] || '';
  const major = match[2];
  const prefix = match[5];

  return `${sign}${major}${prefix}`;
};

const siPrefixThreeDecimalPlacesFormatRule = format(',.6s');
const withSiPrefixThreeDecimalPlacesRegExp = new RegExp(`^(-|\\+)?(\\d+)\\${decimalSeparator}(\\d+)(.*)$`, 'i');
export const withSiPrefixThreeDecimalPlaces = (d: number) => {
  const s = siPrefixThreeDecimalPlacesFormatRule(d);
  const match = s.match(withSiPrefixThreeDecimalPlacesRegExp);
  if (!match) {
    return `${d}`;
  }

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
export const siPrefix = markAsFormatterType(
  {
    compact: withSiPrefixZeroDecimalPlaces,
    detailed: withSiPrefixThreeDecimalPlaces
  },
  NUMBER_FORMATTER_TYPE
);

export const withSiPrefixOneDecimalPlace = (d: number) => {
  if (d < 1000 && d > -1000) {
    return `${d}`;
  }
  const s = siPrefixThreeDecimalPlacesFormatRule(d);
  const match = s.match(withSiPrefixThreeDecimalPlacesRegExp);
  if (!match) {
    return `${d}`;
  }

  const sign = match[1] || '';
  const major = match[2];
  let minor = match[3];
  const prefix = match[4];

  if (minor.length > 1) {
    minor = minor.substring(0, 1);
  }

  return `${sign}${major}${decimalSeparator}${minor}${prefix}`;
};

export const siPrefixPerSecond = markAsFormatterType(
  {
    compact: (d: number) => t('in-services:formatters.perSec2', { num: withSiPrefixZeroDecimalPlaces(d) }),
    detailed: (d: number) => t('in-services:formatters.perSec2', { num: withSiPrefixThreeDecimalPlaces(d) })
  },
  RATE_FORMATTER_TYPE
);

export const withSiMultiplyPrefixZeroDecimalPlaces = (d: number) => withSiPrefixZeroDecimalPlaces(d | 0);
export const withSiMultiplyPrefixThreeDecimalPlaces = (d: number) => {
  if (d == null) {
    d = 0;
  }
  if (d < 1) {
    return d.toFixed(3);
  }
  return withSiPrefixThreeDecimalPlaces(d);
};
export const siMultiplyPrefix = markAsFormatterType(
  {
    compact: withSiMultiplyPrefixZeroDecimalPlaces,
    detailed: withSiMultiplyPrefixThreeDecimalPlaces
  },
  NUMBER_FORMATTER_TYPE
);

// deprecated in favor of millis
export const msZeroDecimalPlaces = markAsFormatterType(
  d => t('in-services:formatters.timeUnits', { context: 'ms', num: zeroDecimalPlaces(d) }),
  MILLIS_FORMATTER_TYPE
);
export const msTwoDecimalPlaces = markAsFormatterType(
  d => t('in-services:formatters.timeUnits', { context: 'ms', num: twoDecimalPlaces(d) }),
  MILLIS_FORMATTER_TYPE
);
export const ms = markAsFormatterType(
  {
    compact: msZeroDecimalPlaces,
    detailed: msTwoDecimalPlaces
  },
  MILLIS_FORMATTER_TYPE
);

export const muSecondsZeroDecimalPlaces = (d: number) =>
  t('in-services:formatters.timeUnits', { context: 'us', num: zeroDecimalPlaces(d) });
export const muSecondsTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.timeUnits', { context: 'us', num: twoDecimalPlaces(d) });
export const muSecondsToMillisZeroDecimalPlaces = (d: number) =>
  t('in-services:formatters.timeUnits', { context: 'ms', num: zeroDecimalPlaces(d / 1000) });
export const muSecondsToMillisTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.timeUnits', { context: 'ms', num: twoDecimalPlaces(d / 1000) });
export const muSecondsToMillis = markAsFormatterType(
  {
    compact: muSecondsToMillisZeroDecimalPlaces,
    detailed: muSecondsToMillisTwoDecimalPlaces
  },
  MICROS_FORMATTER_TYPE
);

export const hitRateZeroDecimalPlaces = (d: number) =>
  d < 0 ? t('in-services:formatters.noActivity') : percentageZeroDecimalPlaces(d);
export const hitRateTwoDecimalPlaces = (d: number) =>
  d < 0 ? t('in-services:formatters.noActivity') : percentageTwoDecimalPlaces(d);
export const hitRate = markAsFormatterType(
  {
    compact: hitRateZeroDecimalPlaces,
    detailed: hitRateTwoDecimalPlaces
  },
  PERCENTAGE_FORMATTER_TYPE
);

export const time = (_ms: number) => {
  if (_ms < 1) {
    return muSecondsZeroDecimalPlaces(_ms * 1000);
  }
  return msZeroDecimalPlaces(_ms);
};

export const timeNs = (_ns: number) => {
  const _ms = _ns / 1000000;
  return time(_ms);
};
export const nanos = markAsFormatterType(
  {
    compact: timeNs,
    detailed: timeNs
  },
  NANOS_FORMATTER_TYPE
);

export const bitReadableString = (v: number) =>
  v > 0 ? t('in-services:formatters.yes') : t('in-services:formatters.no');

export const temperatureZeroDecimalPlaces = (d: number) =>
  t('in-services:formatters.temperature', { num: zeroDecimalPlaces(d) });
export const temperatureTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.temperature', { num: twoDecimalPlaces(d) });
export const temperature = {
  compact: temperatureZeroDecimalPlaces,
  detailed: temperatureTwoDecimalPlaces
};

export const health = markAsFormatterType(
  {
    compact(v: number) {
      if (v === 1) {
        return t('in-services:formatters.healthy');
      } else if (v === 0) {
        return t('in-services:formatters.unhealthy');
      }
      return twoDecimalPlaces(v);
    },
    detailed(v: number) {
      if (v === 1) {
        return t('in-services:formatters.healthy');
      } else if (v === 0) {
        return t('in-services:formatters.unhealthy');
      }
      return twoDecimalPlaces(v);
    }
  },
  NUMBER_FORMATTER_TYPE
);

/**
 * Format a number of bytes to improve readability for humans. Turn a raw
 * number to something like 10 Mb or 834.5 Gb.
 *
 * @param {number} num - The amount on bytes that should be formatted.
 * @param {number} numberFormatter - The formatter to use when formatting the number. Defines
 *  decimal separators, number of decimal places etc.
 * @param {boolean} siMode - Set to 'true' to run in SI mode.
 * @returns {string} Human readable amount of bytes, e.g. 10 Mb
 * @throws An error when the bytes are NaN
 */
function formatBytes(num: number, numberFormatter: (v: number) => string, siMode: boolean) {
  if (typeof num !== 'number' || isNaN(num)) {
    return t('in-services:formatters.byteUnits', { context: 'B', num: numberFormatter(0) });
  }
  let exponent;
  let unit;
  const neg = num < 0;
  const binaryUnits = ['B', 'kiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  const siUnits = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const base = siMode ? 1000 : byteBase;
  const units = siMode ? siUnits : binaryUnits;

  if (neg) {
    num = -num;
  }

  if (num < 1) {
    return t('in-services:formatters.byteUnits', { context: 'B', num: (neg ? '-' : '') + numberFormatter(num) });
  }

  exponent = Math.min(Math.floor(Math.log(num) / Math.log(base)), units.length - 1);
  const numberString = numberFormatter(num / Math.pow(base, exponent));
  unit = units[exponent];

  return t('in-services:formatters.byteUnits', { context: unit, num: (neg ? '-' : '') + numberString });
}

interface TimeUnit {
  unit: string;
  range: number;
}

const timeNanoUnits: TimeUnit[] = [
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
 */
function formatTime(v: number, units: TimeUnit[], formatNumber: (v: number) => string) {
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

function conditionallyFormatTimeValues(v: number, units: TimeUnit[]) {
  let formatNumber: any;
  if (typeof v !== 'number' || isNaN(v)) {
    return t('in-services:formatters.timeUnits', { context: 'us', num: 0 });
  }
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (v.toString().split('.')[0].length > 2) {
      formatNumber = number.compact;
    } else {
      formatNumber = v.toString().split('.')[0].length === 1 ? number.detailed : number.short;
    }
    if (v < unit.range) {
      return t('in-services:formatters.timeUnits', { context: unit.unit, num: formatNumber(v) });
    }
    v /= unit.range;
  }
  return t('in-services:formatters.timeUnits', { context: units[units.length - 1].unit, num: formatNumber(v) });
}
