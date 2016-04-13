const timeFormats = [
  {
    maxMillis: 1000 * 60,
    formatter: formatTimeWithSeconds,
    stepSize: 1000 * 10,
    ceilToNearestStep: composeCeil(ceilToFullSecond)
  },
  {
    maxMillis: 1000 * 60 * 10,
    formatter: formatTime,
    stepSize: 1000 * 60,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute)
  },
  {
    maxMillis: 1000 * 60 * 60,
    formatter: formatTime,
    stepSize: 1000 * 60 * 5,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute)
  },
  {
    maxMillis: 1000 * 60 * 60 * 12,
    formatter: formatTime,
    stepSize: 1000 * 60 * 60,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour)
  },
  {
    maxMillis: 1000 * 60 * 60 * 24,
    formatter: formatTime,
    stepSize: 1000 * 60 * 60 * 2,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour)
  },
  {
    maxMillis: Number.MAX_VALUE,
    formatter(date) {
      return `${formatDate(date)} ${formatTime(date)}`;
    },
    stepSize: 1000 * 60 * 60 * 24,
    ceilToNearestStep: composeCeil(ceilToFullSecond, ceilToFullMinute, ceilToFullHour)
  }
];


export function getXAxisConfig(timerangeMillis) {
  for (let i = 0, len = timeFormats.length; i < len; i++) {
    const format = timeFormats[i];
    if (timerangeMillis <= format.maxMillis) {
      return format;
    }
  }
  throw new Error(`No x axis config known for time range: ${timerangeMillis}.`);
}


export function getTimeFormatter(timerangeMillis) {
  return getXAxisConfig(timerangeMillis).formatter;
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


function ceilToFullSecond(date) {
  const millis = date.getMilliseconds();
  if (millis > 0) {
    date.setMilliseconds(millis + 1000 - millis);
  }
}


function ceilToFullMinute(date) {
  const seconds = date.getSeconds();
  if (seconds > 0) {
    date.setSeconds(seconds + 60 - seconds);
  }
}


function ceilToFullHour(date) {
  const minutes = date.getMinutes();
  if (minutes > 0) {
    date.setMinutes(minutes + 60 - minutes);
  }
}
