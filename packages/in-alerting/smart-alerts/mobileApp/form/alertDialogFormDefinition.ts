/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { MobileAppAlertConfigWithMetadata } from '@instana/types';

// import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/mobileApp/form/thresholdForm';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import { ThresholdType } from 'in-types';

const severityWarning = 5;
export const fieldNames = Object.freeze({
  tagFilterExpression: 'tagFilterExpression',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  mobileAppId: 'mobileAppId',
  id: 'id',
  granularity: 'granularity'
});

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
}

export default function alertFormDefinition(
  alertConfig: MobileAppAlertConfigWithMetadata & AlertConfigHiddenFields,
  editMode: boolean
): MapForm<any> {
  const {
    tagFilterExpression,
    alertChannelIds = [],
    enabled = true,
    triggering = false,
    severity = severityWarning,
    description = '',
    name = '',
    mobileAppId = '',
    id = '',
    granularity = 600000
  } = alertConfig;

  const form = createMapForm()
    .put(
      fieldNames.tagFilterExpression,
      createField({
        value: tagFilterExpression ? fromBackendModel(tagFilterExpression) : []
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
      fieldNames.mobileAppId,
      createField({
        value: mobileAppId
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
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold, granularity, alertConfig.threshold?.type as ThresholdType)
    )
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}))
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
    .put('hiddenFields', createHiddenFieldsForm(alertConfig.calculateThresholdOnBackend));

  return applyEditMode(form, editMode);
}

function createHiddenFieldsForm(calculateThresholdOnBackend = false) {
  return createMapForm().put(
    'calculateThresholdOnBackend',
    createField({
      value: calculateThresholdOnBackend
    })
  );
}
