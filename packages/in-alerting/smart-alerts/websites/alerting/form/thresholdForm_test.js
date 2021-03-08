/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import createThresholdForm from 'in-alerting/smart-alerts/websites/alerting/form/thresholdForm';

describe('in-websites/alerting/form/thresholdForm', () => {
  context('when alertType is slowness', () => {
    context('when thresholdType is staticThreshold', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createThresholdForm({ type: 'staticThreshold' }, 'slowness').toJS();
        expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
    });

    context('when thresholdType includes historicBaseline', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createThresholdForm({ type: 'historicBaseline' }, 'slowness').toJS();
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

  context('when alertType is specificJsError', () => {
    it('should contain fields: type, operator, lastUpdated, value', () => {
      const thresholdForm = createThresholdForm({}, 'specificJsError').toJS();
      expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
    });
  });

  context('when alertType is statusCode', () => {
    it('should contain fields: type, operator, lastUpdated, value', () => {
      const thresholdForm = createThresholdForm({}, 'statusCode').toJS();
      expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
    });
  });
});
