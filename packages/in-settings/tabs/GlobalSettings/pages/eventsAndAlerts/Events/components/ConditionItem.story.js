/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { putMetricDataSourceFieldsForOneRule } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { ConditionItem } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/components/ConditionItem';

const minimalCustomEvent = {
  name: 'Test-event',
  entityType: 'jvmRuntimePlatform',
  description: 'Some nice description!',
  rules: [
    {
      ruleType: 'threshold',
      severity: 10,
      metricName: 'cpu.used',
      rollup: 0,
      window: 60000,
      metricPattern: null,
      aggregation: 'avg',
      conditionOperator: '>',
      conditionValue: 0.1,
      metricLabel: 'Used',
      metricFormat: 'PERCENTAGE'
    },
    {
      ruleType: 'threshold',
      severity: 10,
      metricName: null,
      rollup: 0,
      window: 60000,
      metricPattern: {
        prefix: 'pools',
        postfix: null,
        placeholder: 'some-pool',
        operator: 'is'
      },
      aggregation: 'avg',
      conditionOperator: '>',
      conditionValue: 0.01,
      metricLabel: 'Unknown label',
      metricFormat: 'UNDEFINED'
    },
    {
      ruleType: 'threshold',
      severity: 10,
      metricName: null,
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
      conditionValue: 1,
      metricLabel: 'Unknown label',
      metricFormat: 'UNDEFINED'
    }
  ]
};

export default {
  component: ConditionItem,
  argTypes: {
    onChange: { action: 'onChange' }
  }
};

export const Default = {
  args: {
    builtInDataSourceSelected: true,
    compactLayout: true,
    disabled: false,
    onChange: () => {},
    hideTimeWindow: false,
    customMetricsForPlugin: false,
    customDataSourceSelected: false,
    entityType: minimalCustomEvent.entityType,
    form: putMetricDataSourceFieldsForOneRule(minimalCustomEvent.entityType, minimalCustomEvent.rules[0])
  }
};

export const WithMetricPattern = {
  args: {
    builtInDataSourceSelected: true,
    compactLayout: true,
    onChange: () => {},
    hideTimeWindow: true,
    customMetricsForPlugin: false,
    customDataSourceSelected: false,
    entityType: minimalCustomEvent.entityType,
    form: putMetricDataSourceFieldsForOneRule(minimalCustomEvent.entityType, minimalCustomEvent.rules[1])
  }
};
