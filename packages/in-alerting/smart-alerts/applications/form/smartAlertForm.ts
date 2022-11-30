/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import {
  ApplicationAlertConfigWithMetadata,
  GlobalApplicationsAlertConfigWithMetadata,
  ThresholdType,
  ThresholdConfigUnion
} from 'in-types';
// @ts-expect-error file needs to be converted
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import createTimeThresholdForm from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { applyEditMode } from 'in-alerting/smart-alerts/components/smart-alert-dialog/sharedFunctions';
import createRuleForm, { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import createThresholdForm from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { boundaryScopes } from 'in-applications/constants';
import { t } from 'in-i18n';

const defaultSeverity = 5;
export const defaultGranularity = 600000;
export const defaultAdaptiveBaselineGranularity = 1200000;

export interface AlertConfigHiddenFields {
  // an optional, "hidden" from field, will not be part with server communication
  calculateThresholdOnBackend?: boolean;
}

export interface UiExtraData {
  applicationId?: string;
  endpointId?: string;
  serviceId?: string;

  builtIn?: boolean;
}

interface OptionalGlobalApplicationsAlertConfig extends Partial<GlobalApplicationsAlertConfigWithMetadata> {}

interface OptionalIndividualApplicationAlertConfig extends Partial<ApplicationAlertConfigWithMetadata> {}

/**
 * Type that is used when creating an AP Smart Alert config (e.g. via floating button), where depending on the dashboard context
 * this button is pressed, a different partial alert config can be passed, while the remaining fields are overridden with default
 * values that are internally defined.
 */
type CreateApplicationAlertConfig = (OptionalGlobalApplicationsAlertConfig | OptionalIndividualApplicationAlertConfig) &
  AlertConfigHiddenFields &
  UiExtraData;

export function createSmartAlertForm(
  alertConfig: CreateApplicationAlertConfig,
  editMode?: boolean,
  isGlobalSmartAlert?: boolean
): MapForm {
  const {
    applicationId,
    alertChannelIds,
    applications,
    boundaryScope,
    builtIn,
    customPayloadFields,
    created,
    description,
    enabled,
    evaluationType,
    id,
    granularity,
    includeSynthetic,
    includeInternal,
    name,
    readOnly,
    rule,
    severity,
    tagFilterExpression,
    threshold,
    timeThreshold,
    triggering
  } = alertConfig;

  const form = createMapForm()
    .put(
      'name',
      createField({
        value: name ?? '',
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      'description',
      createField({
        value: description ?? '',
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
      })
    )
    .put(
      'applicationId', // deprecated: use 'applications' instead
      createField({
        value: applicationId ?? ''
      })
    )
    .put(
      'boundaryScope',
      createField({
        value: boundaryScope ?? boundaryScopes.inbound
      })
    )
    .put(
      'includeSynthetic',
      createField({
        value: includeSynthetic || false
      })
    )
    .put(
      'includeInternal',
      createField({
        value: includeInternal || false
      })
    )
    .put(
      'severity',
      createField({
        value: severity ?? defaultSeverity
      })
    )
    .put(
      'triggering',
      createField({
        value: triggering ?? false
      })
    )
    .put(
      'tagFilterExpression',
      createField({
        value: fromBackendModel(tagFilterExpression)
      })
    )
    .put(
      'evaluationType',
      createField({
        value: evaluationType ?? PER_AP
      })
    )
    .put(
      'alertChannelIds',
      createField({
        value: alertChannelIds ?? []
      })
    )
    .put(
      'granularity',
      createField({
        value: granularity ?? getDefaultGranularity(threshold)
      })
    )
    .put(
      'id',
      createField({
        value: id ?? ''
      })
    )
    .put(
      'created',
      createField({
        value: created ?? 0
      })
    )
    .put(
      'readOnly',
      createField({
        value: readOnly ?? false
      })
    )
    .put(
      'enabled',
      createField({
        value: enabled ?? true
      })
    )
    .put(
      'builtIn',
      createField({
        value: builtIn,
        validator: value => {
          if (value !== builtIn) {
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
        value: applications ?? {},
        validator: entitySelection => {
          if (!isEntitySelectionValid(entitySelection, isGlobalSmartAlert)) {
            return [
              {
                severity: 'error'
              }
            ];
          } else {
            return null;
          }
        }
      })
    )
    .put('rule', createRuleForm(rule ?? defaultAlertRule))
    .put('timeThreshold', createTimeThresholdForm(timeThreshold, granularity, threshold?.type as ThresholdType))
    .put('hiddenFields', createHiddenFieldsForm(alertConfig))
    .put('customPayloadFields', createListFormForCustomPayloads(customPayloadFields ?? [], false))
    .put('threshold', createThresholdForm(threshold, (rule?.alertType ?? 'errorRate') as ApplicationAlertType));

  return applyEditMode(form, editMode ?? false);
}

function getDefaultGranularity(threshold?: ThresholdConfigUnion) {
  return threshold?.type === ADAPTIVE_BASELINE ? defaultAdaptiveBaselineGranularity : defaultGranularity;
}

function createHiddenFieldsForm({ calculateThresholdOnBackend }: AlertConfigHiddenFields) {
  return createMapForm()
    .put(
      'calculateThresholdOnBackend',
      createField({
        value: Boolean(calculateThresholdOnBackend)
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
