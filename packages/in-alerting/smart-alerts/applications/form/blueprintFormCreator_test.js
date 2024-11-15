/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import { expect } from 'chai';

import {
  createViolationsInSequenceForm,
  defaultAdaptiveBaselineTimeWindow
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import createBlueprintForm from 'in-alerting/smart-alerts/applications/form/blueprintFormCreator';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

export function createThresholdByType(type) {
  switch (type) {
    case 'staticThreshold':
      return {
        type: STATIC_THRESHOLD,
        value: 5
      };
    case 'historicBaseline':
      return {
        type: HISTORIC_BASELINE,
        baseline: [1, 2, 3]
      };
    case 'adaptiveBaseline':
      return {
        type: ADAPTIVE_BASELINE,
        baseline: []
      };
    default:
      throw new Error('Unknown threshold type');
  }
}

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
          .put(
            'threshold',
            createThresholdForm(
              {
                thresholdOperator: undefined,
                thresholds: {
                  WARNING: createThresholdByType(STATIC_THRESHOLD),
                  CRITICAL: { ...createThresholdByType(STATIC_THRESHOLD), value: null }
                }
              },
              'slowness'
            )
          )
          .put('rule', createRuleForm({ alertType: 'slowness' }))
          .put('timeThreshold', createViolationsInSequenceForm({}, STATIC_THRESHOLD)),
        'slowness'
      );

      it('should contain fields: alertType, metricName, aggregation, type, operator, value', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'aggregation');
        expect(blueprintForm.get('threshold').get('warningThreshold').toJS()).to.have.keys(
          'type',
          'value',
          'isCheckboxSelected'
        );
      });

      it('should have thresholdType "dynamicBaseline"', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').get('type').value).to.equal(STATIC_THRESHOLD);
      });
    });

    describe('when thresholdType is HISTORIC_BASELINE', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put(
            'threshold',
            createThresholdForm(
              {
                thresholdOperator: undefined,
                thresholds: {
                  WARNING: createThresholdByType(HISTORIC_BASELINE),
                  CRITICAL: createThresholdByType(HISTORIC_BASELINE)
                }
              },
              'slowness'
            )
          )
          .put('rule', createRuleForm({ alertType: 'slowness' }))
          .put('timeThreshold', createViolationsInSequenceForm({}, HISTORIC_BASELINE)),
        'slowness'
      );

      it('rule-form should contain fields: alertType, metricName', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'aggregation');
      });

      it('threshold-form should contain fields: type, seasonality, baseline, deviationFactor', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').toJS()).to.have.keys(
          'type',
          'seasonality',
          'baseline',
          'deviationFactor',
          'isCheckboxSelected'
        );
      });

      it('should have thresholdType "HISTORIC_BASELINE"', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').get('type').value).to.equal(HISTORIC_BASELINE);
      });

      it('should have seasonality "DAILY"', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').get('seasonality').value).to.equal(DAILY);
      });

      it('should have default time-window of 10 minutes', () => {
        expect(blueprintForm.get('timeThreshold').get('timeWindow').value).to.equal(600000);
      });
    });

    describe('when thresholdType is ADAPTIVE_BASELINE', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put(
            'threshold',
            createThresholdForm(
              {
                thresholdOperator: undefined,
                thresholds: {
                  WARNING: createThresholdByType(ADAPTIVE_BASELINE),
                  CRITICAL: createThresholdByType(ADAPTIVE_BASELINE)
                }
              },
              'slowness'
            )
          )
          .put('rule', createRuleForm({ alertType: 'slowness' }))
          .put('timeThreshold', createViolationsInSequenceForm({}, ADAPTIVE_BASELINE)),
        'slowness'
      );

      it('should have default time-window of 20 minutes for adaptive baseline', () => {
        expect(blueprintForm.get('timeThreshold').get('timeWindow').value).to.equal(defaultAdaptiveBaselineTimeWindow);
      });
    });

    describe('should have metricName "latency"', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put(
            'threshold',
            createThresholdForm(
              {
                thresholdOperator: undefined,
                thresholds: {
                  WARNING: createThresholdByType(STATIC_THRESHOLD),
                  CRITICAL: { ...createThresholdByType(STATIC_THRESHOLD), value: null }
                }
              },
              'slowness'
            )
          )
          .put('rule', createRuleForm({ alertType: 'slowness', metricName: 'latency' }))
          .put('timeThreshold', createViolationsInSequenceForm({}, STATIC_THRESHOLD)),
        'slowness'
      );
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('latency');
    });
  });

  describe('when alertType is errors', () => {
    describe('when thresholdType is STATIC_THRESHOLD', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put(
            'threshold',
            createThresholdForm(
              {
                thresholdOperator: undefined,
                thresholds: {
                  WARNING: createThresholdByType(STATIC_THRESHOLD),
                  CRITICAL: { ...createThresholdByType(STATIC_THRESHOLD), value: null }
                }
              },
              'errors'
            )
          )
          .put('rule', createRuleForm({ alertType: 'errors' }))
          .put('timeThreshold', createViolationsInSequenceForm({}, STATIC_THRESHOLD)),
        'errors'
      );

      it('should contain fields: alertType, metricName, type, value', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName');
        expect(blueprintForm.get('threshold').get('warningThreshold').toJS()).to.have.keys(
          'type',
          'value',
          'isCheckboxSelected'
        );
      });

      it('should have metricName "errors"', () => {
        const metricName = blueprintForm.get('rule').get('metricName').value;
        expect(metricName).to.equal('errors');
      });

      it('should have thresholdType "STATIC_THRESHOLD"', () => {
        const type = blueprintForm.get('threshold').get('warningThreshold').get('type').value;
        expect(type).to.equal(STATIC_THRESHOLD);
      });
    });

    describe('when thresholdType is HISTORIC_BASELINE', () => {
      const blueprintForm = createBlueprintForm(
        createMapForm()
          .put('tagFilterExpression', createTagFilterExpressionForm())
          .put(
            'threshold',
            createThresholdForm(
              {
                thresholdOperator: undefined,
                thresholds: {
                  WARNING: createThresholdByType(HISTORIC_BASELINE),
                  CRITICAL: createThresholdByType(HISTORIC_BASELINE)
                }
              },
              'errors'
            )
          )
          .put('rule', createRuleForm({ alertType: 'errors' }))
          .put('timeThreshold', createViolationsInSequenceForm({}, HISTORIC_BASELINE)),
        'errors'
      );

      it('rule-form should contain fields: alertType, metricName', () => {
        expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName');
      });

      it('threshold-form should contain fields: type, seasonality, baseline, deviationFactor', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').toJS()).to.have.keys(
          'type',
          'seasonality',
          'baseline',
          'deviationFactor',
          'isCheckboxSelected'
        );
      });

      it('should have thresholdType "HISTORIC_BASELINE"', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').get('type').value).to.equal(HISTORIC_BASELINE);
      });

      it('should have seasonality "DAILY"', () => {
        expect(blueprintForm.get('threshold').get('warningThreshold').get('seasonality').value).to.equal(DAILY);
      });

      it('should have default time-window of 10 minutes', () => {
        expect(blueprintForm.get('timeThreshold').get('timeWindow').value).to.equal(600000);
      });
    });
  });

  describe('when alertType is logs', () => {
    const blueprintForm = createBlueprintForm(
      createMapForm()
        .put('tagFilterExpression', createTagFilterExpressionForm())
        .put('threshold', createThresholdForm({}, 'logs'))
        .put('rule', createRuleForm({ alertType: 'logs' }))
        .put('timeThreshold', createViolationsInSequenceForm({}, STATIC_THRESHOLD)),
      'logs'
    );

    it('should contain fields: alertType, metricName, type, message, level', () => {
      expect(blueprintForm.get('rule').toJS()).to.have.keys('alertType', 'metricName', 'operator', 'message', 'level');
      expect(blueprintForm.get('threshold').get('warningThreshold').toJS()).to.have.keys(
        'type',
        'value',
        'isCheckboxSelected'
      );
    });

    it('should have metricName "calls"', () => {
      const metricName = blueprintForm.get('rule').get('metricName').value;
      expect(metricName).to.equal('calls');
    });

    it('should have thresholdType "STATIC_THRESHOLD"', () => {
      const type = blueprintForm.get('threshold').get('warningThreshold').get('type').value;
      expect(type).to.equal(STATIC_THRESHOLD);
    });
  });
});
