/* eslint-env mocha */
import { expect } from 'chai';
import { createMapForm } from 'formalistic';

import {
  createErrorRateForm as thresholdCreateErrorRateForm,
  createSlownessForm as thresholdCreateSlownessForm,
  createLogsForm as thresholdCreateLogsForm
} from 'in-applications/alerting/form/thresholdForm';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

describe('in-applications/alerting/form/blueprintFormCreator', () => {
  context('when alertType is slowness', () => {
    context('when thresholdType is staticThreshold', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('threshold', thresholdCreateSlownessForm({ type: 'staticThreshold', value: 5 }))
          .put('rule', createRuleForm({ alertType: 'slowness' })),
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
          .put(
            'threshold',
            thresholdCreateSlownessForm({
              type: 'historicBaseline',
              baseline: [1, 2, 3]
            })
          )
          .put('rule', createRuleForm({ alertType: 'slowness' })),
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
          .put('threshold', thresholdCreateSlownessForm({ type: 'staticThreshold' }))
          .put('rule', createRuleForm({ alertType: 'slowness', metricName: 'latency' })),
        'slowness'
      );
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('latency');
    });
  });

  context('when alertType is errorRate', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('threshold', thresholdCreateErrorRateForm())
        .put('rule', createRuleForm({ alertType: 'errorRate' })),
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

    it('should have thresholdType "staticThreshold"', () => {
      const type = blueprintForm.get('threshold').get('type').value;
      expect(type).to.equal('staticThreshold');
    });
  });

  context('when alertType is logs', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('threshold', thresholdCreateLogsForm())
        .put('rule', createRuleForm({ alertType: 'logs' })),
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

    it('should have thresholdType "staticThreshold"', () => {
      const type = blueprintForm.get('threshold').get('type').value;
      expect(type).to.equal('staticThreshold');
    });
  });
});
