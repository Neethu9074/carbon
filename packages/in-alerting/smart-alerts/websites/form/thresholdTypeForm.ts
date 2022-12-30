/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { Field, MapForm } from 'formalistic';

import {
  createViolationsInSequenceForm,
  defaultAdaptiveBaselineTimeWindow
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { ThresholdType } from 'in-types';

export function onThresholdTypeChange(
  typeWithOptionalSeasonality: string,
  form: MapForm,
  updateForm: (form: MapForm) => void,
  trackThresholdTypeChanged: (trackingObject: object) => void
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

  const ruleWithoutAggregation = { ...rule, aggregation: null };
  // aggregation will be reset to default value
  const newRuleForm = createRuleForm(ruleWithoutAggregation);

  let updatedForm = form.put('threshold', newThresholdForm).put('rule', newRuleForm);

  if (updatedThresholdType === ADAPTIVE_BASELINE) {
    // resetting granularity and timeThreshold when threshold type is switched to adaptive-baseline
    updatedForm = updatedForm.put(
      'timeThreshold',
      createViolationsInSequenceForm(
        {
          // TODO check which type we need to inject here:
          timeWindow: defaultAdaptiveBaselineTimeWindow,
          type: 'violationsInSequence'
        },
        ADAPTIVE_BASELINE
      )
    );

    updatedForm = updatedForm.updateIn(['granularity'], f =>
      (f as Field<number>).setValue(defaultAdaptiveBaselineGranularity).setTouched(true)
    );
  }

  updateForm(updatedForm);

  trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
}
