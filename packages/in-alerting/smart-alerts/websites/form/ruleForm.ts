/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  SpecificJsErrorsWebsiteAlertRule,
  StatusCodeWebsiteAlertRule,
  TagFilterOperator,
  WebsiteAlertRule
} from 'in-types';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { notBlankValidator } from 'in-services/validators/string';
import { operators } from 'in-analyze/applicationFilter';
import { t } from 'in-i18n';

// @ts-expect-error TS2366: Function lacks ending return statement and return type does not include 'undefined' - should never happen, because each WebsiteAlertType gets mapped to a form which gets returned.
export default function createRuleForm(rule: WebsiteAlertRule): MapForm {
  const alertType = rule.alertType as WebsitesAlertType;

  const baseForm = createBaseForm(rule);

  if (alertType === 'throughput') {
    return baseForm;
  }

  if (alertType === 'slowness') {
    return extendForSlowness(baseForm, rule);
  }

  if (alertType === 'specificJsError') {
    return extendForSpecificJsError(baseForm, rule as SpecificJsErrorsWebsiteAlertRule);
  }

  if (alertType === 'statusCode') {
    return extendForSpecificStatusCode(baseForm, rule as StatusCodeWebsiteAlertRule);
  }
}

function createBaseForm(rule: WebsiteAlertRule): MapForm {
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

function extendForSlowness(baseForm: MapForm, rule: WebsiteAlertRule): MapForm {
  return baseForm.put(
    'aggregation',
    createField({
      value: rule.aggregation ?? 'P90'
    })
  );
}

function extendForSpecificJsError(baseForm: MapForm, rule: { operator?: TagFilterOperator; value?: string }): MapForm {
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
          if (!value || value.trim().length === 0) {
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
  baseForm: MapForm,
  rule: { operator?: TagFilterOperator; value?: string }
): MapForm {
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
