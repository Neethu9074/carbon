import { formatTimeWithoutSeconds, formatTime, formatDateTime, formatDate } from 'in-services/formatters/date';
import { msZeroDecimalPlaces } from 'in-services/formatters/number';
import { days, hours, minutes, seconds } from 'in-services/time';

const timeFormats = [
  {
    maxMillis: 10,
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: 1,
    ceilToNearestStep: a => a
  },
  {
    maxMillis: 500,
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: 10,
    ceilToNearestStep: composeCeil(ceilTo10Millis)
  },
  {
    maxMillis: 1000,
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: 100,
    ceilToNearestStep: composeCeil(ceilTo100Millis)
  },
  {
    maxMillis: seconds.toMillis(30),
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: 1000,
    ceilToNearestStep: composeCeil(ceilToFullSecond)
  },
  {
    maxMillis: minutes.toMillis(5),
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: seconds.toMillis(10),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilTo10Seconds)
  },
  {
    maxMillis: minutes.toMillis(30),
    formatter: formatTimeWithoutSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: minutes.toMillis(1),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute)
  },
  {
    maxMillis: hours.toMillis(6),
    formatter: formatTimeWithoutSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: minutes.toMillis(5),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFiveMinuteStep)
  },
  {
    maxMillis: hours.toMillis(12),
    formatter: formatTimeWithoutSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: hours.toMillis(1),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour)
  },
  {
    maxMillis: days.toMillis(7),
    formatter: formatDateTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 90,
    stepSize: hours.toMillis(2),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour, ceilToTwoHourStep)
  },
  {
    maxMillis: days.toMillis(14),
    formatter: formatDate,
    expectLabelWidth: 70,
    relativeFormatter: msZeroDecimalPlaces,
    stepSize: days.toMillis(1),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour, ceilToFullDay)
  },
  {
    maxMillis: Number.MAX_VALUE,
    formatter: formatDate,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: days.toMillis(7),
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour, ceilToFullDay, ceilToStartOfWeek)
  }
];

export function getAxisConfig(timerangeMillis) {
  for (let i = 0, len = timeFormats.length; i < len; i++) {
    const format = timeFormats[i];
    if (timerangeMillis <= format.maxMillis) {
      return format;
    }
  }
  throw new Error(`No axis config known for time range: ${timerangeMillis}.`);
}

function composeCeil(...fns) {
  const fnCount = fns.length;
  return millis => {
    const date = new Date(millis);
    for (let i = 0; i < fnCount; i++) {
      fns[i](date);
    }
    return date.getTime();
  };
}

function ceilTo10Millis(date) {
  const millis = date.getMilliseconds();
  if (millis > 0) {
    date.setMilliseconds(millis + (10 - (millis % 10)));
  }
}

function ceilTo100Millis(date) {
  const millis = date.getMilliseconds();
  if (millis > 0) {
    date.setMilliseconds(millis + (100 - (millis % 100)));
  }
}

function ceilToFullSecond(date) {
  const millis = date.getMilliseconds();
  if (millis > 0) {
    date.setMilliseconds(millis + 1000 - millis);
  }
}

function ceilTo10Seconds(date) {
  const seconds = date.getSeconds();
  const mod = seconds % 10;
  if (mod !== 0) {
    date.setSeconds(seconds + 10 - mod);
  }
}

function ceilToFullMinute(date) {
  const seconds = date.getSeconds();
  if (seconds > 0) {
    date.setSeconds(seconds + 60 - seconds);
  }
}

function ceilToFiveMinuteStep(date) {
  const minutes = date.getMinutes();
  const remainder = minutes % 5;
  if (remainder !== 0) {
    date.setMinutes(minutes + 5 - remainder);
  }
}

function ceilToFullHour(date) {
  const minutes = date.getMinutes();
  if (minutes > 0) {
    date.setMinutes(minutes + 60 - minutes);
  }
}

function ceilToTwoHourStep(date) {
  const hours = date.getHours();
  const remainder = hours % 2;
  if (remainder !== 0) {
    date.setHours(hours + 2 - remainder);
  }
}

function ceilToFullDay(date) {
  const hours = date.getHours();
  if (hours > 0) {
    date.setHours(hours + 24 - hours);
  }
}

function ceilToStartOfWeek(date) {
  // Caution: Deliberately chosen getDay and getDate. There is no setDay in the Date
  // API.
  const daysOfWeek = date.getDay();
  if (daysOfWeek > 0) {
    date.setDate(date.getDate() + 7 - daysOfWeek);
  }
}
