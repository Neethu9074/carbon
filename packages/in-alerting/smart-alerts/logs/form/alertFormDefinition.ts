/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
//@ts-expect-error
import { titleValidator } from 'in-alerting/smart-alerts/logs/data/alertConfigUtils';
import { logsGroupbyTag } from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigUtils';
import { LogSmartAlertConfig } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/logs/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/logs/form/ruleForm';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { ThresholdType, VersionedConfig } from 'in-types';

export const defaultAdaptiveBaselineGranularity = 1200000;
export const fieldNames = Object.freeze({
  alertChannelIds: 'alertChannelIds',
  alertChannels: 'alertChannels',
  customPayloadFields: 'customPayloadFields',
  description: 'description',
  granularity: 'granularity',
  gracePeriod: 'gracePeriod',
  groupBy: 'groupBy',
  name: 'name',
  severity: 'severity',
  tagFilterExpression: 'tagFilterExpression',
  threshold: 'threshold',
  timeThreshold: 'timeThreshold',
  id: 'id'
});

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
}

export default function alertFormDefinition(
  alertConfig: LogSmartAlertConfig & VersionedConfig & AlertConfigHiddenFields,
  editMode: boolean
): MapForm<any> {
  const {
    alertChannelIds = [],
    alertChannels = { WARNING: [], CRITICAL: [] },
    description = '',
    granularity = 600000,
    gracePeriod,
    groupBy = [],
    name = '',
    tagFilterExpression,
    id = '',
    rules
  } = alertConfig;
  const alertChannelList = [...new Set([...(alertChannels?.WARNING ?? []), ...(alertChannels?.CRITICAL ?? [])])];
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
      fieldNames.gracePeriod,
      createField({
        value: gracePeriod ?? granularity
      })
    )
    .put(
      'groupBy',
      createField({
        value: logsGroupbyTag(groupBy)[0]
      })
    )
    .put(
      fieldNames.name,
      createField({
        value: name,
        validator: titleValidator()
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
    .put('rule', createRuleForm())
    .put('threshold', createThresholdForm(rules?.[0] ?? {}, editMode))
    .put(
      'timeThreshold',
      createTimeThresholdForm(
        alertConfig.timeThreshold,
        granularity,
        rules?.[0]?.thresholds?.WARNING?.type as ThresholdType
      )
    )
    .put('hiddenFields', createHiddenFieldsForm(alertChannelList, editMode))
    .put(fieldNames.customPayloadFields, createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false))
    .put(
      'alertChannels',
      createField({
        value: alertChannels ?? { WARNING: [], CRITICAL: [] }
      })
    );

  return form;
}

export function createHiddenFieldsForm(alertChannelList: string[], calculateThresholdOnBackend = false) {
  return createMapForm()
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: calculateThresholdOnBackend
      })
    )
    .put(
      'selectedChannelList',
      createField({
        value: alertChannelList
      })
    );
}
