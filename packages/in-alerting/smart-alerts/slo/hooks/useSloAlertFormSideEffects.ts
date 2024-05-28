/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';
import { SloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';

function resetSelectedSloIds(form: SloAlertForm) {
  if (!form.getIn(['entityType']).touched) return form;

  return form.updateIn(['sloIds'], field => field.setValue([]).setTouched(false));
}

const formSideEffects: Effect<SloAlertForm>[] = [
  {
    path: ['entityType'],
    effects: [resetSelectedSloIds]
  }
];

export type SloAlertFormSideEffectsReturnType = (form: SloAlertForm) => void;

export default function useSloAlertFormSideEffects(
  form: SloAlertForm,
  setForm: (field: SloAlertForm) => void
): SloAlertFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
