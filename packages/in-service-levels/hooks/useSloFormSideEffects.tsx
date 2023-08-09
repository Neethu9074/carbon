/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';

// eslint-disable-next-line
import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { createSloForm, SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';

const resetScopes = (form: SloForm) => {
  const entityType = form.getIn(['entity', 'type']).value;
  if (entityType === 'application') {
    const formToReturn = createSloForm({ previousForm: form });

    return formToReturn;
  } else {
    const formToReturn = createSloForm({ previousForm: form });

    return formToReturn;
  }
};

const resetIndicatorEventType = (form: SloForm) => {
  const typeField = form.getIn(['indicator', 'type']);
  const blueprintField = form.getIn(['indicator', 'blueprint']);

  const isIndicatorCustomEventBased = typeField.value === 'customEventBased';
  const isIndicatorCustomBased = blueprintField.value === 'custom';

  if (isIndicatorCustomBased && !isIndicatorCustomEventBased)
    return form.updateIn(['indicator', 'type'], () => typeField.setValue('customEventBased'));

  if (!isIndicatorCustomBased && isIndicatorCustomEventBased)
    return form.updateIn(['indicator', 'type'], () => typeField.setValue('timeBased'));

  return form;
};

const formSideEffects = [
  {
    path: ['entity', 'type'],
    effects: [resetScopes as EffectFunction]
  },
  {
    path: ['indicator', 'blueprint'],
    effects: [resetIndicatorEventType as EffectFunction]
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
