/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';

import {
  createViolationsInSequenceForm,
  defaultAdaptiveBaselineTimeWindow
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
// @ts-expect-error file needs to be converted into typescript
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { perEndpointAdaptiveBaselineEnabled } from 'in-services/featureFlags';
import { AlertEvaluationType, ThresholdType } from 'in-types';

export function onThresholdTypeChange(
  typeWithOptionalSeasonality: string,
  form: MapForm,
  updateForm: (form: MapForm) => void,
  trackThresholdTypeChanged?: (trackingObject: any) => void
): void {
  const typeSeasonalityParts = typeWithOptionalSeasonality.split('.');
  const updatedThresholdType: ThresholdType = typeSeasonalityParts[0] as ThresholdType;

  const rule = form.get('rule')!.toJS();
  const { alertType } = rule;
  let newThresholdForm: MapForm = createThresholdForm(
    {
      ...form.get('threshold')!.toJS(),
      type: updatedThresholdType
    },
    alertType
  );

  if (updatedThresholdType === HISTORIC_BASELINE) {
    const seasonality = typeSeasonalityParts[1];
    newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
      (f as Field<string>).setValue(seasonality).setTouched(true)
    );
  }

  const newRuleForm = createRuleForm({ ...rule });

  let updatedForm = form.put('threshold', newThresholdForm).put('rule', newRuleForm);

  if (updatedThresholdType === ADAPTIVE_BASELINE) {
    // resetting granularity and timeThreshold when threshold type is switched to adaptive-baseline
    updatedForm = updatedForm.put(
      'timeThreshold',
      createViolationsInSequenceForm(
        {
          timeWindow: defaultAdaptiveBaselineTimeWindow,
          type: 'violationsInSequence'
        },
        ADAPTIVE_BASELINE
      )
    );

    let evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
    let evaluationTypeChanged = false;

    if (evaluationType == PER_AP_ENDPOINT && !perEndpointAdaptiveBaselineEnabled) {
      evaluationType = PER_AP_SERVICE;
      evaluationTypeChanged = true;
    }

    if (evaluationTypeChanged) {
      updatedForm = updatedForm.updateIn(['evaluationType'], f =>
        (f as Field<AlertEvaluationType>).setValue(evaluationType).setTouched(true)
      );
    }

    updatedForm = updatedForm.updateIn(['granularity'], f =>
      (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
    );
  }

  updateForm(updatedForm);

  trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
}
