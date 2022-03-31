/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  websitesAlertingAdditionalPropsAlertLevelChanged,
  websitesAlertingAdditionalPropsDescriptionChanged,
  websitesAlertingAdditionalPropsTriggerChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPreview';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesContainer';
import { default as GlobalAdvancedModeContainer } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeContainer';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/components/AlertTagFilterExpressionConfig';
import WebsiteAlertPropertiesTitleRow from 'in-alerting/smart-alerts/websites/advanced/WebsiteAlertPropertiesTitleRow';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/websites/advanced/BluePrintSelectionSection';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TimeThresholdConfig from 'in-alerting/smart-alerts/websites/advanced/TimeThresholdConfig';
import { ThresholdSection } from 'in-alerting/smart-alerts/websites/advanced/ThresholdSection';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    timeConfig,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    messages,
    editMode,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    websiteLabel
  } = props;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isSpecificJsErrorBlueprint = blueprintConfig.type === 'specificJsError';

  return (
    <GlobalAdvancedModeContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          valid:
            !isSpecificJsErrorBlueprint ||
            !(ruleForm?.get('value')?.valid === false && ruleForm?.get('value')?.touched),
          label: t('in-alerting:smartAlerts.websites.advanced.triggerLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.triggerTitle'),
          content: (
            <BluePrintSelectionSection
              alertType={alertType}
              form={form}
              updateForm={updateForm}
              setSliderState={setSliderState}
            />
          )
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.websites.advanced.scopeLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.scopeTitle'),
          valid: isTagFilterFormModelValid,
          content: (
            <AlertTagFilterExpressionConfig
              form={form}
              updateForm={updateForm}
              websiteLabel={websiteLabel}
              QueryBuilderComponent={QueryBuilderComponent}
            />
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.websites.advanced.thresholdLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.thresholdTitle'),
          valid:
            formFieldsValid(form, ['threshold']) ||
            !formFieldsTouched(form, ['threshold']) ||
            // when filter is invalid, baseline depends on it, avoid redundant invalidation indicator
            (thresholdType === HISTORIC_BASELINE && !isTagFilterFormModelValid) ||
            // when the rule definition is incomplete, we do not show a preview chart and
            // the threshold is _per se invalid_ , so
            // we ignore this fact, to avoid an invalid step,
            // to be more clear to the user
            !blueprintConfig.isRuleComplete(ruleForm.toJS()) ||
            // when the query is invalid, we should not show
            // the threshold to be invalid, but
            // it is already shown for the scope section
            // when incomplete baseline data exist, we ignore this, because the user can save it anyway
            (thresholdType === HISTORIC_BASELINE && thresholdResult?.errors?.length > 0),
          content: (
            <ThresholdSection
              alertType={alertType}
              blueprintConfig={blueprintConfig}
              editMode={editMode}
              form={form}
              onChartViewConfigChange={onChartViewConfigChange}
              selectedChartViewConfigIndex={selectedChartViewConfigIndex}
              thresholdResult={thresholdResult}
              timeConfig={timeConfig}
              updateForm={updateForm}
              websiteLabel={websiteLabel}
            />
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.websites.advanced.timeThresholdLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.timeThresholdTitle'),
          valid:
            !(
              form.get('timeThreshold')?.get('users')?.valid === false &&
              form.get('timeThreshold')?.get('users')?.touched
            ) &&
            !(
              form.get('timeThreshold')?.get('userPercentage')?.valid === false &&
              form.get('timeThreshold')?.get('userPercentage')?.touched
            ),
          content: (
            <TimeThresholdConfig
              form={form}
              onChange={onChange}
              updateForm={updateForm}
              impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
              hasUserImpactOption
            />
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.websites.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.alertChannelsTitle'),
          valid: true,
          content: (
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={7}
            />
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.websites.advanced.propertiesLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.propertiesTitle'),
          valid: true,
          content: (
            <AlertPropertiesContainer
              renderAlertProperties={() => (
                <AlertProperties
                  form={form}
                  onChange={onChange}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  getPreviewTitlePlaceholder={getTitlePlaceholder}
                  trackAlertLevelChanged={websitesAlertingAdditionalPropsAlertLevelChanged}
                  trackDescriptionChanged={websitesAlertingAdditionalPropsDescriptionChanged}
                  trackTriggerChanged={websitesAlertingAdditionalPropsTriggerChanged}
                  renderAlertPopertiesTitleRow={() => (
                    <WebsiteAlertPropertiesTitleRow form={form} onChange={onChange} />
                  )}
                />
              )}
              renderAlertPreview={() => (
                <AlertPreview
                  form={form}
                  label={websiteLabel}
                  entityIconType="lib_website"
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  renderHeadline={() => (
                    <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder(form)} />
                  )}
                />
              )}
            />
          )
        },
        {
          scrollId: '7',
          label: t('in-alerting:smartAlerts.websites.advanced.payloadsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.payloadsTitle'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: <AlertConfigCustomPayload form={form} setForm={updateForm} />
        }
      ]}
    />
  );
}

function formFieldsValid(form, fieldsToCheck) {
  const invalid = Object.entries(form?.items ?? {})
    .filter(([fieldName]) => fieldsToCheck?.includes(fieldName))
    .some(([, { hierarchyValid }]) => !hierarchyValid);
  return !invalid;
}

function formFieldsTouched(form, fieldsToCheck) {
  const touched = Object.entries(form?.items ?? {})
    .filter(([fieldName]) => fieldsToCheck?.includes(fieldName))
    .some(([, { hierarchyTouched }]) => hierarchyTouched);
  return touched;
}

function fieldTouchedAndInvalid(field) {
  return field && field.touched && !field.valid;
}

function payloadItemInvalid(item) {
  const key = item.get('key');
  const val = item.get('value');
  return fieldTouchedAndInvalid(key) || fieldTouchedAndInvalid(val);
}

// TODO extract this into own module as part of story https://instana.kanbanize.com/ctrl_board/37/cards/91077
function isCustomPayloadValidOrUntouched(form) {
  const customPayloadForm = form.get('customPayloadFields');
  const { touched, valid, items } = customPayloadForm;
  if (!touched) return true;
  if (!valid) return false; // valid as long as all keys are unique

  return !items.find(item => payloadItemInvalid(item));
}
