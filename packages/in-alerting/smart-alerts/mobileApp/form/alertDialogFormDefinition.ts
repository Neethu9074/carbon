/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, MapForm } from 'formalistic';

import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
}

export default function alertFormDefinition(editMode: boolean): MapForm<any> {
  const form = createMapForm();

  return applyEditMode(form, editMode);
}
