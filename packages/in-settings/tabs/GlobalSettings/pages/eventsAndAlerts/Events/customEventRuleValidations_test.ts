/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { t } from '@instana/i18n-react';

import { putMetricDataSourceFieldsForOneRule } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { customEventRulesValidator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventRuleValidations';
import { ThresholdRule } from 'in-types';

describe('in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventRuleValidations.ts', function () {
  const defaultRuleWithMetricName: Partial<ThresholdRule> = {
    ruleType: 'threshold',
    severity: 10,
    metricName: 'cpu.used',
    rollup: 0,
    window: 60000,
    metricPattern: undefined,
    aggregation: 'avg',
    conditionOperator: '<',
    conditionValue: 0.1
  };

  const defaultRuleWithMetricPattern: Partial<ThresholdRule> = {
    ruleType: 'threshold',
    severity: 10,
    metricName: undefined,
    rollup: 0,
    window: 60000,
    metricPattern: {
      prefix: 'fs',
      postfix: 'free',
      placeholder: '/dev/sda1',
      operator: 'is'
    },
    aggregation: 'avg',
    conditionOperator: '>',
    conditionValue: 1
  };

  it('no validation message for single metric', () => {
    const entityType = 'host';

    const rules = [defaultRuleWithMetricName];

    const mapForms = rules.map(rule => putMetricDataSourceFieldsForOneRule(entityType, rule));

    expect(customEventRulesValidator(mapForms)).toEqual(null);
  });

  it('no validation message for two different metrics', () => {
    const entityType = 'host';

    const rules = [defaultRuleWithMetricName, { ...defaultRuleWithMetricName, metricName: 'cpu.load' }];

    const mapForms = rules.map(rule => putMetricDataSourceFieldsForOneRule(entityType, rule));

    expect(customEventRulesValidator(mapForms)).toEqual(null);
  });

  it('no validation message for combination of metric and metric pattern', () => {
    const entityType = 'host';

    const rules = [defaultRuleWithMetricName, defaultRuleWithMetricPattern];

    const mapForms = rules.map(rule => putMetricDataSourceFieldsForOneRule(entityType, rule));

    expect(customEventRulesValidator(mapForms)).toEqual(null);
  });

  it('no validation message for combination of metric and metric patterns', () => {
    const entityType = 'host';

    const rules: Partial<ThresholdRule>[] = [
      defaultRuleWithMetricName,
      defaultRuleWithMetricPattern,
      {
        ...defaultRuleWithMetricPattern,
        metricPattern: {
          prefix: 'fs',
          postfix: 'used',
          placeholder: undefined,
          operator: 'any'
        }
      }
    ];

    const mapForms = rules.map(rule => putMetricDataSourceFieldsForOneRule(entityType, rule));

    expect(customEventRulesValidator(mapForms)).toEqual(null);
  });

  it('only one rule is allowed to have different operator than "is"', () => {
    const entityType = 'host';

    const rules: Partial<ThresholdRule>[] = [
      defaultRuleWithMetricName,
      {
        ...defaultRuleWithMetricPattern,
        metricPattern: {
          prefix: 'fs',
          postfix: 'free',
          placeholder: '/dev/sda1',
          operator: 'contains'
        }
      },
      {
        ...defaultRuleWithMetricPattern,
        metricPattern: {
          prefix: 'fs',
          postfix: 'used',
          placeholder: undefined,
          operator: 'any'
        }
      }
    ];

    const mapForms = rules.map(rule => putMetricDataSourceFieldsForOneRule(entityType, rule));

    expect(customEventRulesValidator(mapForms)).toEqual([
      {
        severity: 'error',
        message: t('in-settings:tabs.onlyOneRuleIsAllowedToHaveDifferentOperatorThanIs')
      }
    ]);
  });
});
