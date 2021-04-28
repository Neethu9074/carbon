/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleFormData';
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';

export function getAggregationOptions(form) {
  if (getFormValueOrDefault(form.get('threshold'), 'seasonality') === 'WEEKLY') {
    return ruleAggregationForWeeklySeasonalityOptions;
  }
  return ruleAggregationOptions;
}
