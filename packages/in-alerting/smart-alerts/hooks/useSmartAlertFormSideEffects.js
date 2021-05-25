/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import useFormSideEffects, { CHANGE_TYPES } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';

export default function useSmartAlertFormSideEffects(form, setForm) {
  const effects = [
    {
      path: ['boundaryScope'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['includeInternal'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['includeSynthetic'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['applications'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['tagFilterExpression'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['rule', 'alertType'],
      effects: [resetThreshold]
    },
    {
      path: ['rule', 'metricName'],
      effects: [resetThreshold]
    },
    {
      path: ['rule'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['threshold', 'seasonality'],
      effects: [requestThresholdSuggestion, validateAggregation]
    },
    {
      path: ['threshold', 'type'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['granularity'],
      effects: [requestThresholdSuggestion]
    }
  ];

  return useFormSideEffects({ form, setForm, effects, changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE] });
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
