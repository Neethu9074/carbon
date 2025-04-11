/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';

import { InfraAlertEvaluationType } from '@instana/types/typeDefinitions';
import { Group } from '@instana/types';

import { evaluationTypes } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CustomOrPerEntityOption';
import { generateGracePeriodOptions } from 'in-alerting/smart-alerts/components/GracePeriod';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import useFormSideEffects, { CHANGE_TYPES } from 'in-hooks/useFormSideEffects';

export function useInfraSmartAlertFormSideEffects(form: MapForm<any>, setForm: (field: MapForm<any>) => void) {
  const effects = [
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
      path: ['threshold', 'warningThreshold', 'type'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['threshold', 'operator'],
      effects: [requestThresholdSuggestion]
    },
    {
      path: ['granularity'],
      effects: [requestThresholdSuggestion, resetGracePeriod]
    },
    {
      path: ['evaluationType'],
      effects: [resetGroupBy, resetThreshold, resetCalculateThresholdOnBackend]
    }
  ];

  return useFormSideEffects({
    form,
    setForm,
    effects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}

function resetGroupBy(form: MapForm<any>): MapForm<any> {
  const evaluationType = (form.get('evaluationType') as Field<InfraAlertEvaluationType>).value;

  if (evaluationType === evaluationTypes.perEntity) {
    return form.updateIn(['groupBy'], f => (f as Field<Group[]>).setValue([]));
  }

  return form;
}

function requestThresholdSuggestion(form: MapForm<any>): MapForm<any> {
  return form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(true));
}

function resetCalculateThresholdOnBackend(form: MapForm<any>): MapForm<any> {
  return form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(false));
}

function resetThreshold(form: MapForm<any>): MapForm<any> {
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
  return form.updateIn(['threshold', thresholdType], thresholdMapForm =>
    (thresholdMapForm as MapForm<any>).updateIn(['value'], item =>
      (item as Field<number | null>).setValue(null).setTouched(false)
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
