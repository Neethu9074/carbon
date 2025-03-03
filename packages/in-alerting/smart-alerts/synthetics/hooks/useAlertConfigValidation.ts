/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ListForm, MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { CustomPayloadFieldUnion } from '@instana/types/typeDefinitions';

import { isCustomPayloadValidOrUntouched } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingFullScreenTearSheet';

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
      valid: true
    },
    {
      ...stepConfigs[2],
      valid:
        isCustomPayloadFieldsValidOrUntouched(form) && form?.get('name').valid && isCustomPayloadValidOrUntouched(form),
      validator: () => updateFormField(form, updateForm, 'customPayloadFields')
    },
    {
      ...stepConfigs[3],
      valid: true
    }
  ];
}

function updateFormField(form: MapForm<any>, updateForm: (form: MapForm<any>) => void, fieldType: string) {
  return updateForm(form.updateIn([fieldType], (f: any) => f.setTouched(true, { recurse: true })));
}
function isCustomPayloadFieldsValidOrUntouched(form: MapForm<any>): boolean {
  const customPayloadForm = (form.get('customPayloadFields') as ListForm<any>) ?? null;

  const customPayload = customPayloadForm.toJS() as unknown as CustomPayloadFieldUnion[];

  if (customPayload.length > 0) {
    return !customPayload.some(
      value =>
        value.key === '' ||
        isEmpty(value.key.trim()) ||
        value.value === '' ||
        isEmpty(typeof value.value === 'string' ? value.value.trim() : value.value)
    );
  }
  return true;
}
