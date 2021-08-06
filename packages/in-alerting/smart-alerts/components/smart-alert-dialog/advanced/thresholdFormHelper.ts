/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}

export function getThresholdComboBoxValue(form) {
  let type = form.get('threshold').get('type').value;
  if (type === HISTORIC_BASELINE) {
    return `${type}.${form.get('threshold').get('seasonality').value}`;
  }
  return type;
}
