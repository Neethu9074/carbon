/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
/* eslint-env mocha */
import { expect } from 'chai';

import {
  createErrorRateForm as thresholdCreateErrorRateForm,
  createSlownessForm as thresholdCreateSlownessForm,
  createLogsForm as thresholdCreateLogsForm
} from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

describe('in-alerting/smart-alerts/applications/form/blueprintFormCreator', () => {
  function createTagFilterExpressionForm() {
    return createField({
      value: []
    });
  }

  describe('when alertType is slowness', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put('threshold', thresholdCreateSlownessForm({ type: STATIC_THRESHOLD, value: 5 }))
          .put('rule', createRuleForm({ alertType: 'slowness' }))
          .put('timeThreshold', createViolationsInSequenceForm({})),
        'slowness'
      );
      it('should contain fields: alertType, metricName, aggregation, type, operator, lastUpdated, value', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'aggregation');
        expect(blueprintForm.get('threshold').toJS()).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
      it('should have thresholdType "dynamicBaseline"', () => {
        expect(blueprintForm.get('threshold').get('type').value).to.equal(STATIC_THRESHOLD);
      });
    });
    describe('when thresholdType is HISTORIC_BASELINE', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put(
            'threshold',
            thresholdCreateSlownessForm({
              type: HISTORIC_BASELINE,
              baseline: [1, 2, 3]
            })
          )
          .put('rule', createRuleForm({ alertType: 'slowness' }))
          .put('timeThreshold', createViolationsInSequenceForm({})),
        'slowness'
      );

      it('rule-form should contain fields: alertType, metricName', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'aggregation');
      });

      it('threshold-form should contain fields: type, operator, lastUpdated, seasonality, baseline, deviationFactor', () => {
        expect(blueprintForm.get('threshold').toJS()).to.have.keys(
          'type',
          'operator',
          'lastUpdated',
          'seasonality',
          'baseline',
          'deviationFactor'
        );
      });

      it('should have thresholdType "HISTORIC_BASELINE"', () => {
        expect(blueprintForm.get('threshold').get('type').value).to.equal(HISTORIC_BASELINE);
      });
      it('should have seasonality "DAILY"', () => {
        expect(blueprintForm.get('threshold').get('seasonality').value).to.equal(DAILY);
      });
    });
    it('should have metricName "latency"', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put('threshold', thresholdCreateSlownessForm({ type: STATIC_THRESHOLD }))
          .put('rule', createRuleForm({ alertType: 'slowness', metricName: 'latency' }))
          .put('timeThreshold', createViolationsInSequenceForm({})),
        'slowness'
      );
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('latency');
    });
  });

  describe('when alertType is errorRate', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('tagFilterExpression', createTagFilterExpressionForm())
        .put('threshold', thresholdCreateErrorRateForm())
        .put('rule', createRuleForm({ alertType: 'errorRate' }))
        .put('timeThreshold', createViolationsInSequenceForm({})),
      'errorRate'
    );

    it('should contain fields: alertType, metricName, type, operator, lastUpdated, value', () => {
      expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName');
      expect(blueprintForm.get('threshold').toJS()).to.have.keys('type', 'operator', 'lastUpdated', 'value');
    });

    it('should have metricName "errors"', () => {
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('errors');
    });

    it('should have thresholdType "STATIC_THRESHOLD"', () => {
      const type = blueprintForm.get('threshold').get('type').value;
      expect(type).to.equal(STATIC_THRESHOLD);
    });
  });

  describe('when alertType is logs', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('tagFilterExpression', createTagFilterExpressionForm())
        .put('threshold', thresholdCreateLogsForm())
        .put('rule', createRuleForm({ alertType: 'logs' }))
        .put('timeThreshold', createViolationsInSequenceForm({})),
      'logs'
    );

    it('should contain fields: alertType, metricName, type, operator, lastUpdated, message, level', () => {
      expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'operator', 'message', 'level');
      expect(blueprintForm.get('threshold').toJS()).to.have.keys('type', 'operator', 'lastUpdated', 'value');
    });

    it('should have metricName "calls"', () => {
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('calls');
    });

    it('should have thresholdType "STATIC_THRESHOLD"', () => {
      const type = blueprintForm.get('threshold').get('type').value;
      expect(type).to.equal(STATIC_THRESHOLD);
    });
  });
});
