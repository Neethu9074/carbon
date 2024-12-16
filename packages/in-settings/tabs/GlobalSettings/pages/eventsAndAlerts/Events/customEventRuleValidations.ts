/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, Item, MapForm, ValidationResult } from 'formalistic';
import { isEmpty } from 'lodash';

import { t } from '@instana/i18n-react';

import { AlertingAggregation } from 'in-types';

const aggregationsNotAllowedForOneSecondWindow: ReadonlyArray<AlertingAggregation> = Object.freeze([
  'relative_diff',
  'absolute_diff'
]);

export function customEventRulesValidator(mapFormRules: Item[] = []): ValidationResult {
  const interactedRules = (mapFormRules as MapForm<any>[]).filter(
    rule => rule.get('metricName')?.touched || !isEmpty((rule.get('metricName') as Field<string>)?.value)
  );

  if (interactedRules.length >= 2) {
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

  if (hasAggregationNotAllowedForOneSecondWindow(mapFormRules)) {
    if ((mapFormRules as MapForm<any>[])[0].get('window').value === '1000') {
      return [
        {
          severity: 'error',
          message: t('in-settings:tabs.oneSecondWindowIsNotAllowedWhenDiffAggregationIsUsed')
        }
      ];
    }
  }

  return null;
}

function hasAggregationNotAllowedForOneSecondWindow(mapFormRules: Item[]) {
  return (mapFormRules as MapForm<any>[])
    .map(rule => rule.get('aggregation')?.value)
    .some(aggregation => aggregationsNotAllowedForOneSecondWindow.includes(aggregation));
}
