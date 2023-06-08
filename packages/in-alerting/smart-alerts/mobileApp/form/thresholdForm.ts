/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { ThresholdType } from '@instana/types';

import { StaticThresholdConfig, ThresholdConfigUnion, ThresholdOperator } from 'in-types';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  threshold: ThresholdConfigUnion | undefined // supporting old javascript based code
): MapForm<any> {
  return createStaticThresholdForm(threshold as StaticThresholdConfig);
}

function createStaticThresholdForm(threshold?: StaticThresholdConfig): MapForm<any> {
  return createBaseForm(threshold).put(
    'value',
    createField({
      value: threshold?.value ?? null,
      validator: num => {
        if (typeof num !== 'number' || num < 0) {
          return [
            {
              severity: 'error',
              message: t('in-alerting:smartAlerts.mobileApp.form.errorPleaseProvideANumberGreaterEqualsToZero')
            }
          ];
        }
        return null;
      }
    })
  );
}

function createBaseForm(threshold?: {
  type?: ThresholdType;
  operator?: ThresholdOperator;
  lastUpdated?: number;
}): MapForm<any> {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? STATIC_THRESHOLD
      })
    )
    .put(
      'operator',
      createField({
        value: threshold?.operator ?? '>='
      })
    )
    .put(
      'lastUpdated',
      createField({
        value: threshold?.lastUpdated ?? 0
      })
    );
}
