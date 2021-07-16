/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';

describe('in-websites/alerting/form/thresholdForm', () => {
  describe('when alertType is slowness', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createThresholdForm({ type: STATIC_THRESHOLD }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
    });

    describe('when thresholdType includes HISTORIC_BASELINE', () => {
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

  describe('when alertType is specificJsError', () => {
    it('should contain fields: type, operator, lastUpdated, value', () => {
      const thresholdForm = createThresholdForm({}, 'specificJsError').toJS();
      expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
    });
  });

  describe('when alertType is statusCode', () => {
    it('should contain fields: type, operator, lastUpdated, value', () => {
      const thresholdForm = createThresholdForm({}, 'statusCode').toJS();
      expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
    });
  });
});
