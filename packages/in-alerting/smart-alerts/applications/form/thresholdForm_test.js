/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { createSlownessForm } from 'in-alerting/smart-alerts/applications/form/thresholdForm';

describe('in-applications/alerting/form/thresholdForm', () => {
  context('when alertType is slowness', () => {
    context('when thresholdType is staticThreshold', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createSlownessForm({ type: 'staticThreshold' }).toJS();
        expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
    });

    context('when thresholdType includes historicBaseline', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createSlownessForm({ type: 'historicBaseline' }).toJS();
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
});
