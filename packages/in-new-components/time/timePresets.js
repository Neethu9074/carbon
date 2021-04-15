/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import moment from 'moment';

import { formatEnglishDurationAccurately, formatDurationAccurately } from 'in-services/formatters/date';
import { t, activeLanguage } from 'in-i18n';

const minute = 60 * 1000;
const hour = 60 * minute;
const twentyFourHours = 24 * hour;
const sevenDays = 7 * twentyFourHours;

export const fixedTimePickerPresets = [
  {
    to: null,
    windowSize: minute,
    label: t('in-new-components:time.lastMinute', { count: 1 })
  },
  {
    to: null,
    windowSize: minute * 5,
    label: t('in-new-components:time.lastMinute', { count: 5 })
  },
  {
    to: null,
    windowSize: minute * 10,
    label: t('in-new-components:time.lastMinute', { count: 10 })
  },
  {
    to: null,
    windowSize: minute * 30,
    label: t('in-new-components:time.lastMinute', { count: 30 })
  },
  {
    to: null,
    windowSize: hour,
    label: t('in-new-components:time.lastHour', { count: 1 })
  },
  {
    to: null,
    windowSize: hour * 6,
    label: t('in-new-components:time.lastHour', { count: 6 })
  },
  {
    to: null,
    windowSize: hour * 12,
    label: t('in-new-components:time.lastHour', { count: 12 })
  },
  {
    to: null,
    windowSize: hour * 24,
    label: t('in-new-components:time.lastHour', { count: 24 })
  }
];

export function getTimePresets() {
  moment.locale(activeLanguage);
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
  moment.locale(activeLanguage);
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
    label: t('in-new-components:time.yesterday'),
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
    label: t('in-new-components:time.twoDaysAgo'),
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
    label: t('in-new-components:time.lastSevenDays'),
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
    label: t('in-new-components:time.previousWeek'),
    description: `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${
      months[endOfWeek.getMonth()]
    } ${endOfWeek.getDate()}`,
    windowSize: sevenDays,
    to: endOfWeek.getTime()
  };
}

export function format(windowSize) {
  const result = `Last ${formatEnglishDurationAccurately(windowSize, 60000, false)}`;
  const match = result.match(/^Last 1 ([a-z]+)$/i);
  if (match && match[1] === 'day') {
    return t('in-new-components:time.timePresetsLast24Hours');
  } else if (match) {
    return t('in-new-components:time.timePresetsLast', {
      duration: t('in-new-components:time.timeUnit', { context: match[1] })
    });
  } else {
    return t('in-new-components:time.timePresetsLast', {
      duration: formatDurationAccurately(windowSize, 60000, false)
    });
  }
}
