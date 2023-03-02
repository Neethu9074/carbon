/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { isAdaptiveBaselineData, ThresholdType } from '@instana/types';

import {
  AdaptiveBaselineData,
  HistoricBaselineConfig,
  StaticThresholdConfig,
  ThresholdConfig,
  ThresholdConfigUnion,
  ThresholdOperator,
  isHistoricBaselineConfig,
  isStaticThresholdConfig
} from 'in-types';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  threshold: ThresholdConfigUnion | undefined, // supporting old javascript based code
  alertType: ApplicationAlertType
): MapForm {
  if (!threshold) {
    return createBaselineEnabledForm();
  }

  switch (alertType) {
    case 'errorRate':
    case 'logs':
      return createAdaptiveOrStaticThresholdForm(threshold);
    default:
      return createBaselineEnabledForm(threshold);
  }
}

function createAdaptiveOrStaticThresholdForm(threshold: ThresholdConfig): MapForm {
  if (isAdaptiveBaselineData(threshold)) {
    return createAdaptiveBaselineForm(threshold);
  }
  return createStaticThresholdForm(threshold as StaticThresholdConfig);
}

function createBaselineEnabledForm(threshold?: ThresholdConfig): MapForm {
  if (!threshold || isStaticThresholdConfig(threshold)) {
    return createStaticThresholdForm(threshold);
  }

  if (isHistoricBaselineConfig(threshold)) {
    return createHistoricBaselineForm(threshold);
  }

  if (isAdaptiveBaselineData(threshold)) {
    return createAdaptiveBaselineForm(threshold);
  }

  throw new Error(`Unknown threshold type ${threshold?.type}.`);
}

function createStaticThresholdForm(threshold?: StaticThresholdConfig): MapForm {
  return createBaseForm(threshold).put(
    'value',
    createField({
      value: threshold?.value ?? null,
      validator: num => {
        if (typeof num !== 'number' || num < 0) {
          return [
            {
              severity: 'error',
              message: t('in-alerting:smartAlerts.applications.form.thresholdFormPleaseProvideANumber0')
            }
          ];
        }
        return null;
      }
    })
  );
}

function createHistoricBaselineForm(threshold: HistoricBaselineConfig): MapForm {
  return createBaseForm(threshold)
    .put(
      'seasonality',
      createField({
        value: threshold.seasonality ?? DAILY
      })
    )
    .put(
      'baseline',
      createField({
        validator: array => {
          if (array?.length === 0) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.thresholdFormBaselineIsEmpty')
              }
            ];
          }
          return null;
        },
        value: threshold.baseline
      })
    )
    .put(
      'deviationFactor',
      createField({
        value: threshold.deviationFactor ?? defaultDeviationFactor
      })
    );
}

function createAdaptiveBaselineForm(threshold: AdaptiveBaselineData) {
  return createBaseForm(threshold)
    .put(
      'baseline',
      createField({
        // For adaptiveBaseline an empty list (baseline)is legit. No validation needed.
        value: threshold.baseline
      })
    )
    .put(
      'deviationFactor',
      createField({
        value: threshold.deviationFactor ?? defaultDeviationFactor
      })
    );
}

function createBaseForm(threshold?: {
  type?: ThresholdType;
  operator?: ThresholdOperator;
  lastUpdated?: number;
}): MapForm {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold?.type ?? HISTORIC_BASELINE
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
