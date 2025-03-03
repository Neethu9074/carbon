/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';

export function createThresholdByType(type) {
  switch (type) {
    case 'staticThreshold':
      return {
        type: STATIC_THRESHOLD,
        value: 5
      };
    case 'historicBaseline':
      return {
        type: HISTORIC_BASELINE,
        baseline: [1, 2, 3]
      };
    case 'adaptiveBaseline':
      return {
        type: ADAPTIVE_BASELINE,
        baseline: []
      };
    default:
      return {};
  }
}

describe('in-websites/alerting/form/thresholdForm', () => {
  describe('when alertType is slowness', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createThresholdTestForm({ type: STATIC_THRESHOLD }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys('criticalThreshold', 'warningThreshold', 'operator');
        expect(thresholdForm.criticalThreshold).to.have.keys('isCheckboxSelected', 'type', 'value');
      });
    });

    describe('when thresholdType includes HISTORIC_BASELINE', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createThresholdTestForm({ type: HISTORIC_BASELINE }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys('criticalThreshold', 'warningThreshold', 'operator');
        expect(thresholdForm.criticalThreshold).to.have.keys(
          'isCheckboxSelected',
          'type',
          'seasonality',
          'baseline',
          'deviationFactor'
        );
      });
    });

    describe('when thresholdType includes ADAPTIVE_THRESHOLD', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createThresholdTestForm({ type: ADAPTIVE_BASELINE }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys('criticalThreshold', 'warningThreshold', 'operator', 'baseline');
        expect(thresholdForm.criticalThreshold).to.have.keys('isCheckboxSelected', 'type', 'deviationFactor');
      });
    });
  });

  describe('when alertType is specificJsError', () => {
    it('should contain fields: type, operator, lastUpdated, value', () => {
      const thresholdForm = createThresholdTestForm({}, 'specificJsError').toJS();
      expect(thresholdForm).to.have.keys('criticalThreshold', 'warningThreshold', 'operator');
    });
  });

  describe('when alertType is statusCode', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createThresholdTestForm({ type: STATIC_THRESHOLD }, 'statusCode').toJS();
        expect(thresholdForm).to.have.keys('criticalThreshold', 'warningThreshold', 'operator');
        expect(thresholdForm.criticalThreshold).to.have.keys('isCheckboxSelected', 'type', 'value');
      });
    });

    describe('when thresholdType includes HISTORIC_BASELINE', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createThresholdTestForm({ type: HISTORIC_BASELINE }, 'statusCode').toJS();
        expect(thresholdForm).to.have.keys('operator', 'criticalThreshold', 'warningThreshold');
        expect(thresholdForm.criticalThreshold).to.have.keys(
          'type',
          'seasonality',
          'baseline',
          'deviationFactor',
          'isCheckboxSelected'
        );
      });
    });
  });
});

const createThresholdTestForm = (threshold, alertType) => {
  return createThresholdForm(
    {
      thresholdOperator: undefined,
      thresholds: {
        WARNING: createThresholdByType(threshold.type),
        CRITICAL: createThresholdByType(threshold.type)
      }
    },
    alertType
  );
};
