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
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
// @ts-expect-error file needs to be converted into typescript
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
// @ts-expect-error file needs to be converted into typescript
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
// @ts-expect-error file needs to be converted into typescript
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { AlertEvaluationType, ThresholdType } from 'in-types';

export function onThresholdTypeChange(
  typeWithOptionalSeasonality: string,
  form: MapForm,
  updateForm: (form: MapForm) => void,
  trackThresholdTypeChanged: (trackingObject: any) => void
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

  const newRuleForm = createRuleForm({ ...rule });
  let updatedForm = form.put('threshold', newThresholdForm).put('rule', newRuleForm);

  if (updatedThresholdType === HISTORIC_BASELINE) {
    const seasonality = typeSeasonalityParts[1];
    newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
      (f as Field<string>).setValue(seasonality).setTouched(true)
    );
  }

  if (updatedThresholdType === ADAPTIVE_BASELINE) {
    // resetting granularity and timeThreshold when threshold type is switched to adaptive-baseline
    updatedForm = updatedForm
      .put(
        'timeThreshold',
        createViolationsInSequenceForm(
          {
            timeWindow: defaultAdaptiveBaselineTimeWindow,
            type: 'violationsInSequence'
          },
          ADAPTIVE_BASELINE
        )
      )
      .updateIn(['evaluationType'], f => (f as Field<AlertEvaluationType>).setValue(PER_AP).setTouched(true))
      .updateIn(['granularity'], f =>
        (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
      );
  }

  updateForm(updatedForm);

  trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
}
