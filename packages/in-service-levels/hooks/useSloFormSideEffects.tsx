/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';

// eslint-disable-next-line
import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { sloEntityTypeKey, CommonSloForm } from 'in-service-levels/components/ConfigDialog/form';
import { entityTypes } from 'in-service-levels/constants';

const resetScopes = (form: CommonSloForm) => {
  const clonedForm = { ...form };

  const sloSloEntityTypeField = clonedForm.get(sloEntityTypeKey);

  if (sloSloEntityTypeField.value === entityTypes.application.label) {
    // clonedForm.put()
  }
};

const formSideEffects = [
  {
    path: ['sliEntity', 'sliType'],
    effects: [resetScopes as EffectFunction]
  }
];

export const useSloFormSideEffects = (
  form: Item,
  setForm: (field: Item) => void
): ReturnType<typeof useFormSideEffects> => {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
};
