/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import useFormSideEffects, { combineEffects } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';

export default function useSmartAlertFormSideEffects(form, setForm) {
  const effects = [
    {
      path: ['boundaryScope'],
      effect: requestThresholdSuggestion
    },
    {
      path: ['includeInternal'],
      effect: requestThresholdSuggestion
    },
    {
      path: ['includeSynthetic'],
      effect: requestThresholdSuggestion
    },
    {
      path: ['applications'],
      effect: requestThresholdSuggestion
    },
    {
      path: ['tagFilterExpression'],
      effect: requestThresholdSuggestion
    },
    {
      path: ['rule', 'alertType'],
      effect: resetThreshold
    },
    {
      path: ['rule', 'metricName'],
      effect: resetThreshold
    },
    {
      path: ['rule'],
      effect: requestThresholdSuggestion
    },
    {
      path: ['threshold', 'seasonality'],
      effect: combineEffects([requestThresholdSuggestion, validateAggregation])
    },
    {
      path: ['granularity'],
      effect: requestThresholdSuggestion
    }
  ];

  return useFormSideEffects(form, setForm, effects);
}

function resetBaseline(form) {
  const type = form.get('threshold').get('type').value;

  if (type === 'historicBaseline') {
    return form.updateIn(['threshold', 'baseline'], f => f.setValue([]).setTouched(false));
  }
  return form;
}

function requestThresholdSuggestion(form) {
  return resetBaseline(form) // we reset the baseline before new suggestion in order to avoid backend calls with invalid form state
    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true));
}

function resetThreshold(form) {
  const type = form.get('threshold').get('type').value;
  form = requestThresholdSuggestion(form);

  if (type === 'staticThreshold') {
    return form.updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(false));
  }

  return form;
}

function validateAggregation(form) {
  const aggregationOptions = getAggregationOptions(form);
  const aggregation = form.get('rule').get('aggregation')?.value;
  if (aggregation && !aggregationOptions.find(o => o.value === aggregation)) {
    const newAggregation = aggregationOptions[0].value;
    return form.updateIn(['rule', 'aggregation'], f => f.setValue(newAggregation).setTouched(true));
  }
  return form;
}
