/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export function getAggregationText(aggregation) {
  switch (aggregation.toUpperCase()) {
    case 'P25':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP25');
    case 'P50':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP50');
    case 'P75':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP75');
    case 'P90':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP90');
    case 'P95':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP95');
    case 'P98':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP98');
    case 'P99':
      return t('in-alerting:smartAlerts.components.utils.aggregationTextP99');
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
