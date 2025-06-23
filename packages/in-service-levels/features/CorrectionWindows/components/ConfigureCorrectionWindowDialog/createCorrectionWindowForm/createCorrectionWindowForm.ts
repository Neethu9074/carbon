/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { CreateFieldOpts, composeValidators, createField } from 'formalistic';
import { Frequency } from 'rrule';

import { DurationUnitType, CorrectionConfiguration } from '@instana/types';

import {
  CorrectionWindowForm,
  CorrectionWindowFormFields,
  DurationFields,
  RecurrenceFields,
  RepeatUntil,
  StartFields,
  RepeatType,
  DayInterval,
  Month
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import createCorrectionWindowFormFromConfig from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createCorrectionWindowFormFromConfig';
import createDefaultCorrectionWindowForm from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createDefaultCorrectionWindowForm';
import {
  daysOfTheWeekValidator,
  startAndEndDateValidator
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/validators';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { dateFieldValidator } from 'in-service-levels/components/ConfigDialog/createSloForm/validator';
import { maxValidator, positiveNumberValidator } from 'in-services/validators/number';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { nameValidator } from 'in-service-levels/utils/validators';
import { notBlankValidator } from 'in-services/validators/string';
import { timeValidator } from 'in-services/validators/date';

const MAX_INT = 2147483647;

interface CreateCorrectionWindowFormParams {
  form?: CorrectionWindowForm;
  config?: CorrectionConfiguration;
}

export function createCorrectionWindowForm({ config }: CreateCorrectionWindowFormParams): CorrectionWindowForm {
  if (config) return createCorrectionWindowFormFromConfig(config);

  return createDefaultCorrectionWindowForm();
}

export function createDurationFields({
  unit,
  amount
}: {
  unit: CreateFieldOpts<DurationUnitType>;
  amount: CreateFieldOpts<number>;
}): DurationFields {
  return {
    amount: createField({
      ...amount,
      validator: composeAndShortCircuitOnError(positiveNumberValidator, maxValidator(MAX_INT))
    }),
    unit: createField({ ...unit })
  };
}

export function createNameField(name: CreateFieldOpts<string>): CorrectionWindowFormFields['name'] {
  return createField({
    ...name,
    validator: nameValidator
  });
}

export function createStartFields({
  date,
  time,
  allDay,
  endDate
}: {
  date: CreateFieldOpts<string>;
  time: CreateFieldOpts<string>;
  allDay: CreateFieldOpts<boolean>;
  endDate: string;
}): StartFields {
  return {
    date: createField({
      ...date,
      validator: composeAndShortCircuitOnError<string>(dateFieldValidator, startDate =>
        startAndEndDateValidator(startDate, endDate)
      )
    }),
    time: createField({
      ...time,
      validator: composeValidators(notBlankValidator, v => timeValidator(v, 'HH:mm'))
    }),
    allDay: createField({ ...allDay })
  };
}

export function createReccurenceFields({
  endDate,
  repeatUntil,
  occurrences,
  interval,
  daysOfTheWeek,
  dayInterval,
  date,
  repeatType,
  month,
  frequency,
  startDate
}: {
  endDate: CreateFieldOpts<string>;
  repeatUntil: CreateFieldOpts<RepeatUntil | undefined>;
  occurrences: CreateFieldOpts<number>;
  interval: CreateFieldOpts<number | undefined>;
  daysOfTheWeek: CreateFieldOpts<number[]>;
  dayInterval: CreateFieldOpts<DayInterval | undefined>;
  date: CreateFieldOpts<number | undefined>;
  repeatType: CreateFieldOpts<RepeatType | undefined>;
  month: CreateFieldOpts<Month | undefined>;
  frequency: typeof ONE_TIME | Frequency;
  startDate: string;
}): RecurrenceFields {
  return {
    occurrences: createField({
      ...occurrences,
      validator: repeatUntil.value === 'occurrences' ? positiveNumberValidator : undefined
    }),
    repeatUntil: createField({
      ...repeatUntil,
      validator: frequency === ONE_TIME ? undefined : notBlankValidator
    }),
    endDate: createField({
      ...endDate,
      validator:
        repeatUntil.value === 'date'
          ? composeAndShortCircuitOnError<string>(dateFieldValidator, endDate =>
              startAndEndDateValidator(startDate, endDate)
            )
          : undefined
    }),
    interval: createField({
      ...interval,
      validator:
        frequency === Frequency.DAILY || frequency === Frequency.WEEKLY
          ? composeAndShortCircuitOnError(
              positiveNumberValidator,
              maxValidator(frequency === Frequency.DAILY ? 31 : 52)
            )
          : undefined
    }),
    daysOfTheWeek: createField({
      ...daysOfTheWeek,
      validator:
        frequency === Frequency.WEEKLY || (frequency === Frequency.MONTHLY && repeatType.value === 'day')
          ? daysOfTheWeekValidator
          : undefined
    }),
    dayInterval: createField({
      ...dayInterval,
      validator:
        (frequency === Frequency.MONTHLY || frequency === Frequency.YEARLY) && repeatType.value === 'day'
          ? notBlankValidator
          : undefined
    }),
    date: createField({
      ...date,
      validator:
        (frequency === Frequency.MONTHLY || frequency === Frequency.YEARLY) && repeatType.value === 'date'
          ? composeAndShortCircuitOnError(positiveNumberValidator, maxValidator(31))
          : undefined
    }),
    month: createField({
      ...month,
      validator: frequency === Frequency.YEARLY ? notBlankValidator : undefined
    }),
    repeatType: createField({
      ...repeatType,
      validator: frequency === Frequency.MONTHLY || frequency === Frequency.YEARLY ? notBlankValidator : undefined
    })
  };
}
