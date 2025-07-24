/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';

import { Granularity, ThresholdType } from '@instana/types';

import { defaultAdaptiveBaselineTimeWindow } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { defaultAdaptiveBaselineGranularity } from 'in-alerting/smart-alerts/mobileApp/form/alertDialogFormDefinition';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export function updateFormIfHistoricBaseline(
  form: MapForm<any>,
  thresholdType: ThresholdType,
  granularity: Granularity
): MapForm<any> {
  if (thresholdType != HISTORIC_BASELINE) {
    return form;
  }

  if (granularity == 60000) {
    form = form
      // resetting to default granularity required
      .updateIn(['granularity'], f => (f as Field<number>).setValue(300000).setTouched(true))
      // also adjust properties such as timeThreshold window size which depend on the used granularity
      // @ts-expect-error ts cant determine nested paths of MapForm<any>
      .updateIn(['timeThreshold', 'timeWindow'], f => (f as Field<number>).setValue(300000).setTouched(true));
  }

  return form;
}

export function updateFormIfAdaptiveBaseline(
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
