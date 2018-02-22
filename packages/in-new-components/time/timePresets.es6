import moment from 'moment';

const minute = 1000 * 60;
const hour = 60 * minute;

export function getLivePresets() {
  return [
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
}

export function getFixedTimePresets() {
  return [getYesterdayPreset(), getDayBeforeYesterdayPreset(), getThisWeekPreset(), getPreviousWeekPreset()];
}

function getYesterdayPreset() {
  const to = moment()
    .startOf('day')
    .toDate()
    .getTime();
  const from = moment(to)
    .subtract(1, 'days')
    .toDate()
    .getTime();
  return {
    label: 'Yesterday',
    windowSize: to - from,
    to
  };
}

function getDayBeforeYesterdayPreset() {
  const to = moment()
    .startOf('day')
    .subtract(1, 'days')
    .toDate()
    .getTime();
  const from = moment(to)
    .subtract(1, 'days')
    .toDate()
    .getTime();
  return {
    label: 'Day before Yesterday',
    windowSize: to - from,
    to
  };
}

function getThisWeekPreset() {
  const to = moment()
    .endOf('week')
    .toDate()
    .getTime();
  const from = moment(to)
    .subtract(1, 'weeks')
    .toDate()
    .getTime();
  return {
    label: 'This week',
    windowSize: to - from,
    to
  };
}

function getPreviousWeekPreset() {
  const to = moment()
    .startOf('week')
    .toDate()
    .getTime();
  const from = moment(to)
    .subtract(1, 'weeks')
    .toDate()
    .getTime();
  return {
    label: 'Previous week',
    windowSize: to - from,
    to
  };
}
