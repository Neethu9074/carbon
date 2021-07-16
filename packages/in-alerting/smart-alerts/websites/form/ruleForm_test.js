/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest */
import { expect } from 'chai';

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';

describe('in-websites/alerting/form/ruleForm', () => {
  describe('when alertType is slowness', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      it('should contain fields: alertType, metricName, aggregation', () => {
        const ruleForm = createRuleForm({ alertType: 'slowness' }, STATIC_THRESHOLD).toJS();
        expect(ruleForm).to.have.keys('alertType', 'metricName', 'aggregation');
      });
    });

    describe('when thresholdType includes HISTORIC_BASELINE', () => {
      it('should contain fields: alertType, metricName, aggregation', () => {
        const ruleForm = createRuleForm({ alertType: 'slowness' }, HISTORIC_BASELINE).toJS();
        expect(ruleForm).to.have.keys('alertType', 'metricName', 'aggregation');
      });
    });
  });

  describe('when alertType is specificJsError', () => {
    it('should contain fields: alertType, metricName, operator, value', () => {
      const ruleForm = createRuleForm({ alertType: 'specificJsError' }, null).toJS();
      expect(ruleForm).to.have.keys('alertType', 'metricName', 'operator', 'value');
    });
  });

  describe('when alertType is statusCode', () => {
    it('should contain fields: alertType,  metricName, operator, value', () => {
      const ruleForm = createRuleForm({ alertType: 'statusCode' }, null).toJS();
      expect(ruleForm).to.have.keys('alertType', 'metricName', 'operator', 'value');
    });
  });
});
