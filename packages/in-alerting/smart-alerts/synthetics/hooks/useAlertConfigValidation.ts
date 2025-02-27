/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ListForm, MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { CustomPayloadFieldUnion } from '@instana/types/typeDefinitions';

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
      valid: isCustomPayloadValidOrUntouched(form) && form?.get('name').valid,
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
function isCustomPayloadValidOrUntouched(form: MapForm<any>): boolean {
  const customPayloadForm = (form.get('customPayloadFields') as ListForm<any>) ?? null;

  const customPayload = customPayloadForm.toJS() as unknown as CustomPayloadFieldUnion[];

  if (customPayload.length > 0) {
    return !customPayload.some(
      //@ts-expect-error
      value => value.key === '' || isEmpty(value.key.trim()) || value.value === '' || isEmpty(value.value.trim())
    );
  }
  return true;
}
