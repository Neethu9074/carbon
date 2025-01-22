/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { isOneOfBaselineTypes } from 'in-alerting/smart-alerts/applications/data/applicationThresholdFormData';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { generateGracePeriodOptions } from 'in-alerting/smart-alerts/components/GracePeriod';
import useFormSideEffects, { CHANGE_TYPES } from 'in-hooks/useFormSideEffects';

export function useSmartAlertFormSideEffects(form, setForm) {
  const effects = [
    {
      path: ['evaluationType'],
      effects: [requestThresholdOnEvaluationTypeChange]
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
      effects: [requestThresholdSuggestion, resetGracePeriod]
    },
    {
      path: ['hiddenFields', 'chartViewEntitySelection'],
      effects: [requestThresholdOnEntitySelectionChange]
    }
  ];

  return useFormSideEffects({
    form,
    setForm,
    effects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

function resetBaseline(form) {
  const type = form?.get('threshold')?.get('type').value;

  if (isOneOfBaselineTypes(type)) {
    return form.updateIn(['threshold', 'baseline'], f => f.setValue([]).setTouched(false));
  }
  return form;
}

function requestThresholdOnEvaluationTypeChange(form) {
  // Reset chartViewEntitySelection when evaluationType changes.
  // That's because as part of this side-effect we request the threshold suggestion. Resetting chartViewEntitySelection
  // lets us decide that entity selection is valid or invalid while requesting threshold suggestion so we don't end-up
  // requesting threshold suggestion using wrong applicationId/serviceId/endpointId as part of TagFilter
  const chartViewEntitySelection = form.get('hiddenFields').get('chartViewEntitySelection').toJS();
  const updatedEntitySelection = {
    ...chartViewEntitySelection,
    serviceId: null,
    endpointId: null
  };

  const updatedForm = form.updateIn(['hiddenFields', 'chartViewEntitySelection'], f =>
    f.setValue(updatedEntitySelection).setTouched(true)
  );

  return requestThresholdSuggestion(updatedForm);
}

function requestThresholdOnEntitySelectionChange(form) {
  const type = form.get('threshold').get('type').value;

  if (type === ADAPTIVE_BASELINE) {
    return requestThresholdSuggestion(form);
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
    ?.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true));
}

function resetThreshold(form) {
  const type = form.get('threshold')?.get('type').value;
  form = requestThresholdSuggestion(form);

  if (type === STATIC_THRESHOLD) {
    return form.updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(false));
  }

  return form;
}

function resetGracePeriod(form) {
  const granularity = form.get('granularity').value;
  const currentGracePeriod = form.get('gracePeriod').value;
  const newGracePeriodOptions = generateGracePeriodOptions(granularity);

  // find the closest value
  const closestGracePeriod = newGracePeriodOptions
    .map(option => parseInt(option.value, 10))
    .reduce((closest, value) =>
      Math.abs(value - currentGracePeriod) < Math.abs(closest - currentGracePeriod) ? value : closest
    );

  return form.updateIn(['gracePeriod'], f => f.setValue(closestGracePeriod).setTouched(false));
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
