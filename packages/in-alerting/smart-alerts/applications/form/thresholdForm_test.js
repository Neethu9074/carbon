/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createSlownessForm } from 'in-alerting/smart-alerts/applications/form/thresholdForm';

describe('in-alerting/smart-alerts/applications/form/thresholdForm', () => {
  describe('when alertType is slowness', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      it('should contain fields: type, operator, lastUpdated, value', () => {
        const thresholdForm = createSlownessForm({ type: STATIC_THRESHOLD }).toJS();
        expect(thresholdForm).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
    });

    describe('when thresholdType includes HISTORIC_BASELINE', () => {
      it('should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        const thresholdForm = createSlownessForm({ type: HISTORIC_BASELINE }).toJS();
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
