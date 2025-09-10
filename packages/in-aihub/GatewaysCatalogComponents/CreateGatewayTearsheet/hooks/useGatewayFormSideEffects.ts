/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { GatewayForm } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/types/gatewayFormTypes';
import useFormSideEffects, { CHANGE_TYPES } from 'in-hooks/useFormSideEffects';
import type { Effect } from 'in-hooks/useFormSideEffects';

// Define any side effects that should happen when specific form fields change
const formSideEffects: Effect<GatewayForm>[] = [
  // Example: When agent type changes, update related fields
  {
    path: ['connection', 'agentType'],
    effects: [updateConnectionFields]
  }
  // Add more side effects as needed
];

// Update connection fields based on agent type
function updateConnectionFields(form: GatewayForm): GatewayForm {
  const agentType = form.getIn(['connection', 'agentType']).value;
  const isWatsonx = agentType === 'IBM watsonx';

  if (isWatsonx) {
    return form.updateIn(['connection', 'endpointUrl'], field => field.setValue(''));
  } else {
    return form
      .updateIn(['connection', 'watsonxKey'], field => field.setValue(''))
      .updateIn(['connection', 'watsonxProject'], field => field.setValue(''))
      .updateIn(['connection', 'watsonxUrl'], field => field.setValue(''));
  }
}

export type GatewayFormSideEffectsReturnType = (form: GatewayForm) => void;

export default function useGatewayFormSideEffects(
  form: GatewayForm,
  setForm: (field: GatewayForm) => void
): GatewayFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
