/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { expect } from 'chai';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { createThresholdByType } from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator_test';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';

describe('in-alerting/smart-alerts/applications/form/thresholdForm', () => {
  describe('when alertType is slowness', () => {
    describe('when thresholdType is staticThreshold', () => {
      it('should contain fields: operator, warningThreshold, criticalThreshold', () => {
        const thresholdForm = createThresholdForm(
          {
            thresholdOperator: undefined,
            thresholds: {
              WARNING: createThresholdByType(STATIC_THRESHOLD),
              CRITICAL: { ...createThresholdByType(STATIC_THRESHOLD), value: null }
            }
          },
          'slowness'
        ).toJS();
        expect(thresholdForm).to.have.keys('warningThreshold', 'operator', 'criticalThreshold');
      });
    });

    describe('when thresholdType includes historicBaseline', () => {
      it('should contain fields: operator, warningThreshold, criticalThreshold', () => {
        const thresholdForm = createThresholdForm(
          {
            thresholdOperator: undefined,
            thresholds: {
              WARNING: createThresholdByType(HISTORIC_BASELINE),
              CRITICAL: createThresholdByType(HISTORIC_BASELINE)
            }
          },
          'slowness'
        ).toJS();
        expect(thresholdForm).to.have.keys('warningThreshold', 'operator', 'criticalThreshold');
      });
    });
  });

  describe('when thresholdType is adaptiveBaseline', () => {
    it('should contain fields: operator, baseline, warningThreshold, criticalThreshold', () => {
      const thresholdForm = createThresholdForm(
        {
          thresholdOperator: undefined,
          thresholds: {
            WARNING: createThresholdByType(ADAPTIVE_BASELINE),
            CRITICAL: createThresholdByType(ADAPTIVE_BASELINE)
          }
        },
        'slowness'
      ).toJS();
      expect(thresholdForm).to.have.keys('warningThreshold', 'operator', 'criticalThreshold', 'baseline');
    });
  });
});
