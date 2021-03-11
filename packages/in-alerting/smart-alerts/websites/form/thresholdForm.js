/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm } from 'formalistic';

import { t } from 'in-i18n';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(threshold, alertType) {
  const baseForm = createBaseForm(threshold);

  if (alertType === 'slowness') {
    return createBaselineEnabledForm(baseForm, threshold);
  }

  if (alertType === 'specificJsError') {
    return createSpecificJsErrorForm(baseForm, threshold);
  }

  if (alertType === 'statusCode') {
    return createStatusCodeForm(baseForm, threshold);
  }

  if (alertType === 'throughput') {
    return createBaselineEnabledForm(baseForm, threshold);
  }
}

function createBaseForm(threshold) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold.type ?? 'historicBaseline'
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

  if (thresholdType === 'staticThreshold') {
    return createThresholdFormStaticThreshold(baseForm, threshold);
  }

  if (thresholdType === 'historicBaseline') {
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
        value: threshold.seasonality ?? 'DAILY'
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
