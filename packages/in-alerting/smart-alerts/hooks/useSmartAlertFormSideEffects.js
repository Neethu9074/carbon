/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  PER_AP_ENDPOINT,
  PER_AP_SERVICE
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { isOneOfBaselineTypes } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import useFormSideEffects, { CHANGE_TYPES } from 'in-alerting/smart-alerts/hooks/useFormSideEffects';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default function useSmartAlertFormSideEffects(form, setForm) {
  const effects = [
    {
      path: ['evaluationType'],
      effects: [requestThresholdSuggestion]
    },
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
      path: ['threshold', 'type'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['threshold', 'operator'],
      effects: [requestThresholdOnOperatorChange]
    },
    {
      path: ['threshold', 'seasonality'],
      effects: [requestThresholdSuggestion, validateAggregation]
    },
    {
      path: ['granularity'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['hiddenFields', 'chartViewEntitySelection'],
      effects: [requestThresholdSuggestionOnEntitySelectionChange]
    }
  ];

  return useFormSideEffects({ form, setForm, effects, changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE] });
}

function resetBaseline(form) {
  const type = form.get('threshold').get('type').value;

  if (isOneOfBaselineTypes(type)) {
    return form.updateIn(['threshold', 'baseline'], f => f.setValue([]).setTouched(false));
  }
  return form;
}

function requestThresholdOnOperatorChange(form) {
  const type = form.get('threshold').get('type').value;

  if (type === STATIC_THRESHOLD) {
    return requestThresholdSuggestion(form);
  }

  return form;
}

function requestThresholdSuggestion(form) {
  return resetBaseline(form) // we reset the baseline before new suggestion in order to avoid backend calls with invalid form state
    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true));
}

function requestThresholdSuggestionOnEntitySelectionChange(form) {
  const hasSubentitySelection = [PER_AP_SERVICE, PER_AP_ENDPOINT].includes(form.get('evaluationType').value);

  if (hasSubentitySelection) {
    return requestThresholdSuggestion(form);
  }

  return form;
}

function resetThreshold(form) {
  const type = form.get('threshold').get('type').value;
  form = requestThresholdSuggestion(form);

  if (type === STATIC_THRESHOLD) {
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
