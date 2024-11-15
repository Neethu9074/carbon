/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';

import { useInfraSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/infrastructure/form/useInfraSmartAlertFormSideEffects';
import alertFormDefinition, {
  AlertConfigHiddenFields
} from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { VersionedConfig } from 'in-types';

describe('in-alerting/smart-alerts/infrastructure/form/useInfraSmartAlertFormSideEffects.ts', () => {
  it('resets threshold and request threshold suggestion when metric is updated', () => {
    let updatedForm = {};
    const form = alertFormDefinition(getDefaultConfig(), true);

    const updateForm = useInfraSmartAlertFormSideEffects(form, f => {
      updatedForm = f.toJS();
    });

    updateForm(
      form.updateIn(['rule', 'metricName'], field => (field as Field<string>).setValue('foo').setTouched(true))
    );

    expect(updatedForm).toEqual(
      expect.objectContaining({
        threshold: {
          operator: '>=',
          warningThreshold: { type: 'staticThreshold', value: null },
          criticalThreshold: { type: 'staticThreshold', value: null }
        }
      })
    );

    expect(updatedForm).toEqual(
      expect.objectContaining({
        hiddenFields: {
          calculateThresholdOnBackend: true,
          metricLabel: null,
          metricPath: null,
          selectedChannelList: [],
          suggestedThresholdValue: null
        }
      })
    );
  });
});

export function getDefaultConfig() {
  return {
    name: 'Host CPU Usage By Kind',
    description: 'Smart alert via API for Host CPU Usage',
    severity: 5,
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    },
    groupBy: ['metricId'],
    rule: {
      alertType: 'genericRule',
      metricName: 'cpu\\.(nice|user|sys|wait)',
      entityType: 'host',
      aggregation: 'MEAN',
      crossSeriesAggregation: 'SUM',
      regex: true
    },
    threshold: {
      type: 'staticThreshold',
      operator: '>=',
      value: 2.0,
      lastUpdated: 1703006690644
    },
    forecastingConfig: null,
    alertChannelIds: [],
    granularity: 60000,
    timeThreshold: {
      type: 'violationsInSequence',
      timeWindow: 60000
    },
    id: 'WlLOJ_r4Qm6GyUBXdUaEPQ',
    created: 1706733756329,
    initialCreated: 1703006690669,
    readOnly: false,
    enabled: false,
    customPayloadFields: [],
    rules: [
      {
        thresholdOperator: '>=',
        rule: {
          alertType: 'genericRule',
          metricName: 'cpu\\.(nice|user|sys|wait)',
          entityType: 'host',
          aggregation: 'MEAN',
          crossSeriesAggregation: 'SUM',
          regex: true
        },
        thresholds: {
          WARNING: {
            type: 'staticThreshold',
            value: 2.0
          },
          CRITICAL: {
            type: 'staticThreshold',
            value: 5.0
          }
        }
      }
    ]
  } as unknown as InfraSmartAlertConfig & VersionedConfig & AlertConfigHiddenFields;
}
