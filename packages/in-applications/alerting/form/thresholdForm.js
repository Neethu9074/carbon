import { createField, createMapForm } from 'formalistic';

export function createErrorRateForm(threshold = {}) {
  return createStaticThresholdForm(threshold);
}

export function createSlownessForm(threshold = {}) {
  const thresholdType = threshold.type;

  if (thresholdType === 'staticThreshold') {
    return createStaticThresholdForm(threshold);
  }

  if (thresholdType.startsWith('historicBaseline')) {
    return createHistoricBaselineForm(threshold);
  }

  throw new Error(`Unknown threshold type ${thresholdType}.`);
}

function createStaticThresholdForm(threshold = {}) {
  return createBaseForm(threshold).put(
    'value',
    createField({
      value: threshold.value ?? '',
      validator: num => {
        if (num === '' || num < 0) {
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

function createHistoricBaselineForm(threshold = {}) {
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
        value: threshold.deviationFactor ?? 4
      })
    );
}

function createBaseForm(threshold = {}) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold.type ?? 'staticThreshold'
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
