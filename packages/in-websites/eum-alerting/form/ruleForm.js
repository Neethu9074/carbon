import { createField, notBlankValidator, createMapForm } from 'formalistic';

import { operators } from 'in-analyze/applicationFilter';

export default function createRuleForm(rule, thresholdType) {
  const { alertType } = rule;
  const baseForm = createRuleBaseForm(rule);

  if (alertType === 'slowness') {
    return createSlownessRuleForm(baseForm, rule, thresholdType);
  }

  if (alertType === 'specificJsError') {
    return createRuleFormSpecificJsError(baseForm, rule);
  }

  if (alertType === 'statusCode') {
    return createRuleFormSpecificStatusCodeForm(baseForm, rule);
  }
}

function createRuleBaseForm(rule) {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: rule.alertType ?? 'errorRate'
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? 'errors'
      })
    );
}

function createSlownessRuleForm(baseForm, rule, thresholdType) {
  if (thresholdType === 'staticThreshold') {
    return createRuleFormStaticThreshold(baseForm, rule);
  }

  if (thresholdType.includes('historicBaseline.')) {
    return createRuleFormHistoricBaseline(baseForm, rule);
  }
}

function createRuleFormStaticThreshold(baseForm, rule) {
  return createRuleFormHistoricBaseline(baseForm, rule);
}

function createRuleFormHistoricBaseline(baseForm, rule) {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function createRuleFormSpecificJsError(baseForm, rule) {
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

function createRuleFormSpecificStatusCodeForm(baseForm, rule) {
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
