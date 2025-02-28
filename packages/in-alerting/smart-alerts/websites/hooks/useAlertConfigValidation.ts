/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ListForm, MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData } from '@instana/types';
import { CustomPayloadFieldUnion } from '@instana/types/typeDefinitions';

import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingFullScreenTearSheet';
import { fieldTouchedAndInvalid } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';

export default function useAlertConfigValidation(
  stepConfigs: AlertingTearSheetStepConfigs[],
  form: MapForm<any>,
  isTagFilterFormModelValid: boolean,
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null,
  updateForm: (form: MapForm<any>) => void
) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const isSpecificJsErrorBlueprint = blueprintConfig.type === 'specificJsError';
  const isCustomEvent = blueprintConfig.type === 'customEvent';

  function isThresholdSectionValid() {
    if (fieldTouchedAndInvalid(form.get('threshold'))) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && !isTagFilterFormModelValid) {
      return false;
    }
    if (!ruleComplete) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && thresholdResult && thresholdResult?.errors?.length > 0) {
      return false;
    }

    return !(thresholdType === ADAPTIVE_BASELINE && thresholdResult && thresholdResult?.errors?.length > 0);
  }

  function isTimeThresholdSectionValid() {
    const timeThresholdForm = form?.get('timeThreshold');
    if (fieldTouchedAndInvalid(timeThresholdForm?.get('timeWindow'))) {
      return false;
    }
    if (fieldTouchedAndInvalid(timeThresholdForm?.get('violations'))) {
      return false;
    }
    if (fieldTouchedAndInvalid(timeThresholdForm?.get('requests'))) {
      return false;
    }
    return true;
  }

  return [
    {
      ...stepConfigs[0],
      valid:
        (!isCustomEvent || ruleForm?.get('customEventName')?.hierarchyValid !== false) &&
        (!isSpecificJsErrorBlueprint || ruleForm?.get('value')?.hierarchyValid !== false)
    },
    {
      ...stepConfigs[1],
      valid: isTagFilterFormModelValid
    },
    {
      ...stepConfigs[2],
      valid: isThresholdSectionValid() && form.get('threshold').hierarchyValid && isTimeThresholdSectionValid(),
      validator: () => updateFormField(form, updateForm, ['threshold'])
    },
    {
      ...stepConfigs[3],
      valid: isCustomPayloadValidOrUntouched(form) && form?.get('name').valid,
      validator: () => updateFormField(form, updateForm, ['customPayloadFields'])
    },
    {
      ...stepConfigs[4],
      valid: true
    }
  ];
}

function updateFormField(form: MapForm<any>, updateForm: (form: MapForm<any>) => void, fieldType: string[]) {
  return fieldType.forEach(field =>
    updateForm(form.updateIn([field], (f: any) => f.setTouched(true, { recurse: true })))
  );
}

function isCustomPayloadValidOrUntouched(form: MapForm<any>): boolean {
  const customPayloadForm = (form.get('customPayloadFields') as ListForm<any>) ?? null;

  const customPayload = customPayloadForm.toJS() as unknown as CustomPayloadFieldUnion[];

  if (customPayload.length > 0) {
    return !customPayload.some(value => {
      return (
        value.key === '' ||
        isEmpty(value.key.trim()) ||
        value.value === '' ||
        isEmpty(typeof value.value === 'string' ? value.value.trim() : value.value)
      );
    });
  }
  return true;
}
