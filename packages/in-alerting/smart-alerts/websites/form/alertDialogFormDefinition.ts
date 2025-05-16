/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { applyEditModeForMultiThreshold } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { getGracePeriod } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { isBlank } from 'in-services/util/string';
import { ThresholdType } from 'in-types';
import { t } from 'in-i18n';

const severityWarning = 5;
export const defaultAdaptiveBaselineGranularity = 1200000;

export const fieldNames = Object.freeze({
  tagFilterExpression: 'tagFilterExpression',
  alertChannelIds: 'alertChannelIds',
  alertChannels: 'alertChannels',
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
  editMode: boolean,
  isTearSheet?: boolean
): MapForm<any> {
  const {
    tagFilterExpression,
    alertChannelIds = [],
    alertChannels = { WARNING: [], CRITICAL: [] },
    enabled = true,
    triggering = false,
    severity = severityWarning,
    description = '',
    name = '',
    websiteId = '',
    id = '',
    granularity = 600000,
    gracePeriod,
    rules
  } = alertConfig;
  const alertChannelList = [...new Set([...(alertChannels?.WARNING ?? []), ...(alertChannels?.CRITICAL ?? [])])];
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
      fieldNames.alertChannels,
      createField({
        value: alertChannels,
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
        validator: isTearSheet ? titleValidator() : stringMaxLengthValidator(MAX_LABEL_LENGTH)
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
        value: getGracePeriod(gracePeriod, granularity)
      })
    )
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold, granularity, alertConfig.threshold?.type as ThresholdType)
    )
    .put('threshold', createThresholdForm(rules?.[0], (rules?.[0].rule?.alertType ?? {}) as WebsitesAlertType))
    .put('rule', createRuleForm(alertConfig.rule ?? {}))
    .put('hiddenFields', createHiddenFieldsForm(alertChannelList, alertConfig.calculateThresholdOnBackend, editMode))
    .put(fieldNames.customPayloadFields, createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false))
    .put(
      'alertChannels',
      createField({
        value: alertChannels ?? { WARNING: [], CRITICAL: [] }
      })
    );

  return applyEditModeForMultiThreshold(form, editMode);
}

function createHiddenFieldsForm(
  alertChannelList: string[],
  calculateThresholdOnBackend?: boolean,
  editMode?: boolean
): MapForm<any> {
  return createMapForm()
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: editMode ? true : Boolean(calculateThresholdOnBackend)
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

export function titleValidator(): (string?: string | null) => ValidationResult {
  return (value?: string | null) => {
    if (typeof value === 'string' && value.length > MAX_LABEL_LENGTH) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeShorterThanMaxLengthCharacters', {
            maxLength: MAX_LABEL_LENGTH
          })
        }
      ];
    } else if (value == null || (typeof value === 'string' && isBlank(value))) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.theValueMustNotBeBlank')
        }
      ];
    }
    return null;
  };
}
