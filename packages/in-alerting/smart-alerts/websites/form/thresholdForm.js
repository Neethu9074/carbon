/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';

import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(threshold, alertType) {
  let form = createBaseForm(threshold);

  if (alertType === 'slowness') {
    return createBaselineEnabledForm(form, threshold);
  }

  if (alertType === 'specificJsError') {
    return createSpecificJsErrorForm(form, threshold);
  }

  if (alertType === 'statusCode') {
    return createStatusCodeForm(form, threshold);
  }

  if (alertType === 'throughput') {
    return createBaselineEnabledForm(form, threshold);
  }
}

function createBaseForm(threshold) {
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

function createBaselineEnabledForm(baseForm, threshold) {
  const thresholdType = threshold.type;

  if (thresholdType === STATIC_THRESHOLD) {
    return createThresholdFormStaticThreshold(baseForm, threshold);
  }

  if (thresholdType === HISTORIC_BASELINE) {
    return createThresholdFormHistoricBaseline(baseForm, threshold);
  }
}

function createThresholdFormStaticThreshold(baseForm, threshold) {
  return baseForm.put(
    'value',
    createField({
      value: threshold.value ?? null,
      validator: num => {
        if (num === '' || num < 0) {
          return [
            {
              severity: 'error',
              message: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideANumberGreaterEqualsToZero')
            }
          ];
        }
      }
    })
  );
}

function createThresholdFormHistoricBaseline(baseForm, threshold) {
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

function createSpecificJsErrorForm(baseForm, threshold) {
  return createThresholdFormStaticThreshold(baseForm, threshold);
}

function createStatusCodeForm(baseForm, threshold) {
  return createThresholdFormStaticThreshold(baseForm, threshold);
}
