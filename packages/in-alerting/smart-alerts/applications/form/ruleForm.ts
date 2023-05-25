/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

import {
  ApplicationAlertRule,
  LogsApplicationAlertRule,
  SlownessApplicationAlertRule,
  StatusCodeApplicationAlertRule
} from 'in-types';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

/**
 * StatusCodeApplicationAlertRule has a different structure.
 * On client side we use an extended form with to store customRange differently
 */
export interface StatusCodeRangeLikeApplicationAlertRule extends StatusCodeApplicationAlertRule {
  statusCode?: {
    isCustomRange?: boolean;
    statusCodeStart?: string;
    statusCodeEnd?: string;
  };
}

export default function createRuleForm(rule: ApplicationAlertRule): MapForm<any> {
  const alertType = rule.alertType as ApplicationAlertType;

  const baseForm = createBaseForm(rule);

  if (alertType === 'errors' || alertType === 'throughput') {
    return baseForm;
  }

  if (alertType === 'slowness') {
    return extendForSlowness(baseForm, rule);
  }

  if (alertType === 'logs') {
    return extendForLogs(baseForm, rule as LogsApplicationAlertRule);
  }

  if (alertType === 'statusCode') {
    return extendForStatusCode(baseForm, rule as StatusCodeRangeLikeApplicationAlertRule);
  }

  return baseForm;
}

function createBaseForm(rule: ApplicationAlertRule): MapForm<any> {
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

function extendForSlowness(baseForm: MapForm<any>, rule: ApplicationAlertRule): MapForm<any> {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function extendForLogs(baseForm: MapForm<any>, rule: LogsApplicationAlertRule): MapForm<any> {
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

function extendForStatusCode(baseForm: MapForm<any>, rule: StatusCodeRangeLikeApplicationAlertRule) {
  const statusCodeForm = createMapForm({
    items: {
      statusCodeStart: createField({
        value: rule.statusCode?.statusCodeStart ?? 500,
        validator: value => {
          if (!Number.isInteger(value) || value < 1) {
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
          if (!Number.isInteger(value) || value < 1) {
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
      const start = (items['statusCodeStart'] as Field<string>).value;
      const end = (items['statusCodeEnd'] as Field<string>).value;
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

export const defaultAlertRule: SlownessApplicationAlertRule = {
  alertType: 'slowness',
  aggregation: 'P90',
  metricName: 'latency'
};
