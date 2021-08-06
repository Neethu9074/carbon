/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export function getFormValueOrDefault(form: MapForm, key: string, defaultValue = null): any {
  const item: Field<any> | undefined = form.get(key) as Field<any> | undefined;
  return form.containsKey(key) ? item?.value : defaultValue;
}

export function getThresholdComboBoxValue(form: MapForm): string {
  const thresholdForm: MapForm = form.get('threshold') as MapForm;
  const thresholdType: Field<any> | undefined = thresholdForm.get('type') as Field<any> | undefined;
  const seasonality: Field<any> | undefined = thresholdForm.get('seasonality') as Field<any> | undefined;
  let type: string = thresholdType?.value;
  if (type === HISTORIC_BASELINE) {
    return `${type}.${seasonality?.value}`;
  }
  return type;
}
