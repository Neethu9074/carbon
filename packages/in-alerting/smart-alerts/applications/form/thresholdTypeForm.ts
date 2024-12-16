/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';

import {
  AlertEvaluationType,
  ThresholdType,
  Granularity,
  SmartAlertThresholdRuleUnion,
  StaticThresholdRule,
  StaticBaselineThresholdRule,
  AdaptiveThresholdRule
} from 'in-types';
import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { defaultAdaptiveBaselineTimeWindow } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import createThresholdForm, { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { updateFormIfHistoricBaseline } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdUtil';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/dialog/trackingHelpers';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { perEndpointAdaptiveBaselineEnabled } from 'in-services/featureFlags';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export function onThresholdTypeChange(
  typeWithOptionalSeasonality: string,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  trackThresholdTypeChanged?: (trackingObject: object) => void,
  editMode?: boolean
): void {
  const typeSeasonalityParts = typeWithOptionalSeasonality.split('.');
  const updatedThresholdType: ThresholdType = typeSeasonalityParts[0] as ThresholdType;
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');

  const rule = form.get('rule')!.toJS();
  const { alertType } = rule;
  let newThresholdForm: MapForm<any> = createThresholdForm(
    {
      rule,
      thresholdOperator: form.get('threshold').get('operator').value,
      thresholds: {
        WARNING: getMultithresholdThresholdRule(updatedThresholdType, warningThresholdField),
        CRITICAL: getMultithresholdThresholdRule(updatedThresholdType, criticalThresholdField)
      }
    },
    alertType,
    editMode
  );

  if (updatedThresholdType === HISTORIC_BASELINE) {
    const seasonality = typeSeasonalityParts[1];
    newThresholdForm = newThresholdForm
      .updateIn(['warningThreshold', 'seasonality'], f => (f as Field<string>).setValue(seasonality).setTouched(true))
      .updateIn(['criticalThreshold', 'seasonality'], f => (f as Field<string>).setValue(seasonality).setTouched(true));
  }

  const newRuleForm = createRuleForm({ ...rule });

  let updatedForm = form.put('threshold', newThresholdForm).put('rule', newRuleForm);

  const granularity = (form.get('granularity') as Field<Granularity>).value;
  const evaluationType = (form.get('evaluationType') as Field<AlertEvaluationType>).value;
  updatedForm = updateFormIfAdaptiveBaseline(updatedForm, updatedThresholdType, granularity, evaluationType);
  updatedForm = updateFormIfHistoricBaseline(updatedForm, updatedThresholdType, granularity);

  updateForm(updatedForm);

  trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
}

function getMultithresholdThresholdRule(type: string, thresholdField: MapForm<any>): SmartAlertThresholdRuleUnion {
  const isCheckboxSelected = thresholdField.get('isCheckboxSelected')?.value ?? false;
  switch (type) {
    case STATIC_THRESHOLD:
      return {
        type: STATIC_THRESHOLD,
        value: thresholdField.get('value')?.value ?? (isCheckboxSelected ? 0 : null),
        isCheckboxSelected
      } as StaticThresholdRule;
    case HISTORIC_BASELINE:
      return {
        type: HISTORIC_BASELINE,
        deviationFactor: thresholdField.get('deviationFactor')?.value ?? defaultDeviationFactor,
        baseline: thresholdField.get('baseline')?.value ?? [],
        seasonality: thresholdField.get('seasonality')?.value ?? DAILY,
        isCheckboxSelected
      } as StaticBaselineThresholdRule;
    case ADAPTIVE_BASELINE:
      return {
        type: ADAPTIVE_BASELINE,
        deviationFactor: thresholdField.get('deviationFactor')?.value ?? defaultDeviationFactor,
        isCheckboxSelected
      } as AdaptiveThresholdRule;
    default:
      throw new Error('Unknown threshold type');
  }
}

function updateFormIfAdaptiveBaseline(
  form: MapForm<any>,
  thresholdType: ThresholdType,
  granularity: Granularity,
  evaluationType: AlertEvaluationType
): MapForm<any> {
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
      // @ts-expect-error ts cant determine nested paths of MapForm<any>
      .updateIn(['timeThreshold', 'timeWindow'], f =>
        (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
      );
  }

  return form;
}
