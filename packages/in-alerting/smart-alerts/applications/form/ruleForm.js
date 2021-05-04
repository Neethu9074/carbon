/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';

import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

export default function createRuleForm(rule) {
  const { alertType } = rule;
  const baseForm = createBaseForm(rule);

  if (alertType === 'errorRate' || alertType === 'throughput') {
    return baseForm;
  }

  if (alertType === 'slowness') {
    return extendForSlowness(baseForm, rule);
  }

  if (alertType === 'logs') {
    return extendForLogs(baseForm, rule);
  }

  if (alertType === 'statusCode') {
    return extendForStatusCode(baseForm, rule);
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
        value: rule.metricName ?? 'latency'
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
                message: t('in-alerting:smartAlerts.applications.form.ruleFormPleaseProvideALogMessage')
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

function extendForStatusCode(baseForm, rule) {
  const statusCodeForm = createMapForm({
    items: {
      statusCodeStart: createField({
        value: rule.statusCode?.statusCodeStart ?? 500,
        validator: value => {
          if (!Number.isInteger(value)) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.ruleFormPleaseProvideAStartStatusCode')
              }
            ];
          }
          return null;
        }
      }),
      statusCodeEnd: createField({
        value: rule.statusCode?.statusCodeEnd ?? 599,
        validator: value => {
          if (!Number.isInteger(value)) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.ruleFormPleaseProvideAEndStatusCode')
              }
            ];
          }
          return null;
        }
      }),
      isCustomRange: createField({ value: rule.statusCode?.isCustomRange ?? false })
    },
    validator: items => {
      const start = items['statusCodeStart'].value;
      const end = items['statusCodeEnd'].value;
      if (start > end) {
        return [
          {
            severity: 'error',
            message: t('in-alerting:smartAlerts.applications.form.ruleFormErrorStatusCodeStartGTEnd')
          }
        ];
      }
      return null;
    }
  });
  return baseForm.put('statusCode', statusCodeForm);
}
