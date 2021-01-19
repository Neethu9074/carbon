/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getFormValueOrDefault } from 'in-new-components/Alerting/advanced/thresholdFormHelper';

export function getAggregationText(aggregation) {
  switch (aggregation.toUpperCase()) {
    case 'P25':
      return '25th';
    case 'P50':
      return '50th';
    case 'P75':
      return '75th';
    case 'P90':
      return '90th';
    case 'P95':
      return '95th';
    case 'P98':
      return '98th';
    case 'P99':
      return '99th';
    default:
      return aggregation.toLowerCase();
  }
}

export function findEntryByValue(valueLabelPairList, value) {
  const items = valueLabelPairList ?? [];
  return items.find(item => item?.value === value);
}

export function alertConfigWithDefaultThreshold(form) {
  return {
    ...form.toJS(),
    threshold: {
      ...form.get('threshold').toJS(),
      value: form.get('threshold').get('value').value || 0
    }
  };
}

export function alertConfigWithDefaultValues(form) {
  return {
    ...form.toJS(),
    threshold: {
      ...form.get('threshold').toJS(),
      value: getFormValueOrDefault(form.get('threshold'), 'value', 0),
      baseline: getFormValueOrDefault(form.get('threshold'), 'baseline', []),
      deviationFactor: Number(getFormValueOrDefault(form.get('threshold'), 'deviationFactor', 0))
    }
  };
}
