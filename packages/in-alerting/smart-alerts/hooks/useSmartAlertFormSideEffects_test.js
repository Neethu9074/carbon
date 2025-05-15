/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
 */

import { expect } from 'chai';
import sinon from 'sinon';

import { useSmartAlertFormSideEffects } from 'in-alerting/smart-alerts/hooks/useSmartAlertMultiThresholdFormSideEffects';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
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
            value: 0.0,
            seasonality: DAILY,
            baseline: [1]
          }
        }
      }
    ],
    calculateThresholdOnBackend: false,
    includeSynthetic: false,
    applications: getEntitySelection('foo')
  };

  describe('when updating the alert form', () => {
    const form = createSmartAlertForm(initialAlertData);
    const setForm = sinon.fake();
    const updateForm = useSmartAlertFormSideEffects(form, setForm);

    it('new threshold suggestions also resets an existing baseline', () => {
      updateForm(form.updateIn(['boundaryScope'], f => f.setValue('ALL')));

      expect(setForm.lastArg.get('hiddenFields').get('calculateThresholdOnBackend').value).to.be.true;
      expect(setForm.lastArg.get('threshold').get('warningThreshold').get('baseline').value).to.be.empty;
    });

    it('resetting the threshold also requests a new baseline', () => {
      updateForm(form.updateIn(['rule', 'alertType'], f => f.setValue('throughput')));

      expect(setForm.lastArg.get('hiddenFields').get('calculateThresholdOnBackend').value).to.be.true;
    });
  });
});
