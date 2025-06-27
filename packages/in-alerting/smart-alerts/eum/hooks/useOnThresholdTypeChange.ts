/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import { useCallback } from 'react';

import {
  updateFormIfAdaptiveBaseline,
  updateFormIfHistoricBaseline
} from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdUtil';
import createThresholdForm, {
  AdaptabilityBaselineThreshold,
  defaultDeviationFactor
} from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import {
  ThresholdType,
  Granularity,
  SmartAlertThresholdRuleUnion,
  StaticThresholdRule,
  StaticBaselineThresholdRule
} from 'in-types';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/dialog/trackingHelpers';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';

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

      if (updatedThresholdType === HISTORIC_BASELINE) {
        const seasonality = typeSeasonalityParts[1];
        newThresholdForm = newThresholdForm
          .updateIn(['warningThreshold', 'seasonality'], f =>
            (f as Field<string>).setValue(seasonality).setTouched(true)
          )
          .updateIn(['criticalThreshold', 'seasonality'], f =>
            (f as Field<string>).setValue(seasonality).setTouched(true)
          );
      }

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
    case HISTORIC_BASELINE:
      return {
        type: HISTORIC_BASELINE,
        deviationFactor: thresholdField.get('deviationFactor')?.value ?? defaultDeviationFactor,
        baseline: thresholdField.get('baseline')?.value ?? [],
        seasonality: thresholdField.get('seasonality')?.value ?? DAILY,
        isCheckboxSelected
      } as StaticBaselineThresholdRule;
    case ADAPTIVE_BASELINE:
      return {
        type: ADAPTIVE_BASELINE,
        deviationFactor: thresholdField.get('deviationFactor')?.value ?? defaultDeviationFactor,
        isCheckboxSelected,
        adaptability: 1
      } as AdaptabilityBaselineThreshold;
    default:
      throw new Error('Unknown threshold type');
  }
}
