/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  ADAPTIVE_BASELINE,
  HISTORIC_BASELINE,
  isAdaptiveBaselineConfig,
  isHistoricBaselineConfig,
  isStaticThresholdConfig
} from 'in-alerting/smart-alerts/data/thresholdTypes';
import {
  AdaptiveBaselineData,
  HistoricBaselineConfig,
  StaticThresholdConfig,
  ThresholdConfig,
  ThresholdOperator,
  ThresholdConfigUnion
} from 'in-types';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  threshold: ThresholdConfigUnion | undefined,
  alertType: ApplicationAlertType
): MapForm {
  if (!threshold) {
    // use slowness by default
    return createSlownessForm();
  }

  if (alertType === 'slowness') {
    return createSlownessForm(threshold);
  }

  if (alertType === 'errorRate') {
    return createErrorRateForm(threshold);
  }

  if (alertType === 'logs') {
    return createLogsForm(threshold);
  }

  if (alertType === 'statusCode') {
    return createStatusCodeForm(threshold);
  }

  if (alertType === 'throughput') {
    return createThroughputForm(threshold);
  }

  return createBaselineEnabledForm(threshold);
}

function createErrorRateForm(threshold: ThresholdConfig): MapForm {
  const thresholdType = threshold.type;
  if (thresholdType === ADAPTIVE_BASELINE) {
    return createAdaptiveBaselineForm(threshold as AdaptiveBaselineData);
  }
  return createStaticThresholdForm(threshold as StaticThresholdConfig);
}

function createLogsForm(threshold: ThresholdConfig): MapForm {
  const thresholdType = threshold.type;
  if (thresholdType === ADAPTIVE_BASELINE) {
    return createAdaptiveBaselineForm(threshold as AdaptiveBaselineData);
  }
  return createStaticThresholdForm(threshold as StaticThresholdConfig);
}

function createStatusCodeForm(threshold: ThresholdConfig): MapForm {
  return createBaselineEnabledForm(threshold);
}

function createSlownessForm(threshold?: ThresholdConfig): MapForm {
  return createBaselineEnabledForm(threshold);
}

function createThroughputForm(threshold: ThresholdConfig): MapForm {
  return createBaselineEnabledForm(threshold);
}

function createBaselineEnabledForm(threshold?: ThresholdConfig): MapForm {
  if (!threshold || isStaticThresholdConfig(threshold)) {
    return createStaticThresholdForm(threshold);
  }

  if (isHistoricBaselineConfig(threshold)) {
    return createHistoricBaselineForm(threshold);
  }

  if (isAdaptiveBaselineConfig(threshold)) {
    return createAdaptiveBaselineForm(threshold as AdaptiveBaselineData);
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

function createBaseForm(threshold?: { type?: string; operator?: ThresholdOperator; lastUpdated?: number }): MapForm {
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
