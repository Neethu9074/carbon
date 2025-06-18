/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
 */

import { Field, MapForm } from 'formalistic';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getThresholdFieldStatus } from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/utils';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { generateGracePeriodOptions } from 'in-alerting/smart-alerts/components/GracePeriod';
import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';

export function useSmartAlertFormSideEffects(form: MapForm<any>, setForm: (field: MapForm<any>) => void) {
  const effects: Effect<any>[] = [
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
      effects: [resetThreshold, updateAlertChannelsOnBPChange]
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
      path: ['threshold', 'warningThreshold', 'type'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['threshold', 'operator'],
      effects: [requestThresholdOnOperatorChange]
    },
    {
      path: ['threshold', 'warningThreshold', 'seasonality'],
      effects: [requestThresholdSuggestion, validateAggregation]
    },
    {
      path: ['threshold', 'warningThreshold', 'adaptability'],
      effects: [requestThresholdSuggestion]
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

function updateAlertChannelsOnBPChange(form: MapForm<any>) {
  const selectedChannelListForm = form.get('hiddenFields').get('selectedChannelList');
  if (!selectedChannelListForm) {
    /** assume the Alert channnels are not implemented if the value of selectedChannelListForm is undefined **/
    return;
  }
  const selectedChannelsArray = selectedChannelListForm.value;
  const { warningThresholdFieldDisabled, criticalThresholdFieldDisabled } = getThresholdFieldStatus(form);
  if (
    selectedChannelsArray.length > 0 &&
    ((warningThresholdFieldDisabled && criticalThresholdFieldDisabled) || criticalThresholdFieldDisabled)
  ) {
    return form.updateIn(['alertChannels'], f =>
      f
        .setValue({
          WARNING: [...selectedChannelsArray],
          CRITICAL: []
        })
        .setTouched(true)
    );
  }
  return form;
}
function resetBaseline(form: MapForm<any>): MapForm<any> {
  const resetBaselineField = (form: MapForm<any>, thresholdType: string) => {
    const type = form?.get('threshold')?.get(thresholdType)?.get('type')?.value;
    if (type == HISTORIC_BASELINE) {
      return form.updateIn(['threshold', thresholdType], thresholdMapForm =>
        (thresholdMapForm as MapForm<any>).updateIn(['baseline'], item =>
          (item as Field<any>).setValue([]).setTouched(false)
        )
      );
    } else if (type == ADAPTIVE_BASELINE) {
      return form.updateIn(['threshold'], thresholdMapForm =>
        (thresholdMapForm as MapForm<any>).updateIn(['baseline'], item =>
          (item as Field<any>).setValue([]).setTouched(false)
        )
      );
    }
    return form;
  };

  form = resetBaselineField(form, 'warningThreshold');
  form = resetBaselineField(form, 'criticalThreshold');

  return form;
}

function requestThresholdOnEvaluationTypeChange(form: MapForm<any>) {
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
    (f as Field<any>).setValue(updatedEntitySelection).setTouched(true)
  );

  return requestThresholdSuggestion(updatedForm);
}

function requestThresholdOnEntitySelectionChange(form: MapForm<any>) {
  const type = form.get('threshold').get('warningThreshold').get('type').value;

  if (type === ADAPTIVE_BASELINE) {
    return requestThresholdSuggestion(form);
  }

  return form;
}

function requestThresholdOnOperatorChange(form: MapForm<any>) {
  const type = form.get('threshold').get('warningThreshold').get('type').value;

  if (type === STATIC_THRESHOLD) {
    return requestThresholdSuggestion(form);
  }

  return form;
}

function requestThresholdSuggestion(form: MapForm<any>) {
  return resetBaseline(form) // we reset the baseline before new suggestion in order to avoid backend calls with invalid form state
    ?.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], item => (item as Field<any>).setValue(true));
}

function resetThreshold(form: MapForm<any>) {
  const warningThresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const criticalThresholdType = form.get('threshold').get('criticalThreshold').get('type').value;
  form = requestThresholdSuggestion(form);

  if (warningThresholdType === STATIC_THRESHOLD) {
    form = resetThresholdValue(form, 'warningThreshold');
  }
  if (criticalThresholdType === STATIC_THRESHOLD) {
    form = resetThresholdValue(form, 'criticalThreshold');
  }

  return form;
}

function resetThresholdValue(form: MapForm<any>, thresholdType: string) {
  return form
    .updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['value'], item =>
        (item as Field<number | null>).setValue(null).setTouched(false)
      )
    )
    .updateIn(['threshold', thresholdType], thresholdMapForm =>
      (thresholdMapForm as MapForm<any>).updateIn(['isCheckboxSelected'], item =>
        (item as Field<boolean>).setValue(thresholdType === 'warningThreshold').setTouched(false)
      )
    );
}

function resetGracePeriod(form: MapForm<any>) {
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

function validateAggregation(form: MapForm<any>) {
  const aggregationOptions = getAggregationOptions(form);
  const aggregation = form.get('rule').get('aggregation')?.value;
  if (aggregation && !aggregationOptions.find(o => o.value === aggregation)) {
    const newAggregation = aggregationOptions[0].value;
    return form.updateIn(['rule', 'aggregation'], item =>
      (item as Field<any>).setValue(newAggregation).setTouched(true)
    );
  }
  return form;
}
