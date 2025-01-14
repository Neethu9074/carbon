/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { ThresholdType } from 'in-types';

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
  websiteId: 'websiteId',
  id: 'id',
  granularity: 'granularity',
  gracePeriod: 'gracePeriod',
  customPayloadFields: 'customPayloadFields'
});

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
}

export default function alertFormDefinition(
  alertConfig: WebsiteSmartAlertConfigWithMetadata & AlertConfigHiddenFields,
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
    websiteId = '',
    id = '',
    granularity = 600000,
    gracePeriod
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
    .put(
      'gracePeriod',
      createField({
        value: gracePeriod ?? granularity
      })
    )
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold, granularity, alertConfig.threshold?.type as ThresholdType)
    )
    .put('threshold', createThresholdForm(alertConfig.threshold ?? {}, alertConfig.rule.alertType as WebsitesAlertType))
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
