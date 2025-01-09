/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { addDays, startOfDay, startOfWeek, subDays, subWeeks } from 'date-fns';
import { secondsToMilliseconds } from 'date-fns';

import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { t } from 'in-i18n';

const minute = secondsToMilliseconds(60);
const hour = 60 * minute;
const twentyFourHours = 24 * hour;
const sevenDays = 7 * twentyFourHours;

export const fixedTimePickerPresets = [
  {
    to: null,
    windowSize: minute,
    label: t('in-components:time.lastMinute', { count: 1 })
  },
  {
    to: null,
    windowSize: minute * 5,
    label: t('in-components:time.lastMinute', { count: 5 })
  },
  {
    to: null,
    windowSize: minute * 10,
    label: t('in-components:time.lastMinute', { count: 10 })
  },
  {
    to: null,
    windowSize: minute * 30,
    label: t('in-components:time.lastMinute', { count: 30 })
  },
  {
    to: null,
    windowSize: hour,
    label: t('in-components:time.lastHour', { count: 1 })
  },
  {
    to: null,
    windowSize: hour * 6,
    label: t('in-components:time.lastHour', { count: 6 })
  },
  {
    to: null,
    windowSize: hour * 12,
    label: t('in-components:time.lastHour', { count: 12 })
  },
  {
    to: null,
    windowSize: hour * 24,
    label: t('in-components:time.lastHour', { count: 24 })
  }
];

export function formatRequestedTime(to: number | null | undefined, windowSize: number) {
  if (to === null) {
    to = Date.now();
  }

  const days = Math.floor(windowSize / twentyFourHours);
  const hours = Math.floor((windowSize % twentyFourHours) / hour);
  const minutes = Math.floor((windowSize % hour) / minute);

  const formattedTime = `${days}d ${hours}h ${minutes}m`;

  return formattedTime;
}

export function getTimePresets() {
  return [
    ...fixedTimePickerPresets,
    getYesterdayPreset(),
    getDayBeforeYesterdayPreset(),
    getLastSevenDaysPreset(),
    getPreviousWeekPreset()
  ];
}

export function getHistoricPresets() {
  return [getYesterdayPreset(), getDayBeforeYesterdayPreset(), getLastSevenDaysPreset(), getPreviousWeekPreset()];
}

function getYesterdayPreset() {
  const date = subDays(startOfDay(new Date()), 1);
  const from = date.getTime();

  return {
    label: t('in-components:time.yesterday'),
    description: `${formatDateWithActiveLanguage(date, 'LLL')} ${date.getDate()}`,
    windowSize: twentyFourHours,
    to: from + twentyFourHours
  };
}

function getDayBeforeYesterdayPreset() {
  const date = subDays(startOfDay(new Date()), 2);
  const to = date.getTime();

  return {
    label: t('in-components:time.twoDaysAgo'),
    description: `${formatDateWithActiveLanguage(date, 'LLL')} ${date.getDate()}`,
    windowSize: twentyFourHours,
    to: to + twentyFourHours
  };
}

function getLastSevenDaysPreset() {
  const currentDate = new Date();
  const aWeekAgo = subDays(currentDate, 7);

  return {
    label: t('in-components:time.lastSevenDays'),
    description: `${formatDateWithActiveLanguage(
      aWeekAgo,
      'LLL'
    )} ${aWeekAgo.getDate()}- ${formatDateWithActiveLanguage(currentDate, 'LLL')} ${currentDate.getDate()}`,
    windowSize: sevenDays,
    to: null
  };
}

function getPreviousWeekPreset() {
  const endOfWeek = startOfWeek(new Date());
  const beginningOfWeek = addDays(subWeeks(endOfWeek, 1), 1);

  return {
    label: t('in-components:time.previousWeek'),
    description: `${formatDateWithActiveLanguage(
      beginningOfWeek,
      'LLL'
    )} ${beginningOfWeek.getDate()} - ${formatDateWithActiveLanguage(endOfWeek, 'LLL')} ${endOfWeek.getDate()}`,
    windowSize: sevenDays,
    to: endOfWeek.getTime()
  };
}
