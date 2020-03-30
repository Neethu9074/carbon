import { createField, createMapForm } from 'formalistic';

export default function createThresholdForm(threshold, alertType) {
  const baseForm = createBaseForm(threshold);

  if (alertType === 'slowness') {
    return createSlownessForm(baseForm, threshold);
  }

  if (alertType === 'specificJsError') {
    return createSpecificJsErrorForm(baseForm, threshold);
  }

  if (alertType === 'statusCode') {
    return createStatusCodeForm(baseForm, threshold);
  }
}

function createBaseForm(threshold) {
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

function createSlownessForm(baseForm, threshold) {
  const thresholdType = threshold.type;

  if (thresholdType === 'staticThreshold') {
    return createThresholdFormStaticThreshold(baseForm, threshold);
  }

  if (thresholdType.startsWith('historicBaseline')) {
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
              message: 'Please provide a number >= 0'
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

function createSpecificJsErrorForm(baseForm, threshold) {
  return createThresholdFormStaticThreshold(baseForm, threshold);
}

function createStatusCodeForm(baseForm, threshold) {
  return createThresholdFormStaticThreshold(baseForm, threshold);
}
