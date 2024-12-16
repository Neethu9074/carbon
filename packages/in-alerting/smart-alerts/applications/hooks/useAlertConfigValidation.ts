/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  fieldTouchedAndInvalid,
  isCustomPayloadValidOrUntouched
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingTearSheet';
import { BluePrint } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function useAlertConfigValidation(
  stepConfigs: AlertingTearSheetStepConfigs[],
  blueprintConfig: BluePrint,
  form: MapForm<any>,
  isTagFilterFormModelValid: boolean,
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null
) {
  const isLogsBlueprint = blueprintConfig.type === 'logs';
  const ruleForm = form.get('rule');
  const isStatusCodeBluePrint = blueprintConfig.type === 'statusCode';
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const ruleComplete = blueprintConfig?.isRuleComplete((ruleForm as any).toJS());

  const isCalculatingThreshold = useObservable(thresholdOrBaselineLoadingSignal$, []);

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
        (!isLogsBlueprint || !fieldTouchedAndInvalid(ruleForm?.get('message'))) &&
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
      valid: isThresholdSectionValid() && isTimeThresholdSectionValid() && !isCalculatingThreshold
    },
    {
      ...stepConfigs[4],
      valid: isCustomPayloadValidOrUntouched(form) && !fieldTouchedAndInvalid(form?.get('name'))
    },
    {
      ...stepConfigs[5],
      valid: true
    }
  ];
}
