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
import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/logs/form/thresholdForm';
import { LogAlertConfig, ThresholdType, VersionedConfig } from 'in-types';
import { stringMaxLengthValidator } from 'in-services/validators/string';

const severityWarning = 5;
export const defaultAdaptiveBaselineGranularity = 1200000;
export const fieldNames = Object.freeze({
  alertChannelIds: 'alertChannelIds',
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
  alertConfig: LogAlertConfig & VersionedConfig & AlertConfigHiddenFields,
  editMode: boolean
): MapForm<any> {
  const {
    alertChannelIds = [],
    description = '',
    granularity = 600000,
    gracePeriod,
    groupBy = [],
    name = '',
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
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}))
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold, granularity, alertConfig.threshold?.type as ThresholdType)
    )
    .put('hiddenFields', createHiddenFieldsForm(alertConfig.calculateThresholdOnBackend))
    .put(fieldNames.customPayloadFields, createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false));

  return applyEditMode(form, editMode);
}

export function createHiddenFieldsForm(calculateThresholdOnBackend = false) {
  return createMapForm().put(
    'calculateThresholdOnBackend',
    createField({
      value: calculateThresholdOnBackend
    })
  );
}
