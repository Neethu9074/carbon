import { createField, createMapForm } from 'formalistic';

import { operators } from 'in-analyze/applicationFilter';

export default function createRuleForm(rule) {
  const { alertType } = rule;
  const baseForm = createBaseForm(rule);

  if (alertType === 'errorRate') {
    return baseForm;
  }

  if (alertType === 'slowness') {
    return extendForSlowness(baseForm, rule);
  }

  if (alertType === 'logs') {
    return extendForLogs(baseForm, rule);
  }
}

function createBaseForm(rule) {
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

function extendForSlowness(baseForm, rule) {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function extendForLogs(baseForm, rule) {
  return baseForm
    .put(
      'operator',
      createField({
        value: rule.operator ?? operators.EQUALS
      })
    )
    .put(
      'message',
      createField({
        value: rule.message ?? '',
        validator: value => {
          if (!value || value.trim().length === 0) {
            return [
              {
                severity: 'error',
                message: 'Please provide a log message'
              }
            ];
          } else {
            return null;
          }
        }
      })
    )
    .put(
      'level',
      createField({
        value: rule.level ?? 'ERROR'
      })
    );
}
