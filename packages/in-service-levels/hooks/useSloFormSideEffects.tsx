/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';

import { SloEntityType } from '@instana/types';

// eslint-disable-next-line
import useFormSideEffects, { CHANGE_TYPES, EffectFunction } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import {
  createSloForm,
  isApplicationSloForm,
  sloEntityTypeKey,
  SloForm
} from 'in-service-levels/components/ConfigDialog/form';

const resetScopes = (form: SloForm<SloEntityType>) => {
  if (isApplicationSloForm(form)) {
    const formToReturn = createSloForm({ entityType: 'application' });

    return formToReturn;
  } else {
    const formToReturn = createSloForm({ entityType: 'website' });

    return formToReturn;
  }
};

const formSideEffects = [
  {
    path: [sloEntityTypeKey],
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
