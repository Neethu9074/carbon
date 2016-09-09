import {msZeroDecimalPlaces} from 'in-services/formatters/number';

const timeFormats = [
  {
    maxMillis: 10,
    formatter: formatTimeWithSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 60,
    stepSize: 1,
    ceilToNearestStep: a => a
  },
  {
    maxMillis: 100,
    formatter: formatTimeWithSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 60,
    stepSize: 10,
    ceilToNearestStep: composeCeil(ceilTo10Millis)
  },
  {
    maxMillis: 1000,
    formatter: formatTimeWithSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 60,
    stepSize: 100,
    ceilToNearestStep: composeCeil(ceilTo100Millis)
  },
  {
    maxMillis: 1000 * 10,
    formatter: formatTimeWithSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 60,
    stepSize: 1000,
    ceilToNearestStep: composeCeil(ceilToFullSecond)
  },
  {
    maxMillis: 1000 * 60,
    formatter: formatTimeWithSeconds,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 60,
    stepSize: 1000 * 10,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilTo10Seconds)
  },
  {
    maxMillis: 1000 * 60 * 11,
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 30,
    stepSize: 1000 * 60,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute)
  },
  {
    maxMillis: 1000 * 60 * 60,
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 30,
    stepSize: 1000 * 60 * 5,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFiveMinuteStep)
  },
  {
    maxMillis: 1000 * 60 * 60 * 12,
    formatter: formatTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 30,
    stepSize: 1000 * 60 * 60,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour)
  },
  {
    maxMillis: 1000 * 60 * 60 * 24,
    formatter: formatDateTime,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 90,
    stepSize: 1000 * 60 * 60 * 2,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour, ceilToTwoHourStep)
  },
  {
    maxMillis: 1000 * 60 * 60 * 24 * 14,
    formatter: formatDate,
    expectLabelWidth: 70,
    relativeFormatter: msZeroDecimalPlaces,
    stepSize: 1000 * 60 * 60 * 24,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour, ceilToFullDay)
  },
  {
    maxMillis: Number.MAX_VALUE,
    formatter: formatDate,
    relativeFormatter: msZeroDecimalPlaces,
    expectLabelWidth: 70,
    stepSize: 1000 * 60 * 60 * 24 * 7,
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


function formatTimeWithSeconds(millis) {
  const date = new Date(millis);
  const hours = ensureTwoChars(date.getHours());
  const minutes = ensureTwoChars(date.getMinutes());
  const seconds = ensureTwoChars(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}


function formatTime(millis) {
  const date = new Date(millis);
  const hours = ensureTwoChars(date.getHours());
  const minutes = ensureTwoChars(date.getMinutes());
  return `${hours}:${minutes}`;
}


function formatDateTime(millis) {
  const date = new Date(millis);
  const year = date.getFullYear();
  const month = ensureTwoChars(date.getMonth() + 1);
  const day = ensureTwoChars(date.getDate());
  const hours = ensureTwoChars(date.getHours());
  const minutes = ensureTwoChars(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


function formatDate(millis) {
  const date = new Date(millis);
  const year = date.getFullYear();
  const month = ensureTwoChars(date.getMonth() + 1);
  const day = ensureTwoChars(date.getDate());
  return `${year}-${month}-${day}`;
}


function ensureTwoChars(s) {
  s = String(s);
  if (s.length === 1) {
    return `0${s}`;
  }
  return s;
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
    date.setMilliseconds(millis + (10 - millis % 10));
  }
}


function ceilTo100Millis(date) {
  const millis = date.getMilliseconds();
  if (millis > 0) {
    date.setMilliseconds(millis + (100 - millis % 100));
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
