/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import { useCallback } from 'react';

import {
  ThresholdType,
  Granularity,
  SmartAlertThresholdRuleUnion,
  StaticThresholdRule,
  AdaptiveThresholdRule
} from '@instana/types/typeDefinitions';

import {
  updateFormIfAdaptiveBaseline,
  updateFormIfHistoricBaseline
} from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdUtil';
import createThresholdForm, { defaultDeviationFactor } from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/dialog/trackingHelpers';

export function useOnThresholdTypeChange() {
  return useCallback(
    (
      typeWithOptionalSeasonality: string,
      form: MapForm<any>,
      updateForm: (form: MapForm<any>) => void,
      trackThresholdTypeChanged?: (trackingObject: object) => void,
      editMode?: boolean
    ) => {
      const typeSeasonalityParts = typeWithOptionalSeasonality.split('.');
      const updatedThresholdType: ThresholdType = typeSeasonalityParts[0] as ThresholdType;

      const warningThresholdField = form.get('threshold').get('warningThreshold');
      const criticalThresholdField = form.get('threshold').get('criticalThreshold');

      const rule = form.get('rule')!.toJS();

      const { alertType } = rule;
      let newThresholdForm: MapForm<any> = createThresholdForm(
        {
          rule,
          thresholdOperator: form.get('threshold').get('operator').value,
          thresholds: {
            WARNING: getMultithresholdThresholdRule(updatedThresholdType, warningThresholdField),
            CRITICAL: getMultithresholdThresholdRule(updatedThresholdType, criticalThresholdField)
          }
        },
        alertType,
        editMode
      );

      let updatedForm = form.put('threshold', newThresholdForm);

      const granularity = (form.get('granularity') as Field<Granularity>).value;
      updatedForm = updateFormIfAdaptiveBaseline(updatedForm, updatedThresholdType, granularity);
      updatedForm = updateFormIfHistoricBaseline(updatedForm, updatedThresholdType, granularity);

      updateForm(updatedForm);

      trackThresholdTypeChanged?.(getTrackingObject(form, { value: updatedThresholdType }));
    },
    []
  );
}

function getMultithresholdThresholdRule(type: string, thresholdField: MapForm<any>): SmartAlertThresholdRuleUnion {
  const isCheckboxSelected = thresholdField.get('isCheckboxSelected')?.value ?? false;
  switch (type) {
    case STATIC_THRESHOLD:
      return {
        type: STATIC_THRESHOLD,
        value: thresholdField.get('value')?.value ?? (isCheckboxSelected ? 0 : null),
        isCheckboxSelected
      } as StaticThresholdRule;
    case ADAPTIVE_BASELINE:
      return {
        type: ADAPTIVE_BASELINE,
        deviationFactor: thresholdField.get('deviationFactor')?.value ?? defaultDeviationFactor,
        adaptability: thresholdField.get('adaptability')?.value ?? 1,
        seasonality: thresholdField.get('seasonality')?.value ?? null,
        isCheckboxSelected
      } as AdaptiveThresholdRule;
    default:
      throw new Error('Unknown threshold type');
  }
}
