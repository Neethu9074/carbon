/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  SpecificJsErrorsWebsiteAlertRule,
  StatusCodeWebsiteAlertRule,
  TagFilterOperator,
  WebsiteAlertRule,
  AggregationType,
  CustomEventWebsiteAlertRule
} from '@instana/types';

import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { notBlankValidator } from 'in-services/validators/string';
import { operators } from 'in-analyze/applicationFilter';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function createRuleForm(rule: WebsiteAlertRule): MapForm<any> {
  const alertType = rule.alertType as WebsitesAlertType;
  const baseForm = createBaseForm(rule);

  switch (alertType) {
    case 'throughput':
      return baseForm;
    case 'slowness':
      return extendForSlowness(baseForm, rule);
    case 'specificJsError':
      return extendForSpecificJsError(baseForm, rule as SpecificJsErrorsWebsiteAlertRule);
    case 'statusCode':
      return extendForSpecificStatusCode(baseForm, rule as StatusCodeWebsiteAlertRule);
    case 'customEvent':
      return extendForCustomEvent(baseForm, rule as CustomEventWebsiteAlertRule);
  }
}

function createBaseForm(rule: WebsiteAlertRule): MapForm<any> {
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

function extendForSlowness(baseForm: MapForm<any>, rule: WebsiteAlertRule): MapForm<any> {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function extendForSpecificJsError(
  baseForm: MapForm<any>,
  rule: { operator?: TagFilterOperator; value?: string }
): MapForm<any> {
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
        validator: (value: string) => {
          if (isBlank(value)) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideAnErrorMessage')
              }
            ];
          } else {
            return null;
          }
        }
      })
    );
}

function extendForSpecificStatusCode(
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
        value: rule.value ?? '4',
        validator: notBlankValidator
      })
    );
}

function extendForCustomEvent(
  baseForm: MapForm<any>,
  rule: { customEventName?: string; aggregation?: AggregationType; metricName: string }
): MapForm<any> {
  const aggregationValue = rule.metricName === 'beaconCount' ? 'SUM' : rule.aggregation ?? 'SUM';
  return baseForm
    .put(
      'customEventName',
      createField({
        value: rule.customEventName ?? '',
        validator: (value: string) => {
          if (isBlank(value)) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.websites.form.errorPleaseProvideCustomEventName')
              }
            ];
          } else {
            return null;
          }
        }
      })
    )
    .put(
      'aggregation',
      createField({
        value: aggregationValue
      })
    );
}
