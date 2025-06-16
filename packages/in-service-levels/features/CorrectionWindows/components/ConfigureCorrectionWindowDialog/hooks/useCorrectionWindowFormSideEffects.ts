/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createMapForm } from 'formalistic';
import { Frequency } from 'rrule';

import {
  createReccurenceFields,
  createStartFields
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createCorrectionWindowForm';
import { CorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';

function updateDuration(form: CorrectionWindowForm) {
  const allDay = form.getIn(['schedule', 'start', 'allDay']).value;
  if (allDay)
    return form
      .updateIn(['schedule', 'duration', 'amount'], item => item.setValue(24))
      .updateIn(['schedule', 'duration', 'unit'], item => item.setValue('hour'))
      .updateIn(['schedule', 'start', 'time'], item => item.setValue('00:00'));
  return form
    .updateIn(['schedule', 'duration', 'amount'], item => item.setValue(0))
    .updateIn(['schedule', 'start', 'time'], item => item.setValue(''));
}

function resetRecurrence(form: CorrectionWindowForm) {
  const schedule = form.get('schedule');
  const frequency = schedule.get('frequency');
  const recurrence = schedule.get('recurrence');
  const endDate = recurrence.get('endDate');
  const occurrences = recurrence.get('occurrences');
  const repeatUntil = recurrence.get('repeatUntil');
  const interval = recurrence.get('interval');
  const daysOfTheWeek = recurrence.get('daysOfTheWeek');
  const dayInterval = recurrence.get('dayInterval');
  const repeatType = recurrence.get('repeatType');
  const date = recurrence.get('date');
  const month = recurrence.get('month');
  const startDate = schedule.getIn(['start', 'date']);

  const updatedRepeatType =
    (frequency.value === Frequency.MONTHLY || frequency.value === Frequency.YEARLY) && repeatType.value === undefined
      ? repeatType.setValue('date')
      : repeatType;

  const updatedRepeatUntil =
    frequency.value === ONE_TIME
      ? repeatUntil.setValue(undefined)
      : repeatUntil.value === undefined
      ? repeatUntil.setValue('date')
      : repeatUntil;

  return form.updateIn(['schedule', 'recurrence'], () =>
    createMapForm({
      items: createReccurenceFields({
        endDate,
        occurrences,
        repeatUntil: updatedRepeatUntil,
        interval,
        daysOfTheWeek,
        date,
        dayInterval,
        month,
        repeatType: updatedRepeatType,
        frequency: frequency.value,
        startDate: startDate.value
      })
    })
  );
}

function resetStart(form: CorrectionWindowForm) {
  const schedule = form.get('schedule');
  const start = schedule.get('start');
  const endDate = schedule.getIn(['recurrence', 'endDate']);
  const date = start.get('date');
  const allDay = start.get('allDay');
  const time = start.get('time');

  return form.updateIn(['schedule', 'start'], () =>
    createMapForm({ items: createStartFields({ date, time, allDay, endDate: endDate.value }) })
  );
}

const formSideEffects: Effect<CorrectionWindowForm>[] = [
  {
    path: ['schedule', 'start', 'allDay'],
    effects: [updateDuration]
  },
  {
    path: ['schedule', 'frequency'],
    effects: [resetRecurrence]
  },
  {
    path: ['schedule', 'recurrence', 'repeatUntil'],
    effects: [resetRecurrence]
  },
  {
    path: ['schedule', 'recurrence', 'repeatType'],
    effects: [resetRecurrence]
  },
  {
    path: ['schedule', 'start', 'date'],
    effects: [resetRecurrence]
  },
  {
    path: ['schedule', 'recurrence', 'endDate'],
    effects: [resetStart]
  }
];

export type CorrectionWindowFormSideEffectsReturnType = (form: CorrectionWindowForm) => void;

export default function useCorrectionWindowFormSideEffects(
  form: CorrectionWindowForm,
  setForm: (field: CorrectionWindowForm) => void
): CorrectionWindowFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
