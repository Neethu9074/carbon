/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { InfraSmartAlertConfig } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import createThresholdForm from 'in-alerting/smart-alerts/infrastructure/form/thresholdForm';
import regexValidator from 'in-alerting/smart-alerts/infrastructure/data/regexValidator';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createRuleForm from 'in-alerting/smart-alerts/infrastructure/form/ruleForm';
import { groupbyTag } from 'in-alerting/smart-alerts/utils/groupingUtils';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { ThresholdType, VersionedConfig } from 'in-types';

export const defaultAdaptiveBaselineGranularity = 1200000;
export const fieldNames = Object.freeze({
  alertChannelIds: 'alertChannelIds',
  alertChannels: 'alertChannels',
  customPayloadFields: 'customPayloadFields',
  description: 'description',
  granularity: 'granularity',
  groupBy: 'groupBy',
  name: 'name',
  predictiveTrigger: 'predictiveTrigger',
  rule: 'rule',
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
  alertConfig: InfraSmartAlertConfig & VersionedConfig & AlertConfigHiddenFields,
  editMode: boolean
): MapForm<any> {
  const {
    alertChannelIds = [],
    alertChannels = { WARNING: [], CRITICAL: [] },
    description = '',
    granularity = 600000,
    groupBy = [],
    name = '',
    predictiveTrigger = null,
    tagFilterExpression,
    id = ''
  } = alertConfig;
  const alertChannelList = [...new Set([...(alertChannels?.WARNING ?? []), ...(alertChannels?.CRITICAL ?? [])])];
  //@ts-expect-error
  return createMapForm({ validator: regexValidator })
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
      })
    )
    .put(
      fieldNames.alertChannels,
      createField({
        value: alertChannels,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
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
        value: name,
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      fieldNames.predictiveTrigger,
      createField({
        value: predictiveTrigger
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
    .put('rule', createRuleForm(alertConfig.rules[0]?.rule ?? {}))
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold, granularity, alertConfig.threshold?.type as ThresholdType)
    )
    .put('threshold', createThresholdForm(alertConfig.rules[0] ?? {}, editMode))
    .put('hiddenFields', createHiddenFieldsForm(editMode, alertChannelList))
    .put(fieldNames.customPayloadFields, createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false));
}

export function createHiddenFieldsForm(calculateThresholdOnBackend = false, alertChannelList: string[]) {
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
    )
    .put(
      'selectedChannelList',
      createField({
        value: alertChannelList
      })
    );
}
