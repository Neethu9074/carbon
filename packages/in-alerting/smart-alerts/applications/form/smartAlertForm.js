/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm } from 'formalistic';

import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';

const defaultSeverity = 5;
const defaultGranularity = 600000;

export function createSmartAlertForm(alertConfig) {
  let form = createMapForm()
    .put(
      'name',
      createField({
        value: alertConfig.name ?? ''
      })
    )
    .put(
      'description',
      createField({
        value: alertConfig.description ?? ''
      })
    )
    .put(
      'applicationId', // deprecated: use 'applications' instead
      createField({
        value: alertConfig.applicationId ?? ''
      })
    )
    .put(
      'applications',
      createField({
        value: alertConfig.applications ?? {}
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: alertConfig.boundaryScope ?? 'INBOUND'
      })
    )
    .put(
      'includeSynthetic',
      createField({
        value: alertConfig.includeSynthetic || false
      })
    )
    .put(
      'includeInternal',
      createField({
        value: alertConfig.includeInternal || false
      })
    )
    .put(
      'severity',
      createField({
        value: alertConfig.severity ?? defaultSeverity
      })
    )
    .put(
      'triggering',
      createField({
        value: alertConfig.triggering ?? false
      })
    )
    // QB1
    .put(
      'tagFilters',
      createField({
        value: alertConfig.tagFilters ?? []
      })
    )
    // QB2
    .put(
      'tagFilterExpression',
      createField({
        value: fromBackendModel(alertConfig.tagFilterExpression)
      })
    )
    .put(
      'evaluationType',
      createField({
        value: alertConfig.evaluationType ?? PER_AP
      })
    )
    .put(
      'convertedTagFilterExpression',
      createField({
        value: alertConfig.convertedTagFilterExpression
      })
    )
    .put(
      'alertChannelIds',
      createField({
        value: alertConfig.alertChannelIds ?? []
      })
    )
    .put(
      'granularity',
      createField({
        value: alertConfig.granularity ?? defaultGranularity
      })
    )
    .put(
      'id',
      createField({
        value: alertConfig.id ?? ''
      })
    )
    .put(
      'created',
      createField({
        value: alertConfig.created ?? ''
      })
    )
    .put(
      'readOnly',
      createField({
        value: alertConfig.readOnly ?? false
      })
    )
    .put(
      'enabled',
      createField({
        value: alertConfig.enabled ?? true
      })
    )
    .put(
      'applications',
      createField({
        value: alertConfig.applications,
        validator: entitySelection => {
          if (!isEntitySelectionValid(entitySelection)) {
            return [
              {
                severity: 'error',
                message: 'No entities selected'
              }
            ];
          } else {
            return null;
          }
        }
      })
    )
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
    .put('timeThreshold', createTimeThresholdForm(alertConfig.timeThreshold ?? {}))
    .put('hiddenFields', createHiddenFieldsForm(alertConfig));

  const alertType = alertConfig.rule?.alertType ?? 'errorRate';
  return form.put('threshold', createThresholdForm(alertConfig.threshold, alertType));
}

function createHiddenFieldsForm(alertConfig) {
  return createMapForm()
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: Boolean(alertConfig.calculateThresholdOnBackend)
      })
    )
    .put(
      'suggestedThresholdValue',
      createField({
        value: null
      })
    )
    .put(
      'thresholdValueManuallyChanged',
      createField({
        value: false
      })
    );
}
