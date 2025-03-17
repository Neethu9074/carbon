/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData } from '@instana/types';

import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingFullScreenTearSheet';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { fieldTouchedAndInvalid } from 'in-alerting/smart-alerts/components/utils/formUtils';

export default function useAlertConfigValidation(
  stepConfigs: AlertingTearSheetStepConfigs[],
  form: MapForm<any>,
  isTagFilterFormModelValid: boolean,
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null,
  updateForm: (form: MapForm<any>) => void
) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isCustomEvent = blueprintConfig.type === 'customEvent';
  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

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
      valid: !isCustomEvent || ruleForm?.get('customEventName')?.hierarchyValid !== false
    },
    {
      ...stepConfigs[1],
      valid: isTagFilterFormModelValid
    },
    {
      ...stepConfigs[2],
      valid:
        isThresholdSectionValid() &&
        form.get('threshold').hierarchyValid &&
        isTimeThresholdSectionValid() &&
        isTagFilterFormModelValid,
      validator: () => updateFormField(form, updateForm, ['threshold'])
    },
    {
      ...stepConfigs[3],
      valid: form.get('customPayloadFields').hierarchyValid && form?.get('name').valid,
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
