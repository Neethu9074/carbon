/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm } from 'formalistic';
import { Frequency, RRule } from 'rrule';

import { formatDate, formatTimeWithoutSeconds } from '@instana/format-date';
import { CorrectionConfiguration } from '@instana/types';

import {
  createNameField,
  createStartFields,
  createReccurenceFields,
  createDurationFields
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createCorrectionWindowForm';
import {
  CorrectionWindowForm,
  DayInterval,
  Month
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';

function getStart(config: CorrectionConfiguration) {
  const { duration, startTime, durationUnit } = config.scheduling ?? {};
  const time = formatTimeWithoutSeconds(startTime) ?? '';
  const startDate = formatDate(startTime) ?? '';
  const fullDay = (durationUnit === 'day' && duration === 1) || (durationUnit === 'hour' && duration === 24);
  const allDay = fullDay && time.includes('00:00');
  return {
    startDate,
    time,
    allDay
  };
}

interface RepeatOccurrences {
  repeatUntil: 'occurrences';
  occurrences: number;
}

interface RepeatForever {
  repeatUntil: 'forever';
}

interface RepeatDate {
  repeatUntil: 'date';
  endDate: string;
}

type ReccurrenceOption = RepeatOccurrences | RepeatForever | RepeatDate;
function getReccurrenceOptions(rrule: RRule): ReccurrenceOption {
  if (rrule.options.count) {
    return {
      occurrences: rrule.options.count,
      repeatUntil: 'occurrences' as const
    };
  } else if (!rrule.options.until) {
    return { repeatUntil: 'forever' as const };
  }
  return { repeatUntil: 'date' as const, endDate: rrule.options.until.toISOString().slice(0, 10) };
}

function rruleToFormValues(rrule: RRule) {
  const isMonthly = rrule.options.freq === Frequency.MONTHLY;
  const isYearly = rrule.options.freq === Frequency.YEARLY;

  const dayInterval = isMonthly || isYearly ? rrule.options.bynweekday?.[0]?.[1] : undefined;

  const date = isMonthly || isYearly ? rrule.options.bymonthday?.[0] : undefined;

  const daysOfTheWeek =
    isMonthly || isYearly ? [rrule.options.bynweekday?.[0]?.[0]] ?? rrule.options.byweekday : rrule.options.byweekday;

  const month = rrule.options.freq === Frequency.YEARLY ? rrule.options.bymonth?.[0] : undefined;

  return {
    dayInterval,
    date,
    daysOfTheWeek: (daysOfTheWeek ?? []).filter((day): day is number => day !== undefined),
    month
  };
}

export default function createCorrectionWindowFormFromConfig(config: CorrectionConfiguration): CorrectionWindowForm {
  const { scheduling, name = '', sloIds, description = '' } = config;
  const { duration = 0, durationUnit = 'hour', recurrentRule, recurrent } = scheduling ?? {};
  const { startDate, time, allDay } = getStart(config);
  const rrule = RRule.fromString(recurrentRule ?? '');
  const recurrence = recurrent ? getReccurrenceOptions(rrule) : null;
  const frequency = recurrent ? rrule.options.freq : ONE_TIME;
  const { dayInterval, date, daysOfTheWeek, month } = rruleToFormValues(rrule);

  const endDate = recurrence?.repeatUntil === 'date' ? recurrence.endDate : '';
  return createMapForm({
    items: {
      name: createNameField({ value: name }),
      description: createField({ value: description }),
      schedule: createMapForm({
        items: {
          start: createMapForm({
            items: createStartFields({
              date: { value: startDate },
              time: { value: time },
              allDay: { value: allDay },
              endDate
            })
          }),
          duration: createMapForm({
            items: createDurationFields({ amount: { value: duration }, unit: { value: durationUnit } })
          }),
          recurrence: createMapForm({
            items: createReccurenceFields({
              endDate: { value: endDate },
              occurrences: { value: recurrence?.repeatUntil === 'occurrences' ? recurrence.occurrences : 0 },
              repeatUntil: { value: recurrence?.repeatUntil },
              interval: { value: rrule.options.interval },
              daysOfTheWeek: { value: daysOfTheWeek },
              dayInterval: { value: dayInterval as DayInterval },
              date: { value: date },
              month: { value: month as Month | undefined },
              repeatType: { value: rrule.options.bynweekday != null ? 'day' : 'date' },
              frequency,
              startDate
            })
          }),
          frequency: createField({
            value: frequency
          })
        }
      }),
      sloIds: createField({ value: sloIds ?? [] })
    }
  });
}
