/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
//@ts-expect-error
import { groupbyTag } from 'in-alerting/smart-alerts/infrastructure/data/alertConfigUtils';
import createThresholdForm from 'in-alerting/smart-alerts/infrastructure/form/thresholdForm';
import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createRuleForm from 'in-alerting/smart-alerts/infrastructure/form/ruleForm';
import { InfraAlertConfig, ThresholdType, VersionedConfig } from 'in-types';
import { stringMaxLengthValidator } from 'in-services/validators/string';

const severityWarning = 5;
export const defaultAdaptiveBaselineGranularity = 1200000;
export const fieldNames = Object.freeze({
  alertChannelIds: 'alertChannelIds',
  customPayloadFields: 'customPayloadFields',
  description: 'description',
  granularity: 'granularity',
  groupBy: 'groupBy',
  name: 'name',
  predictiveTrigger: 'predictiveTrigger',
  rule: 'rule',
  severity: 'severity',
  tagFilterExpression: 'tagFilterExpression',
  threshold: 'threshold',
  timeThreshold: 'timeThreshold',
  id: 'id'
});

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
  metricLabel?: string;
  metricPath?: string;
}

export default function alertFormDefinition(
  alertConfig: InfraAlertConfig & VersionedConfig & AlertConfigHiddenFields,
  editMode: boolean
): MapForm<any> {
  const {
    alertChannelIds = [],
    description = '',
    granularity = 600000,
    groupBy = [],
    name = '',
    predictiveTrigger = null,
    severity = severityWarning,
    tagFilterExpression,
    id = ''
  } = alertConfig;

  const form = createMapForm()
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description
      })
    )
    .put(
      'granularity',
      createField({
        value: granularity
      })
    )
    .put(
      'groupBy',
      createField({
        value: groupbyTag(groupBy)
      })
    )
    .put(
      fieldNames.name,
      createField({
        value: name
      })
    )
    .put(
      fieldNames.predictiveTrigger,
      createField({
        value: predictiveTrigger
      })
    )
    .put(
      fieldNames.severity,
      createField({
        value: severity
      })
    )
    .put(
      fieldNames.tagFilterExpression,
      createField({
        value: tagFilterExpression ? fromBackendModel(tagFilterExpression) : [],
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      fieldNames.id,
      createField({
        value: id
      })
    )
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold, granularity, alertConfig.threshold?.type as ThresholdType)
    )
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}))
    .put('hiddenFields', createHiddenFieldsForm(alertConfig.calculateThresholdOnBackend))
    .put(fieldNames.customPayloadFields, createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false));

  return applyEditMode(form, editMode);
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
      'metricLabel',
      createField({
        value: null
      })
    )
    .put(
      'metricPath',
      createField({
        value: null
      })
    )
    .put(
      'suggestedThresholdValue',
      createField({
        value: null
      })
    );
}
