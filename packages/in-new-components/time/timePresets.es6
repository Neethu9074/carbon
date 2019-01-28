import moment from 'moment';

import { lastSevenDaysTimePresetEnabled } from 'in-services/featureFlags';

const minute = 60 * 1000;
const hour = 60 * minute;
const twentyFourHours = 24 * hour;
const sevenDays = 7 * twentyFourHours;

const livePresets = [
  {
    windowSize: minute,
    to: null
  },
  {
    windowSize: minute * 5,
    to: null
  },
  {
    windowSize: minute * 10,
    to: null
  },
  {
    windowSize: minute * 30,
    to: null
  },
  {
    windowSize: hour,
    to: null
  },
  {
    windowSize: hour * 6,
    to: null
  },
  {
    windowSize: hour * 12,
    to: null
  },
  {
    windowSize: hour * 24,
    to: null
  }
];

if (lastSevenDaysTimePresetEnabled) {
  livePresets.push({
    windowSize: sevenDays,
    to: null
  });
}

export function getLivePresets() {
  return livePresets;
}

export function getFixedTimePresets() {
  return [
    getToday(),
    getYesterdayPreset(),
    getDayBeforeYesterdayPreset(),
    getThisWeekPreset(),
    getPreviousWeekPreset()
  ];
}

function getToday() {
  const to = moment()
    .startOf('day')
    .add(1, 'day')
    .toDate()
    .getTime();
  return {
    label: 'Today',
    windowSize: twentyFourHours,
    to
  };
}

function getYesterdayPreset() {
  const to = moment()
    .startOf('day')
    .toDate()
    .getTime();
  return {
    label: 'Yesterday',
    windowSize: twentyFourHours,
    to
  };
}

function getDayBeforeYesterdayPreset() {
  const to = moment()
    .startOf('day')
    .subtract(1, 'days')
    .toDate()
    .getTime();
  return {
    label: 'Day before Yesterday',
    windowSize: twentyFourHours,
    to
  };
}

function getThisWeekPreset() {
  const to = moment()
    .startOf('week')
    .add(1, 'week')
    .toDate()
    .getTime();
  return {
    label: 'This week',
    windowSize: sevenDays,
    to
  };
}

function getPreviousWeekPreset() {
  const to = moment()
    .startOf('week')
    .toDate()
    .getTime();
  return {
    label: 'Previous week',
    windowSize: sevenDays,
    to
  };
}
