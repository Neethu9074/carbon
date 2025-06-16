/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm, MapPath, Item } from 'formalistic';
import { Frequency } from 'rrule';

import { DurationUnitType } from '@instana/types';

import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';

export type DurationFields = {
  amount: Field<number>;
  unit: Field<DurationUnitType>;
};
type DurationForm = MapForm<DurationFields>;

export type RepeatUntil = 'date' | 'occurrences' | 'forever';

export type RepeatType = 'date' | 'day';

export type DayInterval = -1 | 1 | 2 | 3 | 4;

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type RecurrenceFields = {
  occurrences: Field<number>;
  repeatUntil: Field<RepeatUntil | undefined>;
  interval: Field<number | undefined>;
  daysOfTheWeek: Field<number[]>;
  dayInterval: Field<DayInterval | undefined>;
  date: Field<number | undefined>;
  month: Field<Month | undefined>;
  repeatType: Field<RepeatType | undefined>;
  endDate: Field<string>;
};
type RecurrenceForm = MapForm<RecurrenceFields>;

export type StartFields = {
  date: Field<string>;
  time: Field<string>;
  allDay: Field<boolean>;
};
type StartForm = MapForm<StartFields>;

type ScheduleFormFields = {
  start: StartForm;
  duration: DurationForm;
  recurrence: RecurrenceForm;
  frequency: Field<typeof ONE_TIME | Frequency>;
};
type ScheduleForm = MapForm<ScheduleFormFields>;

export type CorrectionWindowFormFields = {
  name: Field<string>;
  description: Field<string>;
  schedule: ScheduleForm;
  sloIds: Field<string[]>;
};

export type CorrectionWindowForm = MapForm<CorrectionWindowFormFields>;
type CorrectionWindowFormPath = MapPath<CorrectionWindowFormFields>;
export type CorrectionWindowFormOnChange = (path: CorrectionWindowFormPath, updater: (i: Item) => Item) => void;
