/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';

import { defaultAdaptiveBaselineTimeWindow } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { ThresholdType, Granularity } from 'in-types';

export function onThresholdTypeChange(
  typeWithOptionalSeasonality: string,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
): void {
  const typeSeasonalityParts = typeWithOptionalSeasonality.split('.');
  const updatedThresholdType: ThresholdType = typeSeasonalityParts[0] as ThresholdType;

  const rule = form.get('rule')!.toJS();
  const { alertType } = rule;
  let newThresholdForm: MapForm<any> = createThresholdForm(
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

  const ruleWithoutAggregation = { ...rule, aggregation: null };
  // aggregation will be reset to default value
  const newRuleForm = createRuleForm(ruleWithoutAggregation);

  let updatedForm = form.put('threshold', newThresholdForm).put('rule', newRuleForm);

  const granularity = (form.get('granularity') as Field<Granularity>).value;
  updatedForm = updateFormIfAdaptiveBaseline(updatedForm, updatedThresholdType, granularity);

  updateForm(updatedForm);
}

function updateFormIfAdaptiveBaseline(
  form: MapForm<any>,
  thresholdType: ThresholdType,
  granularity: Granularity
): MapForm<any> {
  if (thresholdType != ADAPTIVE_BASELINE || granularity >= defaultAdaptiveBaselineTimeWindow) {
    return form;
  }

  return (
    form
      // resetting to default granularity required
      .updateIn(['granularity'], f =>
        (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
      )
      // also adjust properties such as timeThreshold window size which depend on the used granularity
      // @ts-expect-error ts has problems with nested updates if on MapForm<any> since the form structure is not known
      .updateIn(['timeThreshold', 'timeWindow'], f =>
        (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
      )
  );
}
