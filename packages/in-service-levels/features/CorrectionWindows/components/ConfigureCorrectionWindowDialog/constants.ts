/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { RRule } from 'rrule';

import { t } from 'in-i18n';

export const ONE_TIME = 'ONE_TIME' as const;

export const recurrenceOptions = [
  { value: ONE_TIME, label: t('in-service-levels:general.frequency.label', { context: ONE_TIME }) },
  { value: RRule.DAILY, label: t('in-service-levels:general.frequency.label', { context: RRule.DAILY.toString() }) },
  { value: RRule.WEEKLY, label: t('in-service-levels:general.frequency.label', { context: RRule.WEEKLY.toString() }) },
  {
    value: RRule.MONTHLY,
    label: t('in-service-levels:general.frequency.label', { context: RRule.MONTHLY.toString() })
  },
  { value: RRule.YEARLY, label: t('in-service-levels:general.frequency.label', { context: RRule.YEARLY.toString() }) }
];

export const durationUnitOptions = [
  { value: 'minute' as const, label: t('in-service-levels:general.durationUnit.label', { context: 'minute' }) },
  { value: 'hour' as const, label: t('in-service-levels:general.durationUnit.label', { context: 'hour' }) },
  { value: 'day' as const, label: t('in-service-levels:general.durationUnit.label', { context: 'day' }) }
];

export const monthOptions = [
  { value: 1 as const, label: t('in-service-levels:general.month.label', { context: '1' }) },
  { value: 2 as const, label: t('in-service-levels:general.month.label', { context: '2' }) },
  { value: 3 as const, label: t('in-service-levels:general.month.label', { context: '3' }) },
  { value: 4 as const, label: t('in-service-levels:general.month.label', { context: '4' }) },
  { value: 5 as const, label: t('in-service-levels:general.month.label', { context: '5' }) },
  { value: 6 as const, label: t('in-service-levels:general.month.label', { context: '6' }) },
  { value: 7 as const, label: t('in-service-levels:general.month.label', { context: '7' }) },
  { value: 8 as const, label: t('in-service-levels:general.month.label', { context: '8' }) },
  { value: 9 as const, label: t('in-service-levels:general.month.label', { context: '9' }) },
  { value: 10 as const, label: t('in-service-levels:general.month.label', { context: '10' }) },
  { value: 11 as const, label: t('in-service-levels:general.month.label', { context: '11' }) },
  { value: 12 as const, label: t('in-service-levels:general.month.label', { context: '12' }) }
];

export const daysOfTheWeekOptions = [
  {
    value: RRule.MO.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.MO.weekday.toString() })
  },
  {
    value: RRule.TU.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.TU.weekday.toString() })
  },
  {
    value: RRule.WE.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.WE.weekday.toString() })
  },
  {
    value: RRule.TH.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.TH.weekday.toString() })
  },
  {
    value: RRule.FR.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.FR.weekday.toString() })
  },
  {
    value: RRule.SA.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.SA.weekday.toString() })
  },
  {
    value: RRule.SU.weekday,
    label: t('in-service-levels:general.daysOfTheWeek.label', { context: RRule.SU.weekday.toString() })
  }
];

export const dayIntervalOptions = [
  { value: 1 as const, label: t('in-service-levels:general.dayInterval.label', { context: '1' }) },
  { value: 2 as const, label: t('in-service-levels:general.dayInterval.label', { context: '2' }) },
  { value: 3 as const, label: t('in-service-levels:general.dayInterval.label', { context: '3' }) },
  { value: 4 as const, label: t('in-service-levels:general.dayInterval.label', { context: '4' }) },
  { value: -1 as const, label: t('in-service-levels:general.dayInterval.label', { context: '-1' }) }
];
