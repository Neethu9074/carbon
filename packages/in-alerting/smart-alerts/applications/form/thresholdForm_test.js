/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';

describe('in-alerting/smart-alerts/applications/form/thresholdForm', () => {
  describe('when alertType is slowness', () => {
    describe('when thresholdType is staticThreshold', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createThresholdForm({ type: STATIC_THRESHOLD }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
    });

    describe('when thresholdType includes historicBaseline', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createThresholdForm({ type: HISTORIC_BASELINE }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys(
          'type',
          'operator',
          'lastUpdated',
          'seasonality',
          'baseline',
          'deviationFactor'
        );
      });
    });
  });

  describe('when thresholdType is adaptiveBaseline', () => {
    it('should contain fields: type, operator, lastUpdated, baseline, deviationFactor', () => {
      const thresholdForm = createThresholdForm({ type: ADAPTIVE_BASELINE }, 'slowness').toJS();
      expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'baseline', 'deviationFactor');
    });
  });
});
