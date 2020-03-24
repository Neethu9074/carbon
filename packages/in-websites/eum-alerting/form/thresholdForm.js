import { createField, createMapForm } from 'formalistic';

export default function createThresholdForm(threshold, alertType) {
  const baseForm = createThresholdBaseForm(threshold);

  if (alertType === 'slowness') {
    return createThresholdSlownessForm(baseForm, threshold);
  }

  if (alertType === 'specificJsError') {
    return createThresholdFormSpecificJsError(baseForm, threshold);
  }

  if (alertType === 'statusCode') {
    return createThresholdFormStatusCode(baseForm, threshold);
  }
}

function createThresholdBaseForm(threshold) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: threshold.type
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

function createThresholdSlownessForm(baseForm, threshold) {
  const thresholdType = threshold.type;

  if (thresholdType === 'staticThreshold') {
    return createThresholdFormStaticThreshold(baseForm, threshold);
  }

  if (thresholdType.includes('historicBaseline.')) {
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

function createThresholdFormSpecificJsError(baseForm, threshold) {
  return createThresholdFormStaticThreshold(baseForm, threshold);
}

function createThresholdFormStatusCode(baseForm, threshold) {
  return createThresholdFormStaticThreshold(baseForm, threshold);
}
