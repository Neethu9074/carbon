/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getTime, startOfMonth, startOfDay, startOfHour, endOfMonth, subDays, subHours } from 'date-fns';

import { days } from 'in-services/time';
import { t } from 'in-i18n';

const usageTimePresets = [
  {
    timeRange: 'last_7_days',
    windowSize: days.toMillis(7),
    to: getTime(subHours(startOfHour(new Date()), 1)),
    label: t('in-amp:components.timePresets.last7Days')
  },
  {
    timeRange: 'last_30_days',
    windowSize: days.toMillis(30),
    to: getTime(startOfDay(new Date())),
    label: t('in-amp:components.timePresets.last30Days')
  },
  {
    timeRange: 'all',
    windowSize: days.toMillis(365),
    to: getTime(subDays(startOfDay(new Date()), 1)),
    label: t('in-amp:components.timePresets.last365Days')
  },
  {
    timeRange: 'this_month',
    windowSize: days.toMillis(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - 1), // Determines the number of months in the current month
    to: getTime(startOfDay(endOfMonth(new Date()))),
    label: t('in-amp:components.timePresets.thisMonth')
  },
  {
    timeRange: 'last_month',
    windowSize: days.toMillis(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate() - 1), // Determines the number of months in the previous month
    to: getTime(subDays(startOfMonth(new Date()), 1)),
    label: t('in-amp:components.timePresets.lastMonth')
  }
];

export default usageTimePresets;
