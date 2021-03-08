/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm } from 'formalistic';

export const defaultDeviationFactor = 3;

export default function createThresholdForm(threshold, alertType) {
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

export function createErrorRateForm(threshold = {}) {
  return createStaticThresholdForm(threshold);
}

export function createLogsForm(threshold = {}) {
  return createStaticThresholdForm(threshold);
}

export function createStatusCodeForm(threshold = {}) {
  return createStaticThresholdForm(threshold);
}

export function createSlownessForm(threshold = {}) {
  return createBaselineEnabledForm(threshold);
}

export function createThroughputForm(threshold = {}) {
  return createBaselineEnabledForm(threshold);
}

function createBaselineEnabledForm(threshold) {
  const thresholdType = threshold.type;

  if (thresholdType === 'staticThreshold') {
    return createStaticThresholdForm(threshold);
  }

  if (thresholdType === 'historicBaseline') {
    return createHistoricBaselineForm(threshold);
  }

  throw new Error(`Unknown threshold type ${thresholdType}.`);
}

function createStaticThresholdForm(threshold) {
  return createBaseForm(threshold).put(
    'value',
    createField({
      value: threshold.value ?? null,
      validator: num => {
        if (typeof num !== 'number' || num < 0) {
          return [
            {
              severity: 'error',
              message: 'Please provide a number >= 0'
            }
          ];
        }
      }
    })
  );
}

function createHistoricBaselineForm(threshold) {
  return createBaseForm(threshold)
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
                message: 'baseline is empty'
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
