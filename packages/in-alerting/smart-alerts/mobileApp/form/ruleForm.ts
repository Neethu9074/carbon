/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  TagFilterOperator,
  MobileAppAlertRule,
  StatusCodeMobileAppAlertRule,
  CustomEventMobileAppAlertRule
} from '@instana/types';

import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { notBlankValidator } from 'in-services/validators/string';
import { operators } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function createRuleForm(rule: MobileAppAlertRule): MapForm<any> {
  const alertType = rule.alertType as MobileAlertType;

  const baseForm = createBaseForm(rule);

  switch (alertType) {
    case 'slowness':
      return extendForSlowness(baseForm, rule);
    case 'throughput':
    case 'crash':
      return baseForm;
    case 'statusCode':
      return extendForStatusCode(baseForm, rule as StatusCodeMobileAppAlertRule);
    case 'customEvent':
      return extendForCustomEvent(baseForm, rule as CustomEventMobileAppAlertRule);
  }
  throw new Error(`Unhandled alert type: ${alertType}`);
}

function createBaseForm(rule: MobileAppAlertRule): MapForm<any> {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: rule.alertType ?? 'statusCode'
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? 'httpxxx'
      })
    );
}

function extendForSlowness(baseForm: MapForm<any>, rule: MobileAppAlertRule): MapForm<any> {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function extendForStatusCode(
  baseForm: MapForm<any>,
  rule: { operator?: TagFilterOperator; value?: string }
): MapForm<any> {
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
        value: rule.value ?? '5',
        validator: notBlankValidator
      })
    );
}

function extendForCustomEvent(baseForm: MapForm<any>, rule: { customEventName?: string }): MapForm<any> {
  return baseForm.put(
    'customEventName',
    createField({
      value: rule.customEventName ?? '',
      validator: (value: string) => {
        if (isBlank(value)) {
          return [
            {
              severity: 'error',
              message: t('in-alerting:smartAlerts.mobileApp.form.errorPleaseProvideCustomEventName')
            }
          ];
        } else {
          return null;
        }
      }
    })
  );
}
