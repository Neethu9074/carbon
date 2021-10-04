/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  timeWindowType,
  timeWindowDuration,
  timeWindowDurationUnit,
  removeFormForStartTimeStamp,
  addFormForStartTimeStamp,
  removeFormForTimeDuration,
  addFormForTimeDuration,
  dynamic,
  fixed,
  sliConfigId,
  entityId,
  entityType,
  getMaxTimeWindowDurationValue
} from 'in-custom-dashboards/widgets/Slo/form';
import useFormSideEffects from 'in-alerting/smart-alerts/hooks/useFormSideEffects';

const formSideEffects = [
  {
    path: [timeWindowType],
    effects: [handleTimeWindowChange]
  },
  {
    path: [timeWindowDurationUnit],
    effects: [clampTimeWindowDuration]
  },
  {
    path: [entityId],
    effects: [clearSliConfigId]
  },
  {
    path: [entityType],
    effects: [cleanEntityId]
  }
];

export default function useSloFormSideEffects(form, setForm) {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects
  });
}

function handleTimeWindowChange(form) {
  const value = form.get(timeWindowType).value;
  let updatedForm;
  if (value === fixed) {
    updatedForm = addFormForStartTimeStamp(form);
    updatedForm = addFormForTimeDuration(updatedForm, {}, false);
  } else {
    updatedForm = removeFormForStartTimeStamp(form);
    if (value === dynamic) {
      updatedForm = removeFormForTimeDuration(updatedForm);
    } else {
      updatedForm = addFormForTimeDuration(updatedForm, {}, false);
    }
  }
  return updatedForm;
}

function clampTimeWindowDuration(form) {
  const unit = form.get(timeWindowDurationUnit).value;
  const oldDuration = form.get(timeWindowDuration).value;
  const maxDurationForThisUnit = getMaxTimeWindowDurationValue(unit);
  return form.updateIn([timeWindowDuration], f =>
    f.setValue(Math.min(oldDuration, maxDurationForThisUnit)).setTouched(true)
  );
}

function clearSliConfigId(form) {
  return form.updateIn([sliConfigId], f => f.setValue('').setTouched(false));
}

function cleanEntityId(form) {
  return form.updateIn([entityId], f => f.setValue('').setTouched(false));
}
