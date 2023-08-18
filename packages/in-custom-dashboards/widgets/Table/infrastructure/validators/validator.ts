/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

export function notDuplicatedMetricValues(fieldsArray: any): ValidationResult {
  if (!Array.isArray(fieldsArray) || fieldsArray.length === 0) {
    return null;
  }

  const metricsArray = fieldsArray?.map((field: any) => {
    const metric = field?.get('metric')?.value;
    const metricLabel = field?.get('metricLabel')?.value;

    return {
      value: metric,
      label: metricLabel
    };
  });

  const hasDuplicates = hasDuplicatesByProperty(metricsArray, 'value');

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

function hasDuplicatesByProperty<T>(arr: any, property: keyof T): boolean {
  const valuesSet = new Set<T[keyof T]>();

  for (const object of arr) {
    const value = object[property];

    if (value !== '') {
      if (valuesSet.has(value)) {
        return true;
      }

      valuesSet.add(value);
    }
  }

  return false;
}
