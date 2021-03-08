/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField } from 'formalistic';

import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import createThresholdForm from 'in-alerting/smart-alerts/websites/alerting/form/thresholdForm';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import createRuleForm from 'in-alerting/smart-alerts/websites/alerting/form/ruleForm';

const severityWarning = 5;

export const fieldNames = Object.freeze({
  tagFilters: 'tagFilters',
  tagFilterExpression: 'tagFilterExpression',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  websiteId: 'websiteId',
  id: 'id',
  granularity: 'granularity'
});

export default function alertFormDefinition(alertConfig) {
  const {
    tagFilters = [],
    tagFilterExpression,
    convertedTagFilterExpression,
    alertChannelIds = [],
    enabled = true,
    triggering = false,
    severity = severityWarning,
    description = '',
    name = '',
    websiteId = '',
    id = '',
    granularity = 600000
  } = alertConfig;

  let form = createMapForm()
    // QB1
    .put(
      fieldNames.tagFilters,
      createField({
        value: tagFilters
      })
    )
    // QB2
    .put(
      fieldNames.tagFilterExpression,
      createField({
        value: fromBackendModel(tagFilterExpression)
      })
    )
    .put(
      'convertedTagFilterExpression',
      createField({
        value: convertedTagFilterExpression ?? false
      })
    )

    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds
      })
    )
    .put(
      fieldNames.enabled,
      createField({
        value: enabled
      })
    )
    .put(
      fieldNames.triggering,
      createField({
        value: triggering
      })
    )
    .put(
      fieldNames.severity,
      createField({
        value: severity
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description
      })
    )
    .put(
      fieldNames.name,
      createField({
        value: name
      })
    )
    .put(
      fieldNames.websiteId,
      createField({
        value: websiteId
      })
    )
    .put(
      fieldNames.id,
      createField({
        value: id
      })
    )
    .put(
      'granularity',
      createField({
        value: granularity
      })
    )
    .put('timeThreshold', createTimeThresholdForm(alertConfig.timeThreshold ?? {}))
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}, alertConfig.rule?.alertType))
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
    .put('hiddenFields', createHiddenFieldsForm(alertConfig.calculateThresholdOnBackend));

  return form;
}

function createHiddenFieldsForm(calculateThresholdOnBackend = false) {
  return createMapForm()
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: calculateThresholdOnBackend
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
