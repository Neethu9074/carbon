import { createField, createMapForm } from 'formalistic';

export default function createRuleForm(rule = {}) {
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
    )
    .put(
      'aggregation',
      createField({
        value: rule.aggregation ?? 'P90'
      })
    );
}
