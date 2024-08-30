/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, Item, MapForm } from 'formalistic';

import {
  timeWindowType,
  timeWindowDuration,
  timeWindowDurationUnit,
  removeFormForStartTimeStamp,
  addFormForStartTimeStamp,
  removeFormForTimeDuration,
  addFormForTimeDuration,
  sliConfigId,
  entityId,
  entityType,
  getMaxTimeWindowDurationValue,
  TimeWindowType,
  TimeWindowDuration
} from 'in-custom-dashboards/widgets/SloLegacy/form';
import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-hooks/useFormSideEffects';

const formSideEffects = [
  {
    path: [timeWindowType],
    effects: [handleTimeWindowChange as EffectFunction]
  },
  {
    path: [timeWindowDurationUnit],
    effects: [clampTimeWindowDuration as EffectFunction]
  },
  {
    path: [entityId],
    effects: [clearSliConfigId as EffectFunction]
  },
  {
    path: [entityType],
    effects: [cleanEntityId as EffectFunction, clearSliConfigId as EffectFunction]
  }
];

export default function useSloFormSideEffects(
  form: Item,
  setForm: (field: Item) => void
): ReturnType<typeof useFormSideEffects> {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

function handleTimeWindowChange(form: MapForm<any>): Item {
  let updatedForm = form;
  const value = (updatedForm.get(timeWindowType) as Field<TimeWindowType>).value;
  if (value === 'fixed') {
    updatedForm = addFormForStartTimeStamp(updatedForm);
    updatedForm = addFormForTimeDuration(updatedForm, {}, false);
  } else {
    updatedForm = removeFormForStartTimeStamp(updatedForm);
    if (value === 'dynamic') {
      updatedForm = removeFormForTimeDuration(updatedForm);
    } else {
      updatedForm = addFormForTimeDuration(updatedForm, {}, false);
    }
  }
  return updatedForm;
}

function clampTimeWindowDuration(form: MapForm<any>): Item {
  const unit = (form.get(timeWindowDurationUnit) as Field<TimeWindowDuration>).value;
  const oldDuration = (form.get(timeWindowDuration) as Field<number>).value;
  const maxDurationForThisUnit = getMaxTimeWindowDurationValue(unit);
  return form.updateIn([timeWindowDuration], f =>
    (f as Field<number>).setValue(Math.min(oldDuration, maxDurationForThisUnit)).setTouched(true)
  );
}

function clearSliConfigId(form: MapForm<any>): Item {
  return form.updateIn([sliConfigId], f => (f as Field<string>).setValue('').setTouched(f.touched));
}

function cleanEntityId(form: MapForm<any>): Item {
  return form.updateIn([entityId], f => (f as Field<string>).setValue('').setTouched(false));
}
