/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, Item, MapForm } from 'formalistic';

import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { apdexConfigIdKey, entityIdKey, entityTypeKey } from 'in-custom-dashboards/widgets/Apdex/form';

const formSideEffects = [
  {
    path: [entityTypeKey],
    effects: [resetEntityId, resetApdexId] as EffectFunction[]
  }
];

export default function useApdexFormSideEffects(
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

function resetEntityId(form: MapForm): Item {
  return form.updateIn([entityIdKey], field =>
    (field as Field<string | undefined>).setValue(undefined).setTouched(false)
  );
}

function resetApdexId(form: MapForm): Item {
  return form.updateIn([apdexConfigIdKey], field =>
    (field as Field<string | undefined>).setValue(undefined).setTouched(false)
  );
}
