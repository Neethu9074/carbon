/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createMapForm } from 'formalistic';
import { Frequency } from 'rrule';

import { ONE_TIME, POLICY_CONDITION } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/constants';
import { PolicyForm } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import {
  createReccurenceFields,
  createStartFields
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/usePolicyFormHelper';
import type { Effect } from 'in-hooks/useFormSideEffects';
import useFormSideEffects, { CHANGE_TYPES } from 'in-hooks/useFormSideEffects';
import { TriggerType } from '@instana/types';

function resetRecurrence(form: PolicyForm) {
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

function resetStart(form: PolicyForm) {
  const schedule = form.get('schedule');
  const start = schedule.get('start');
  const endDate = schedule.getIn(['recurrence', 'endDate']);
  const date = start.get('date');
  const time = start.get('time');

  return form.updateIn(['schedule', 'start'], () =>
    createMapForm({ items: createStartFields({ date, time, endDate: endDate.value }) })
  );
}

function resetTrigger(form: PolicyForm) {
  const condition = form.get('condition').value;

  if (condition === POLICY_CONDITION.SCHEDULE) {
    return form
      .updateIn(['triggerId'], item => item.setValue('').setTouched(false))
      .updateIn(['triggerType'], item => item.setValue(POLICY_CONDITION.SCHEDULE as TriggerType).setTouched(false))
      .updateIn(['scope', 'query'], item => item.setValue('').setTouched(false))
      .updateIn(['action', 'type', 'manual'], item => item.setValue(false))
      .updateIn(['action', 'type', 'automatic'], item => item.setValue(true))
      .updateIn(['action', 'type'], item => item.setTouched(false))
      .updateIn(['scope', 'applyOn'], item => item.setValue('all').setTouched(false))
      .updateIn(['action', 'isSchedulePolicy'], item => item.setValue(true));
  } else {
    return form
      .updateIn(['triggerId'], item => item.setValue('').setTouched(false))
      .updateIn(['triggerType'], item => item.setValue('builtinEvent').setTouched(false))
      .updateIn(['action', 'isSchedulePolicy'], item => item.setValue(false));
  }
}

const formSideEffects: Effect<PolicyForm>[] = [
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
  },
  {
    path: ['condition'],
    effects: [resetTrigger]
  }
];

export type PolicyFormSideEffectsReturnType = (form: PolicyForm) => void;

export default function usePolicyFormSideEffects(
  form: PolicyForm,
  setForm: (field: PolicyForm) => void
): PolicyFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
