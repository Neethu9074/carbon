/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';

import {
  createSmartAlertForm,
  CreateApplicationAlertConfig
} from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useApplicationSmartAlertFormSideEffects';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

describe('in-alerting/smart-alerts/applications/hooks/useSmartAlertFormSideEffects', () => {
  const initialAlertData = {
    boundaryScope: 'INBOUND',
    rules: [
      {
        rule: {
          alertType: 'slowness',
          operator: 'EQUALS',
          metricName: 'latency'
        },
        thresholdOperator: '>=',
        thresholds: {
          WARNING: {
            type: HISTORIC_BASELINE,
            deviationFactor: defaultDeviationFactor,
            seasonality: DAILY,
            baseline: [1],
            isCheckboxSelected: true
          },
          CRITICAL: {
            type: HISTORIC_BASELINE,
            deviationFactor: defaultDeviationFactor,
            seasonality: DAILY,
            isCheckboxSelected: false
          }
        }
      }
    ],
    calculateThresholdOnBackend: false,
    includeSynthetic: false,
    applications: getEntitySelection('foo')
  } as unknown as CreateApplicationAlertConfig;

  describe('when updating the alert form', () => {
    let updatedForm = {};
    const form = createSmartAlertForm(initialAlertData, true);

    const updateForm = useSmartAlertFormSideEffects(form, f => {
      updatedForm = f.toJS();
    });

    it('new threshold suggestions also resets an existing baseline', () => {
      updateForm(form.updateIn(['boundaryScope'], f => f.setValue('ALL')));

      expect(updatedForm).toEqual(
        expect.objectContaining({
          hiddenFields: {
            calculateThresholdOnBackend: true,
            chartViewEntitySelection: {
              applicationId: null,
              endpointId: null,
              serviceId: null
            },
            evaluationGroupByCount: {
              groupByPER_AP: 0,
              groupByPER_AP_ENDPOINT: 0,
              groupByPER_AP_SERVICE: 0
            },
            selectedChannelList: [],
            suggestedThresholdValue: null
          }
        })
      );

      expect(updatedForm).toEqual(
        expect.objectContaining({
          threshold: {
            operator: '>=',
            warningThreshold: {
              type: 'historicBaseline',
              baseline: [],
              deviationFactor: defaultDeviationFactor,
              isCheckboxSelected: true,
              seasonality: DAILY
            },
            criticalThreshold: {
              type: 'historicBaseline',
              baseline: [],
              deviationFactor: defaultDeviationFactor,
              isCheckboxSelected: false,
              seasonality: DAILY
            }
          }
        })
      );
    });

    it('resetting the threshold also requests a new baseline', () => {
      updateForm(
        form.updateIn(['rule', 'alertType'], field => (field as Field<string>).setValue('throughput').setTouched(true))
      );

      expect(updatedForm).toEqual(
        expect.objectContaining({
          hiddenFields: {
            calculateThresholdOnBackend: true,
            chartViewEntitySelection: {
              applicationId: null,
              endpointId: null,
              serviceId: null
            },
            evaluationGroupByCount: {
              groupByPER_AP: 0,
              groupByPER_AP_ENDPOINT: 0,
              groupByPER_AP_SERVICE: 0
            },
            selectedChannelList: [],
            suggestedThresholdValue: null
          }
        })
      );
    });
  });
});
