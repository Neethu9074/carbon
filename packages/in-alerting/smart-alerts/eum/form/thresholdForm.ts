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
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(
  threshold: ThresholdConfigUnion | undefined, // supporting old javascript based code
  alertType: WebsitesAlertType | MobileAlertType
): MapForm<any> {
  if (!threshold) {
    return createBaselineEnabledForm();
  }

  switch (alertType) {
    case 'specificJsError':
      return createStaticThresholdForm(threshold as StaticThresholdConfig);
    default:
      return createBaselineEnabledForm(threshold);
  }
}

function createBaselineEnabledForm(threshold?: ThresholdConfig): MapForm<any> {
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
              message: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideANumberGreaterEqualsToZero')
            }
          ];
        }
        return null;
      }
    })
  );
}

function createHistoricBaselineForm(threshold: HistoricBaselineConfig): MapForm<any> {
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
}): MapForm<any> {
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
