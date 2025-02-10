/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  formatDefaultLocale as createCustomLocaleFormat,
  format,
  FormatLocaleDefinition,
  formatPrefix
} from 'd3-format';

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

const numberLocale = (!getSingle('formatNumbersAccordingToEnUs') && window.instana.numberLocale) || {};
const enUs: FormatLocaleDefinition = {
  decimal: '.',
  thousands: ',',
  grouping: [3],
  currency: ['$', '']
};
const localeFormat = {
  ...enUs, // default values should come from `en-US`
  ...numberLocale, // when there is a specific locale, use the FormatLocaleDefinition from https://github.com/d3/d3-format/tree/main/locale
  // d3-format uses unicode minus. Although this is typographically better, it would break copy-paste to other applications which do not support it
  // deliberately overriding it for all locales using hyphen
  // see https://observablehq.com/@d3/d3-format#cell-107
  minus: '-'
};
createCustomLocaleFormat(localeFormat);
export const byteBase = 1024;
export const decimalSeparator = localeFormat.decimal;
export const thousandsSeparator = localeFormat.thousands;

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

/**
 * SI Prefix formatter with fixed decimal places
 * @see https://d3js.org/d3-format#locale_formatPrefix
 * @param decimalPlaces number of desired decimal places
 * @example withSiPrefix(2)(1) => 1.00
 * @example withSiPrefix(4)(5.54) => 5.5400
 * @example withSiPrefix(4)(5540) => 5.5400k
 * @returns a formatter that takes a number and returns the value formatted using SI notation with the decimal places required
 */
const withSiPrefix = (decimalPlaces: number) => (d: number) => formatPrefix(',.' + decimalPlaces, d)(d);

export const withSiPrefixZeroDecimalPlaces = withSiPrefix(0);
export const withSiPrefixOneDecimalPlace = withSiPrefix(1);
export const withSiPrefixThreeDecimalPlaces = withSiPrefix(3);
export const siPrefix = markAsFormatterType(
  {
    compact: withSiPrefixZeroDecimalPlaces,
    detailed: withSiPrefixThreeDecimalPlaces
  },
  NUMBER_FORMATTER_TYPE
);

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

export const nanoSecondsZeroDecimalPlaces = (d: number) =>
  t('in-services:formatters.timeUnits', { context: 'ns', num: zeroDecimalPlaces(d) });
export const nanoSecondsTwoDecimalPlaces = (d: number) =>
  t('in-services:formatters.timeUnits', { context: 'ns', num: twoDecimalPlaces(d) });
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
  if (_ms * 1000 < 1) {
    return nanoSecondsZeroDecimalPlaces(_ms * 1000_000);
  }
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

  for (const unit of units) {
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
  for (const unit of units) {
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
