/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';

import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { applyEditMode } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import createRuleForm, { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

const defaultSeverity = 5;
export const defaultGranularity = 600000;
export const defaultAdaptiveBaselineGranularity = 1200000;

export function createSmartAlertForm(alertConfig, editMode) {
  const granularity = alertConfig.granularity ?? getDefaultGranularity(alertConfig);

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: alertConfig.name ?? '',
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      'description',
      createField({
        value: alertConfig.description ?? '',
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
      })
    )
    .put(
      'applicationId', // deprecated: use 'applications' instead
      createField({
        value: alertConfig.applicationId ?? ''
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: alertConfig.boundaryScope ?? 'INBOUND'
      })
    )
    .put(
      'includeSynthetic',
      createField({
        value: alertConfig.includeSynthetic || false
      })
    )
    .put(
      'includeInternal',
      createField({
        value: alertConfig.includeInternal || false
      })
    )
    .put(
      'severity',
      createField({
        value: alertConfig.severity ?? defaultSeverity
      })
    )
    .put(
      'triggering',
      createField({
        value: alertConfig.triggering ?? false
      })
    )
    .put(
      'tagFilterExpression',
      createField({
        value: fromBackendModel(alertConfig.tagFilterExpression)
      })
    )
    .put(
      'evaluationType',
      createField({
        value: alertConfig.evaluationType ?? PER_AP
      })
    )
    .put(
      'alertChannelIds',
      createField({
        value: alertConfig.alertChannelIds ?? []
      })
    )
    .put(
      'granularity',
      createField({
        value: granularity
      })
    )
    .put(
      'id',
      createField({
        value: alertConfig.id ?? ''
      })
    )
    .put(
      'created',
      createField({
        value: alertConfig.created ?? ''
      })
    )
    .put(
      'readOnly',
      createField({
        value: alertConfig.readOnly ?? false
      })
    )
    .put(
      'enabled',
      createField({
        value: alertConfig.enabled ?? true
      })
    )
    .put(
      'builtIn',
      createField({
        value: alertConfig.builtIn,
        validator: value => {
          if (value !== alertConfig.builtIn) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.smartAlertFormValueIsReadOnly')
              }
            ];
          }
          return [];
        }
      })
    )
    .put(
      'applications',
      createField({
        value: alertConfig.applications ?? {},
        validator: entitySelection => {
          if (!isEntitySelectionValid(entitySelection, alertConfig.builtIn)) {
            return [
              {
                severity: 'error',
                message: t('in-alerting:smartAlerts.applications.form.smartAlertFormNoEntitiesSelected')
              }
            ];
          } else {
            return null;
          }
        }
      })
    )
    .put('rule', createRuleForm(alertConfig.rule ?? defaultAlertRule))
    .put(
      'timeThreshold',
      createTimeThresholdForm(alertConfig.timeThreshold ?? {}, granularity, alertConfig.threshold?.type)
    )
    .put('hiddenFields', createHiddenFieldsForm(alertConfig))
    .put('customPayloadFields', createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false));

  const alertType = alertConfig.rule?.alertType ?? 'errorRate';
  form = form.put('threshold', createThresholdForm(alertConfig.threshold, alertType));

  return applyEditMode(form, editMode);
}

function getDefaultGranularity(alertConfig) {
  return alertConfig.threshold?.type === ADAPTIVE_BASELINE ? defaultAdaptiveBaselineGranularity : defaultGranularity;
}

function createHiddenFieldsForm(alertConfig) {
  return createMapForm()
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: Boolean(alertConfig.calculateThresholdOnBackend)
      })
    )
    .put(
      'suggestedThresholdValue',
      createField({
        value: null
      })
    )
    .put(
      'chartViewEntitySelection',
      createField({
        value: {
          applicationId: null,
          serviceId: null,
          endpointId: null
        }
      })
    );
}
