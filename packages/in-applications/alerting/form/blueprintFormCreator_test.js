/* eslint-env mocha */
import { expect } from 'chai';
import { createMapForm } from 'formalistic';

import {
  createErrorRateForm as thesholdCreateErrorRateForm,
  createSlownessForm as thresholdCreateSlownessForm,
  createErrorRateForm as thresholdCreateErrorRateForm
} from 'in-applications/alerting/form/thresholdForm';
import createBlueprintForm from 'in-applications/alerting/form/blueprintFormCreator';
import createRuleForm from 'in-applications/alerting/form/ruleForm';

describe('in-applications/alerting/form/blueprintFormCreator', () => {
  context('when alertType is slowness', () => {
    context('when thresholdType is staticThreshold', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('threshold', thresholdCreateSlownessForm({ type: 'staticThreshold' }))
          .put('rule', createRuleForm()),
        'slowness'
      );
      it('should contain fields: alertType, metricName, aggregation, type, operator, lastUpdated, value', () => {
        expect({ ...blueprintForm.get('rule').toJS(), ...blueprintForm.get('threshold').toJS() }).to.have.keys(
          'alertType',
          'metricName',
          'aggregation',
          'type',
          'operator',
          'lastUpdated',
          'value'
        );
      });
      it('should have thresholdType "dynamicBaseline"', () => {
        expect(blueprintForm.get('threshold').get('type').value).to.equal('staticThreshold');
      });
    });
    context('when thresholdType is historicBaseline.', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put(
            'threshold',
            thresholdCreateSlownessForm({
              type: 'historicBaseline.DAILY',
              baseline: [1, 2, 3]
            })
          )
          .put('rule', createRuleForm()),
        'slowness'
      );

      const mergedForm = { ...blueprintForm.get('rule').toJS(), ...blueprintForm.get('threshold').toJS() };
      it('should contain fields: alertType, metricName, aggregation, alertType, metricName', () => {
        expect(mergedForm).to.have.keys(
          'type',
          'operator',
          'lastUpdated',
          'seasonality',
          'baseline',
          'deviationFactor',
          'alertType',
          'metricName',
          'aggregation'
        );
      });

      it('should have thresholdType "historicBaseline"', () => {
        expect(blueprintForm.get('threshold').get('type').value).to.equal('historicBaseline.DAILY');
      });
    });
    it('should have metricName "latency"', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('threshold', thresholdCreateErrorRateForm())
          .put('rule', createRuleForm()),
        'slowness'
      );
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('latency');
    });
  });

  context('when alertType is errorRate', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('threshold', thesholdCreateErrorRateForm(thresholdCreateErrorRateForm()))
        .put('rule', createRuleForm()),
      'errorRate'
    );

    it('should contain fields: alertType, metricName, type, operator, lastUpdated, value', () => {
      expect({ ...blueprintForm.get('rule').toJS(), ...blueprintForm.get('threshold').toJS() }).to.have.keys(
        'aggregation', // this filed is not necessary  fro erroRate, but we keep it in the form becasue the backend throws not needed fields away
        'alertType',
        'metricName',
        'type',
        'operator',
        'lastUpdated',
        'value'
      );
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
});
