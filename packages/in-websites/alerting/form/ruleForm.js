/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, notBlankValidator, createMapForm } from 'formalistic';

import { operators } from 'in-analyze/applicationFilter';

export default function createRuleForm(rule) {
  const { alertType } = rule;
  const baseForm = createBaseForm(rule);

  if (alertType === 'throughput') {
    return baseForm;
  }

  if (alertType === 'slowness') {
    return extendForSlowness(baseForm, rule);
  }

  if (alertType === 'specificJsError') {
    return extendForSpecificJsError(baseForm, rule);
  }

  if (alertType === 'statusCode') {
    return extendForSpecificStatusCode(baseForm, rule);
  }
}

function createBaseForm(rule) {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: rule.alertType ?? 'slowness'
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? 'onLoadTime'
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

function extendForSpecificJsError(baseForm, rule) {
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

function extendForSpecificStatusCode(baseForm, rule) {
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
