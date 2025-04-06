/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ListForm, MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import {
  AdaptiveBaselineData,
  CustomPayloadFieldUnion,
  HistoricBaselineData,
  Result,
  StaticThresholdData
} from '@instana/types';

import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingFullScreenTearSheet';
import { fieldTouchedAndInvalid } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { BluePrint } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function useAlertConfigValidation(
  stepConfigs: AlertingTearSheetStepConfigs[],
  blueprintConfig: BluePrint,
  form: MapForm<any>,
  isTagFilterFormModelValid: boolean,
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null,
  updateForm: (form: MapForm<any>) => void
) {
  const isLogsBlueprint = blueprintConfig.type === 'logs';
  const ruleForm = form.get('rule');
  const isStatusCodeBluePrint = blueprintConfig.type === 'statusCode';
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const ruleComplete = blueprintConfig?.isRuleComplete((ruleForm as any).toJS());

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

    return true;
  }
  function isTimeThresholdSectionValid() {
    const timeThresholdForm = form.get('timeThreshold');
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
        (!isLogsBlueprint || !ruleForm?.get('message')?.hierarchyValid === false) &&
        // for custom ranges only: we do have direct invalidation feedback on the fields,
        // so only can get invalid after the user has changed it
        (!isStatusCodeBluePrint || !ruleForm?.get('statusCode')?.hierarchyValid === false)
    },
    {
      ...stepConfigs[1],
      valid: form.get('applications')?.valid && isTagFilterFormModelValid
    },
    {
      ...stepConfigs[2],
      valid: true
    },
    {
      ...stepConfigs[3],
      valid: isThresholdSectionValid() && form.get('threshold').hierarchyValid && isTimeThresholdSectionValid()
    },
    {
      ...stepConfigs[4],
      valid: isCustomPayloadValidOrUntouched(form) && form?.get('name').valid,
      validator: () => updateFormField(form, updateForm, 'customPayloadFields')
    },
    {
      ...stepConfigs[5],
      valid: true
    }
  ];
}

function isCustomPayloadValidOrUntouched(form: MapForm<any>): boolean {
  const customPayloadForm = (form.get('customPayloadFields') as ListForm<any>) ?? null;

  const customPayload = customPayloadForm.toJS() as unknown as CustomPayloadFieldUnion[];

  if (customPayload.length > 0) {
    return !customPayload.some(value => value.key === '' || value.value === '' || isEmpty(value.value));
  }
  return true;
}

function updateFormField(form: MapForm<any>, updateForm: (form: MapForm<any>) => void, fieldType: string) {
  return updateForm(form.updateIn([fieldType], (f: any) => f.setTouched(true, { recurse: true })));
}
