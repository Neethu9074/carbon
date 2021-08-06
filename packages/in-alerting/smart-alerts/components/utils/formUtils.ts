/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm } from 'formalistic';
import { AggregationType } from 'in-types';
import { t } from 'in-i18n';

import { getFormValueOrDefault } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';

export function getAggregationText(aggregation: AggregationType): string {
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

type ValueLabelPair = {
  value: string;
};

export function findEntryByValue(valueLabelPairList: ValueLabelPair[], value: string): ValueLabelPair | undefined {
  const items = valueLabelPairList ?? [];
  return items.find(item => item?.value === value);
}

export function alertConfigWithDefaultThreshold(form: MapForm) {
  const threshold: MapForm = form.get('threshold') as MapForm;
  const thresholdValue: Field<any> | undefined = threshold.get('value') as Field<any> | undefined;
  return {
    ...form.toJS(),
    threshold: {
      ...threshold.toJS(),
      value: thresholdValue?.value ?? 0
    }
  };
}

export function alertConfigWithDefaultValues(form: MapForm) {
  const threshold: MapForm = form.get('threshold') as MapForm;
  return {
    ...form.toJS(),
    threshold: {
      ...threshold.toJS(),
      value: getFormValueOrDefault(threshold, 'value', 0),
      baseline: getFormValueOrDefault(threshold, 'baseline', []),
      deviationFactor: Number(getFormValueOrDefault(threshold, 'deviationFactor', 0))
    }
  };
}
