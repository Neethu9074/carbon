/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ListForm, MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { CustomPayloadFieldUnion } from '@instana/types/typeDefinitions';

import { isEmpty as isThresholdEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
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
      valid: isThresholdSectionValid(form) && isTimeThresholdValid(form)
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

function isTimeThresholdValid(form: MapForm<any>) {
  const timeThresholdValid = form.get('timeThreshold')?.get('timeWindow').valid;
  return timeThresholdValid;
}

function isThresholdSectionValid(form: MapForm<any>) {
  const warningThresholdValue = form.get('threshold')?.get('warningThreshold').get('value').value;
  const hasWarningThreshold = !isThresholdEmpty(warningThresholdValue);
  const criticalThresholdValue = form.get('threshold')?.get('criticalThreshold').get('value').value;
  const hasCriticalThreshold = !isThresholdEmpty(criticalThresholdValue);

  const operatorValue = form.get('threshold')?.get('operator').value ?? '>=';

  if (hasWarningThreshold && hasCriticalThreshold) {
    if ((operatorValue === '<' || operatorValue === '<=') && warningThresholdValue <= criticalThresholdValue) {
      return false;
    } else if ((operatorValue === '>' || operatorValue === '>=') && warningThresholdValue >= criticalThresholdValue) {
      return false;
    }
  }

  if (!hasWarningThreshold && !hasCriticalThreshold) {
    return false;
  }

  return true;
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
