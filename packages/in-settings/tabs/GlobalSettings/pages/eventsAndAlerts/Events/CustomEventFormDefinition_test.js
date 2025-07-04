/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createEventFormDefinition } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';

const testCustomEventSingleRuleEntity = {
  name: 'Test-event',
  entityType: 'awsRds',
  description: 'Some nice description!',
  expirationTime: 5000,
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
    }
  ]
};
const testCustomEventMultiRuleEntity = {
  ...testCustomEventSingleRuleEntity,
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
        prefix: 'fs',
        postfix: 'used',
        placeholder: null,
        operator: 'any'
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
    },
    {
      ruleType: 'threshold',
      severity: 10,
      metricName: 'read_latency',
      rollup: 0,
      window: 10000,
      metricPattern: null,
      aggregation: 'max',
      conditionOperator: '>=',
      conditionValue: 1234.567,
      metricLabel: 'Read Latency',
      metricFormat: 'MILLIS'
    }
  ]
};

describe('in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition:createEventFormDefinition', () => {
  describe('creating form model', function () {
    it('for single-rule builtin metric', () => {
      const eventFormDefinition = createEventFormDefinition(testCustomEventSingleRuleEntity, false);

      expect(eventFormDefinition.toJS()).toMatchInlineSnapshot(`
        Object {
          "actionIds": Array [],
          "applyOn": "all",
          "dataSource": "custom",
          "description": "Some nice description!",
          "entityType": "awsRds",
          "gracePeriod": "5000",
          "name": "Test-event",
          "ruleLogicalOperator": "AND",
          "rules": Array [
            Object {
              "aggregation": "avg",
              "conditionOperator": ">",
              "conditionValue": "10",
              "entityType": "awsRds",
              "formatter": "PERCENTAGE",
              "metricName": "cpu.used",
              "window": "60000",
            },
          ],
          "severity": "10",
          "transientEventAlertMuted": false,
          "transientEventEnabled": true,
          "transientEventThreshold": 300000,
          "triggering": undefined,
        }
      `);
    });
    it('for multi-rule builtin metric', () => {
      const eventFormDefinition = createEventFormDefinition(testCustomEventMultiRuleEntity, false);

      expect(eventFormDefinition.toJS()).toMatchInlineSnapshot(`
        Object {
          "actionIds": Array [],
          "applyOn": "all",
          "dataSource": "custom",
          "description": "Some nice description!",
          "entityType": "awsRds",
          "gracePeriod": "5000",
          "name": "Test-event",
          "ruleLogicalOperator": "AND",
          "rules": Array [
            Object {
              "aggregation": "avg",
              "conditionOperator": ">",
              "conditionValue": "10",
              "entityType": "awsRds",
              "formatter": "PERCENTAGE",
              "metricName": "cpu.used",
              "window": "60000",
            },
            Object {
              "aggregation": "avg",
              "conditionOperator": ">",
              "conditionValue": "0.01",
              "entityType": "awsRds",
              "formatter": "UNDEFINED",
              "metricName": "fs.*.used",
              "window": "60000",
            },
            Object {
              "aggregation": "avg",
              "conditionOperator": ">",
              "conditionValue": "1",
              "entityType": "awsRds",
              "formatter": "UNDEFINED",
              "metricName": "fs.*.free",
              "window": "60000",
            },
            Object {
              "aggregation": "max",
              "conditionOperator": ">=",
              "conditionValue": "1234.567",
              "entityType": "awsRds",
              "formatter": "MILLIS",
              "metricName": "read_latency",
              "window": "10000",
            },
          ],
          "severity": "10",
          "transientEventAlertMuted": false,
          "transientEventEnabled": true,
          "transientEventThreshold": 300000,
          "triggering": undefined,
        }
      `);
    });
  });
});
