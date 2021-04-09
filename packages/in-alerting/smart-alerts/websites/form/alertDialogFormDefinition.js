/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';

import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';

const severityWarning = 5;

export const fieldNames = Object.freeze({
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

export default function alertFormDefinition(alertConfig, editMode) {
  const {
    tagFilterExpression,
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

  // In edit mode, we don't want to override the saved threshold/baseline value with our suggestion by default.
  // The saved value is the same as a user-defined value, which we should not override by default.
  const doNotOverrideThresholdWithSuggestion = editMode;

  return createMapForm()
    .put(
      fieldNames.tagFilterExpression,
      createField({
        value: fromBackendModel(tagFilterExpression)
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
    .put(
      'hiddenFields',
      createHiddenFieldsForm(alertConfig.calculateThresholdOnBackend, doNotOverrideThresholdWithSuggestion)
    );
}

function createHiddenFieldsForm(calculateThresholdOnBackend = false, thresholdValueManuallyChanged = false) {
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
        value: thresholdValueManuallyChanged ?? false
      })
    );
}
