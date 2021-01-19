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
} from 'in-applications/alerting/form/thresholdForm';
import { createViolationsInSequenceForm } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

describe('in-applications/alerting/form/blueprintFormCreator', () => {
  const someTagFilters = [
    'call.latency',
    'call.erroneous',
    'call.error.count',
    'call.error.message',
    'log.message',
    'log.level'
  ];

  function createDummyTagFilter(name) {
    return {
      name,
      operator: 'operator',
      stringValue: 'stringValue'
    };
  }

  function createTagFiltersForm() {
    return createField({
      value: someTagFilters.map(createDummyTagFilter)
    });
  }

  function createTagFilterExpressionForm() {
    return createField({
      value: []
    });
  }

  const extractFilterName = filter => filter?.name;

  context('when alertType is slowness', () => {
    context('when thresholdType is staticThreshold', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilters', createTagFiltersForm()) // QB1
          .put('tagFilterExpression', createTagFilterExpressionForm()) // QB2
          .put('threshold', thresholdCreateSlownessForm({ type: 'staticThreshold', value: 5 }))
          .put('rule', createRuleForm({ alertType: 'slowness' }))
          .put('timeThreshold', createViolationsInSequenceForm({})),
        'slowness'
      );
      it('should contain fields: alertType, metricName, aggregation, type, operator, lastUpdated, value', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'aggregation');
        expect(blueprintForm.get('threshold').toJS()).to.have.keys('type', 'operator', 'lastUpdated', 'value');
      });
      it('should have thresholdType "dynamicBaseline"', () => {
        expect(blueprintForm.get('threshold').get('type').value).to.equal('staticThreshold');
      });
    });
    context('when thresholdType is historicBaseline', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilters', createTagFiltersForm()) // QB1
          .put('tagFilterExpression', createTagFilterExpressionForm()) // QB2
          .put(
            'threshold',
            thresholdCreateSlownessForm({
              type: 'historicBaseline',
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

      it('should have thresholdType "historicBaseline"', () => {
        expect(blueprintForm.get('threshold').get('type').value).to.equal('historicBaseline');
      });
      it('should have seasonality "DAILY"', () => {
        expect(blueprintForm.get('threshold').get('seasonality').value).to.equal('DAILY');
      });
    });
    it('should have metricName "latency"', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilters', createTagFiltersForm()) // QB1
          .put('tagFilterExpression', createTagFilterExpressionForm()) // QB2
          .put('threshold', thresholdCreateSlownessForm({ type: 'staticThreshold' }))
          .put('rule', createRuleForm({ alertType: 'slowness', metricName: 'latency' }))
          .put('timeThreshold', createViolationsInSequenceForm({})),
        'slowness'
      );
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('latency');
    });
    it('should filter out tagFilter "call.latency" but not "call.error.count"', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilters', createTagFiltersForm()) // QB1
          .put('tagFilterExpression', createTagFilterExpressionForm()) // QB2
          .put('threshold', thresholdCreateSlownessForm({ type: 'staticThreshold' }))
          .put('rule', createRuleForm({ alertType: 'slowness', metricName: 'latency' }))
          .put('timeThreshold', createViolationsInSequenceForm({})),
        'slowness'
      );
      const tagFilters = blueprintForm.get('tagFilters').value;
      expect(tagFilters.map(extractFilterName)).not.to.include('call.latency');
      expect(tagFilters.map(extractFilterName)).to.include('call.error.count');
    });
  });

  context('when alertType is errorRate', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('tagFilters', createTagFiltersForm()) // QB1
        .put('tagFilterExpression', createTagFilterExpressionForm()) // QB2
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

    it('should filter out tagFilter "call.erroneous", "call.error.count" or "call.error.message".', () => {
      const tagFilters = blueprintForm.get('tagFilters').value;
      expect(tagFilters.map(extractFilterName)).not.to.include('call.erroneous');
      expect(tagFilters.map(extractFilterName)).not.to.include('call.error.count');
      expect(tagFilters.map(extractFilterName)).not.to.include('call.error.message');
      expect(tagFilters.map(extractFilterName)).to.include('call.latency');
    });

    it('should have thresholdType "staticThreshold"', () => {
      const type = blueprintForm.get('threshold').get('type').value;
      expect(type).to.equal('staticThreshold');
    });
  });

  context('when alertType is logs', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('tagFilters', createTagFiltersForm()) // QB1
        .put('tagFilterExpression', createTagFilterExpressionForm()) // QB2
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

    it('should filter out tagFilter "log.message" and "log.level"', () => {
      const tagFilters = blueprintForm.get('tagFilters').value;
      expect(tagFilters.map(extractFilterName)).not.to.include('log.message');
      expect(tagFilters.map(extractFilterName)).not.to.include('log.level');
      expect(tagFilters.map(extractFilterName)).to.include('call.error.message');
      expect(tagFilters.map(extractFilterName)).to.include('call.latency');
    });

    it('should have thresholdType "staticThreshold"', () => {
      const type = blueprintForm.get('threshold').get('type').value;
      expect(type).to.equal('staticThreshold');
    });
  });
});
