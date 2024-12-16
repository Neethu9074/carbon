/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';

import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

export function getFormValueOrDefault<T>(form: MapForm<any>, key: string, defaultValue: T | null = null): T | null {
  const item = form.get(key) as Field<T> | undefined;
  return item?.value ?? defaultValue;
}

/**
 * This heavily depends on the given form having a 'threshold' field, which is a
 * MapForm, having field 'type' !
 * optionally it uses its 'seasonality' field in case of a HISTORIC_BASELINE
 */
export function getThresholdComboBoxValue(form: MapForm<any>): string | undefined {
  const thresholdForm = form.get('threshold') as MapForm<any>;
  const thresholdType = thresholdForm.get('type') as Field<string> | undefined;
  let type = thresholdType?.value;
  if (type === HISTORIC_BASELINE) {
    const seasonality = thresholdForm.get('seasonality') as Field<any> | undefined;
    return `${type}.${seasonality?.value}`;
  }
  return type;
}

export function getMultiThresholdComboBoxValue(form: MapForm<any>): string | undefined {
  const thresholdForm = form.get('threshold') as MapForm<any>;
  const warningThresholdField = thresholdForm.get('warningThreshold');
  const thresholdType = warningThresholdField.get('type');
  let type = thresholdType?.value;
  if (type === HISTORIC_BASELINE) {
    const seasonality = warningThresholdField.get('seasonality') as Field<any> | undefined;
    return `${type}.${seasonality?.value}`;
  }
  return type;
}
