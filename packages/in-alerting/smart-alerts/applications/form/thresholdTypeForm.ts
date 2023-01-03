/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';

import { defaultAdaptiveBaselineTimeWindow } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { perEndpointAdaptiveBaselineEnabled } from 'in-services/featureFlags';
import { AlertEvaluationType, ThresholdType, Granularity } from 'in-types';

export function onThresholdTypeChange(
  typeWithOptionalSeasonality: string,
  form: MapForm,
  updateForm: (form: MapForm) => void,
  trackThresholdTypeChanged?: (trackingObject: object) => void
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

  const granularity = (form.get('granularity') as Field<Granularity>).value;
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
  updatedForm = updateFormIfAdaptiveBaseline(updatedForm, updatedThresholdType, granularity, evaluationType);

  updateForm(updatedForm);

  trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
}

function updateFormIfAdaptiveBaseline(
  form: MapForm,
  thresholdType: ThresholdType,
  granularity: Granularity,
  evaluationType: AlertEvaluationType
): MapForm {
  if (thresholdType != ADAPTIVE_BASELINE) {
    return form;
  }

  if (evaluationType == PER_AP_ENDPOINT && !perEndpointAdaptiveBaselineEnabled) {
    // change in evaluation type is required, as long as we don't allow Endpoint evaluation with adaptive thresholds
    evaluationType = PER_AP_SERVICE;
    form = form.updateIn(['evaluationType'], f =>
      (f as Field<AlertEvaluationType>).setValue(evaluationType).setTouched(true)
    );
  }

  if (granularity < defaultAdaptiveBaselineTimeWindow) {
    form = form
      // resetting to default granularity required
      .updateIn(['granularity'], f =>
        (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
      )
      // also adjust properties such as timeThreshold window size which depend on the used granularity
      .updateIn(['timeThreshold', 'timeWindow'], f =>
        (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
      );
  }

  return form;
}
