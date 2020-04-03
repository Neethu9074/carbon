import { createField, notBlankValidator, createMapForm } from 'formalistic';

import { operators } from 'in-analyze/applicationFilter';

export default function createRuleForm(rule, thresholdType) {
  const { alertType } = rule;
  const baseForm = createBaseForm(rule);

  if (alertType === 'slowness') {
    return createSlownessForm(baseForm, rule, thresholdType);
  }

  if (alertType === 'specificJsError') {
    return createSpecificJsErrorForm(baseForm, rule);
  }

  if (alertType === 'statusCode') {
    return createSpecificStatusCodeForm(baseForm, rule);
  }
}

function createBaseForm(rule) {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: rule.alertType ?? 'specificJsError'
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? 'errors'
      })
    );
}

function createSlownessForm(baseForm, rule, thresholdType) {
  if (thresholdType === 'staticThreshold') {
    return createStaticThresholdForm(baseForm, rule);
  }

  if (thresholdType.startsWith('historicBaseline')) {
    return createHistoricBaselineForm(baseForm, rule);
  }

  throw new Error(`Unknown threshold type ${thresholdType}.`);
}

function createStaticThresholdForm(baseForm, rule) {
  return createHistoricBaselineForm(baseForm, rule);
}

function createHistoricBaselineForm(baseForm, rule) {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function createSpecificJsErrorForm(baseForm, rule) {
  return baseForm
    .put(
      'operator',
      createField({
        value: rule.operator ?? operators.EQUALS
      })
    )
    .put(
      'value',
      createField({
        value: rule.value ?? '',
        validator: value => {
          if (!value || value.trim().length === 0) {
            return [
              {
                severity: 'error',
                message: 'Please provide an error message'
              }
            ];
          } else {
            return null;
          }
        }
      })
    );
}

function createSpecificStatusCodeForm(baseForm, rule) {
  return baseForm
    .put(
      'operator',
      createField({
        value: rule.operator ?? operators.STARTS_WITH
      })
    )
    .put(
      'value',
      createField({
        value: rule.value ?? '4',
        validator: notBlankValidator
      })
    );
}
