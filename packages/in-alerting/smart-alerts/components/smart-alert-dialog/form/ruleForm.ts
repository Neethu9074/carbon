/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import {
  Options,
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleFormData';
import { WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';
import { MapForm } from 'formalistic';

export function getAggregationOptions(form: MapForm): readonly Options[] {
  const thresholdMapForm: MapForm = form.get('threshold') as MapForm;
  if (getFormValueOrDefault(thresholdMapForm, 'seasonality') === WEEKLY) {
    return ruleAggregationForWeeklySeasonalityOptions;
  }
  return ruleAggregationOptions;
}
