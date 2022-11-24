/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, Item, MapForm, ValidationResult } from 'formalistic';
import { isEmpty } from 'lodash';

import { t } from '@instana/i18n-react';

export function customEventRulesValidator(mapFormRules: Item[] = []): ValidationResult {
  const interactedRules = (mapFormRules as MapForm[]).filter(
    rule => rule.get('metricName')?.touched || !isEmpty((rule.get('metricName') as Field<string>)?.value)
  );

  if (interactedRules.length >= 2) {
    const metricNames = interactedRules.map(rule => (rule.get('metricName') as Field<string>)?.value);
    const uniqueMetricNames = new Set(metricNames);

    if (interactedRules.length !== uniqueMetricNames.size) {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.noMoreThanOneThresholdCanBeDefinedOnSameMetric')
        }
      ];
    }

    const numberOfMetricPatternsUsingOperatorOtherThanIs = interactedRules
      .filter(rule => !isEmpty((rule.get('metricPatternOperator') as Field<string>)?.value))
      .filter(rule => (rule.get('metricPatternOperator') as Field<string>).value !== 'is').length;

    if (numberOfMetricPatternsUsingOperatorOtherThanIs >= 2) {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.onlyOneRuleIsAllowedToHaveDifferentOperatorThanIs')
        }
      ];
    }
  }

  return null;
}
