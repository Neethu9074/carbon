/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}

export function getThresholdComboBoxValue(form) {
  let result = form.get('threshold').get('type').value;
  if (form.get('threshold').get('seasonality')) {
    result += '.' + form.get('threshold').get('seasonality').value;
  }
  return result;
}
