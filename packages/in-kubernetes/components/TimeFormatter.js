/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */


var _dateFns = require('date-fns');

var _i18nReact = require('@instana/i18n-react');

var daysPerMonth = 30.38;

var millisTimeUnit = {
  long: 'milliseconds',
  short: 'ms',
  millis: 1
};

var i18nApiSupportedTimeUnits = [
  {
    long: 'years',
    short: 'y',
    millis: 12 * daysPerMonth * 24 * 60 * 60 * 1000
  },
  {
    long: 'months',
    short: 'mo',
    millis: daysPerMonth * 24 * 60 * 60 * 1000
  },
  {
    long: 'days',
    short: 'd',
    millis: 24 * 60 * 60 * 1000
  },
  {
    long: 'hours',
    short: 'h',
    millis: 60 * 60 * 1000
  },
  {
    long: 'minutes',
    short: 'm',
    millis: 60 * 1000
  },
  {
    long: 'seconds',
    short: 's',
    millis: 1000
  }
];

var extendedTimeUnits = [...i18nApiSupportedTimeUnits, millisTimeUnit];

export const formatDurationAccurately = (v, ignoreTimesSmallerThan = 999, useShort = true) => {
  var parts = formatDurationToParts(v, ignoreTimesSmallerThan, useShort);
  if (parts == null) {
    return parts;
  }
  // return only 3 units of time
  return parts.slice(0, 3).join(' ');
};

function formatDurationToParts(v, ignoreTimesSmallerThan = 60000, useShort = true) {
  if (v == null) {
    return v;
  } else if (typeof v === 'number' && isNaN(v)) {
    return null;
  }

  if (v < ignoreTimesSmallerThan) {
    return [
      (0, _i18nReact.t)('formatDate.date.time', `${v}${useShort ? millisTimeUnit.short : ' ' + millisTimeUnit.long}`, {
        context: useShort ? millisTimeUnit.short : millisTimeUnit.long,
        count: v
      })
    ];
  }

  var intervals = (0, _dateFns.intervalToDuration)({
    start: 0,
    end: v.valueOf()
  });
  return extendedTimeUnits
    .map(timeUnit => {
      if (!intervals[timeUnit.long] || timeUnit.millis < ignoreTimesSmallerThan) {
        return '';
      }
      var number = intervals[timeUnit.long];
      return (0, _i18nReact.t)('formatDate.date.time', `${number}${useShort ? timeUnit.short : ' ' + timeUnit.long}`, {
        context: useShort ? timeUnit.short : timeUnit.long,
        count: number
      });
    })
    .filter(Boolean);
}
