/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { endOfDay, getTime, startOfMonth, subDays } from 'date-fns';

import { days } from 'in-services/time/time';
import { t } from 'in-i18n';

interface FupTimePreset {
  fupTimeRange: string;
  fupWindowSize: number;
  fupTo: number;
  label: string;
}

const fupTimePresets: FupTimePreset[] = [
  {
    fupTimeRange: 'last_7_days',
    fupWindowSize: days.toMillis(7),
    fupTo: getTime(endOfDay(subDays(new Date(), 1))),
    label: t('in-amp:components.timePresets.last7Days')
  },
  {
    fupTimeRange: 'this_month',
    fupWindowSize: getTime(endOfDay(new Date())) - getTime(startOfMonth(new Date())),
    fupTo: getTime(endOfDay(new Date())),
    label: t('in-amp:components.timePresets.thisMonth')
  },
  {
    fupTimeRange: 'last_month',
    fupWindowSize: days.toMillis(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate() - 1),
    fupTo: getTime(subDays(startOfMonth(new Date()), 1)),
    label: t('in-amp:components.timePresets.lastMonth')
  }
];

export default fupTimePresets;
