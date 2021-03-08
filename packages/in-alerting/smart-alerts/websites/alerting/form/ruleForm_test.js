/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import createRuleForm from 'in-alerting/smart-alerts/websites/alerting/form/ruleForm';

describe('in-websites/alerting/form/ruleForm', () => {
  context('when alertType is slowness', () => {
    context('when thresholdType is staticThreshold', () => {
      it('should contain fields: alertType, metricName, aggregation', () => {
        const ruleForm = createRuleForm({ alertType: 'slowness' }, 'staticThreshold').toJS();
        expect(ruleForm).to.have.keys('alertType', 'metricName', 'aggregation');
      });
    });

    context('when thresholdType includes historicBaseline', () => {
      it('should contain fields: alertType, metricName, aggregation', () => {
        const ruleForm = createRuleForm({ alertType: 'slowness' }, 'historicBaseline').toJS();
        expect(ruleForm).to.have.keys('alertType', 'metricName', 'aggregation');
      });
    });
  });

  context('when alertType is specificJsError', () => {
    it('should contain fields: alertType, metricName, operator, value', () => {
      const ruleForm = createRuleForm({ alertType: 'specificJsError' }, null).toJS();
      expect(ruleForm).to.have.keys('alertType', 'metricName', 'operator', 'value');
    });
  });

  context('when alertType is statusCode', () => {
    it('should contain fields: alertType,  metricName, operator, value', () => {
      const ruleForm = createRuleForm({ alertType: 'statusCode' }, null).toJS();
      expect(ruleForm).to.have.keys('alertType', 'metricName', 'operator', 'value');
    });
  });
});
