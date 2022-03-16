/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  AdaptiveBaselineConfig,
  AdaptiveBaselineData,
  HistoricBaselineConfig,
  StaticThresholdConfig,
  ThresholdConfig,
  ThresholdOperator
} from 'in-types';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  threshold: ThresholdConfig | HistoricBaselineConfig | StaticThresholdConfig | AdaptiveBaselineConfig,
  alertType: ApplicationAlertType
): MapForm | void {
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

function createSlownessForm(threshold: ThresholdConfig): MapForm {
  return createBaselineEnabledForm(threshold);
}

function createThroughputForm(threshold: ThresholdConfig): MapForm {
  return createBaselineEnabledForm(threshold);
}

function createBaselineEnabledForm(threshold: ThresholdConfig): MapForm {
  const thresholdType = threshold.type;

  if (thresholdType === STATIC_THRESHOLD) {
    return createStaticThresholdForm(threshold as StaticThresholdConfig);
  }

  if (thresholdType === HISTORIC_BASELINE) {
    return createHistoricBaselineForm(threshold as HistoricBaselineConfig);
  }

  if (thresholdType === ADAPTIVE_BASELINE) {
    return createAdaptiveBaselineForm(threshold as AdaptiveBaselineData);
  }

  throw new Error(`Unknown threshold type ${thresholdType}.`);
}

function createStaticThresholdForm(threshold: StaticThresholdConfig): MapForm {
  return createBaseForm(threshold).put(
    'value',
    createField({
      value: threshold.value ?? null,
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

function createBaseForm(threshold: { type?: string; operator?: ThresholdOperator; lastUpdated?: number }): MapForm {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold.type ?? HISTORIC_BASELINE
      })
    )
    .put(
      'operator',
      createField({
        value: threshold.operator ?? '>='
      })
    )
    .put(
      'lastUpdated',
      createField({
        value: threshold.lastUpdated ?? 0
      })
    );
}
