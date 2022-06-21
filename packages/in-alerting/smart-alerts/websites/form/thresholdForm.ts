/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  HistoricBaselineConfig,
  Seasonality,
  StaticThresholdConfig,
  ThresholdConfig,
  ThresholdOperator
} from 'in-types';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(threshold: ThresholdConfig, alertType: WebsitesAlertType): MapForm {
  const form = createBaseForm(threshold);

  switch (alertType) {
    case 'slowness':
    case 'throughput':
    case 'customEvent':
      return createBaselineEnabledForm(form, threshold);
    case 'specificJsError':
    case 'statusCode':
      return createThresholdFormStaticThreshold(form, threshold as { value?: number });
    default:
      return form;
  }
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

function createBaselineEnabledForm(baseForm: MapForm, threshold: ThresholdConfig): MapForm {
  const thresholdType = threshold.type;

  if (thresholdType === STATIC_THRESHOLD) {
    return createThresholdFormStaticThreshold(baseForm, threshold as StaticThresholdConfig);
  }

  if (thresholdType === HISTORIC_BASELINE) {
    return createThresholdFormHistoricBaseline(baseForm, threshold as HistoricBaselineConfig);
  }

  return baseForm;
}

function createThresholdFormStaticThreshold(baseForm: MapForm, threshold: { value?: number }): MapForm {
  return baseForm.put(
    'value',
    createField({
      value: threshold.value ?? null,
      validator: (num: number | string | null) => {
        if (num === '' || num === null || num < 0) {
          return [
            {
              severity: 'error',
              message: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideANumberGreaterEqualsToZero')
            }
          ];
        }
        return null;
      }
    })
  );
}

function createThresholdFormHistoricBaseline(
  baseForm: MapForm,
  threshold: {
    seasonality?: Seasonality;
    baseline?: number[][];
    deviationFactor?: number;
  }
): MapForm {
  return baseForm
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
          if (!array || array.length === 0) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.websites.form.errorBaselineIsEmpty')
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
