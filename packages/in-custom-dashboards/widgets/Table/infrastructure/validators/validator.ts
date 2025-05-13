/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

interface Metric {
  value: string;
  label: string;
  aggregation: string;
}

export function notDuplicatedMetricValues(fieldsArray: any): ValidationResult {
  if (!Array.isArray(fieldsArray) || fieldsArray.length === 0) {
    return null;
  }

  const metrics: Metric[] = fieldsArray?.map(field => {
    const metric = field?.get('metric')?.value;
    const metricLabel = field?.get('metricLabel')?.value;
    const aggregation = field?.get('aggregation')?.value;

    return {
      value: metric,
      label: metricLabel,
      aggregation
    };
  });

  const hasDuplicates = hasDuplicatesByProperties(metrics, ['value', 'aggregation']);

  if (hasDuplicates) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.table.form.infrastructure.validators.theValueMustBeUnique')
      }
    ];
  }

  return null;
}

function hasDuplicatesByProperties(array: Metric[], properties: Array<keyof Metric>): boolean {
  const compositeKeysSet = new Set<string>();

  for (var object of array) {
    if (Object.values(object).some(value => value !== '')) {
      const compositeKey = properties.map(property => String(object[property])).join('_');

      if (compositeKeysSet.has(compositeKey)) {
        return true;
      }

      compositeKeysSet.add(compositeKey);
    }
  }

  return false;
}
