/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { MobileAppSmartAlertConfig } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/mobileApp/form/ruleForm';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { ThresholdType, VersionedConfig } from 'in-types';

const severityWarning = 5;
export const defaultAdaptiveBaselineGranularity = 1200000;
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
  granularity: 'granularity',
  customPayloadFields: 'customPayloadFields'
});

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
}

export default function alertFormDefinition(
  alertConfig: MobileAppSmartAlertConfig & VersionedConfig & AlertConfigHiddenFields,
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
        value: tagFilterExpression ? fromBackendModel(tagFilterExpression) : [],
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
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
        value: description,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
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
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}, alertConfig.rule.alertType))
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
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
      'suggestedThresholdValue',
      createField({
        value: null
      })
    );
}
