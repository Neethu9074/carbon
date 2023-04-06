/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm } from 'formalistic';

import {
  Options,
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions
} from 'in-alerting/smart-alerts/components/dialog/form/ruleFormData';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormHelper';
import { WEEKLY } from 'in-alerting/smart-alerts/data/seasonalities';

export function getAggregationOptions(form: MapForm<any>): readonly Options[] {
  const thresholdMapForm: MapForm<any> = form.get('threshold') as MapForm<any>;
  if (getFormValueOrDefault(thresholdMapForm, 'seasonality') === WEEKLY) {
    return ruleAggregationForWeeklySeasonalityOptions;
  }
  return ruleAggregationOptions;
}
