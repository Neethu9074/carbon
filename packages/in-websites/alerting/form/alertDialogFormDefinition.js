/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField } from 'formalistic';

import createTimeThresholdForm from 'in-new-components/Alerting/advanced/TimeThresholdConfig/form';
import createThresholdForm from 'in-websites/alerting/form/thresholdForm';
import createRuleForm from 'in-websites/alerting/form/ruleForm';

const severityWarning = 5;

export const fieldNames = Object.freeze({
  tagFilters: 'tagFilters',
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
    .put(
      fieldNames.tagFilters,
      createField({
        value: tagFilters
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
  return createMapForm().put(
    'calculateThresholdOnBackend',
    createField({
      value: calculateThresholdOnBackend
    })
  );
}
