/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingFullScreenTearSheet';
import { fieldTouchedAndInvalid } from 'in-alerting/smart-alerts/components/utils/formUtils';

export default function useAlertConfigValidation(
  stepConfigs: AlertingTearSheetStepConfigs[],
  form: MapForm<any>,
  tagFilterValid: boolean,
  updateForm: (form: MapForm<any>) => void
) {
  return [
    {
      ...stepConfigs[0],
      valid: tagFilterValid
    },
    {
      ...stepConfigs[1],
      valid: isThresholdSectionValid(form) && form.get('threshold').hierarchyValid && isTimeThresholdValid(form)
    },
    {
      ...stepConfigs[2],
      valid: form.get('customPayloadFields').hierarchyValid && form?.get('name').valid,
      validator: () => updateFormField(form, updateForm, 'customPayloadFields')
    },
    {
      ...stepConfigs[3],
      valid: true
    }
  ];
}

function isTimeThresholdValid(form: MapForm<any>) {
  const timeThresholdValid = form.get('timeThreshold')?.get('timeWindow').valid;
  return timeThresholdValid;
}

function isThresholdSectionValid(form: MapForm<any>) {
  if (fieldTouchedAndInvalid(form.get('threshold'))) {
    return false;
  }

  return true;
}

function updateFormField(form: MapForm<any>, updateForm: (form: MapForm<any>) => void, fieldType: string) {
  return updateForm(form.updateIn([fieldType], (f: any) => f.setTouched(true, { recurse: true })));
}
