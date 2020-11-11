import moment from 'moment';

import { formatDurationAccurately } from 'in-services/formatters/date';

const minute = 60 * 1000;
const hour = 60 * minute;
const twentyFourHours = 24 * hour;
const sevenDays = 7 * twentyFourHours;

export const fixedTimePickerPresets = [
  {
    to: null,
    windowSize: minute,
    label: format(minute)
  },
  {
    to: null,
    windowSize: minute * 5,
    label: format(minute * 5)
  },
  {
    to: null,
    windowSize: minute * 10,
    label: format(minute * 10)
  },
  {
    to: null,
    windowSize: minute * 30,
    label: format(minute * 30)
  },
  {
    to: null,
    windowSize: hour,
    label: format(hour)
  },
  {
    to: null,
    windowSize: hour * 6,
    label: format(hour * 6)
  },
  {
    to: null,
    windowSize: hour * 12,
    label: format(hour * 12)
  },
  {
    to: null,
    windowSize: hour * 24,
    label: format(hour * 24)
  }
];

export function getTimePresets() {
  const months = moment.monthsShort();
  return [
    ...fixedTimePickerPresets,
    getYesterdayPreset(months),
    getDayBeforeYesterdayPreset(months),
    getLastSevenDaysPreset(months),
    getPreviousWeekPreset(months)
  ];
}

export function getHistoricPresets() {
  const months = moment.monthsShort();
  return [
    getYesterdayPreset(months),
    getDayBeforeYesterdayPreset(months),
    getLastSevenDaysPreset(months),
    getPreviousWeekPreset(months)
  ];
}

function getYesterdayPreset(months) {
  const date = moment()
    .startOf('day')
    .subtract(1, 'days')
    .toDate();
  const from = date.getTime();
  return {
    label: 'Yesterday',
    description: `${months[date.getMonth()]} ${date.getDate()}`,
    windowSize: twentyFourHours,
    to: from + twentyFourHours
  };
}

function getDayBeforeYesterdayPreset(months) {
  const date = moment()
    .startOf('day')
    .subtract(2, 'days')
    .toDate();
  const to = date.getTime();
  return {
    label: '2 days ago',
    description: `${months[date.getMonth()]} ${date.getDate()}`,
    windowSize: twentyFourHours,
    to: to + twentyFourHours
  };
}

function getLastSevenDaysPreset(months) {
  const startOfWeek = moment()
    .subtract(7, 'days')
    .toDate();
  const endOfWeek = moment().toDate();
  return {
    label: 'Last 7 days',
    description: `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()}- ${
      months[endOfWeek.getMonth()]
    } ${endOfWeek.getDate()}`,
    windowSize: sevenDays,
    to: null
  };
}

function getPreviousWeekPreset(months) {
  const startOfWeek = moment()
    .startOf('week')
    .subtract(1, 'week')
    .add(1, 'days')
    .toDate();
  const endOfWeek = moment()
    .startOf('week')
    .toDate();
  return {
    label: 'Previous week',
    description: `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${
      months[endOfWeek.getMonth()]
    } ${endOfWeek.getDate()}`,
    windowSize: sevenDays,
    to: endOfWeek.getTime()
  };
}

export function format(windowSize) {
  const result = `Last ${formatDurationAccurately(windowSize, 60000, false)}`;
  const match = result.match(/^Last 1 ([a-z]+)$/i);
  if (match && match[1] === 'day') {
    return 'Last 24 hours';
  } else if (match) {
    return `Last ${match[1]}`;
  } else {
    return result;
  }
}
