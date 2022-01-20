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
import { validateCheckForCustomPayload } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import TimeThresholdConfig from 'in-alerting/smart-alerts/websites/advanced/TimeThresholdConfig';
import { ThresholdSection } from 'in-alerting/smart-alerts/websites/advanced/ThresholdSection';
import { fieldNames } from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    form,
    websiteLabel,
    timeConfig,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    QueryBuilderComponent,
    editMode
  } = props;
  const alertType = form.get('rule').get('alertType').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  return (
    <GlobalAdvancedModeContainer
      {...props}
      navItems={[
        {
          scrollId: '1',
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
          valid: true,
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
          valid: formFieldsValid(form, ['rule', 'threshold']),
          checked: formFieldsTouched(form, ['rule', 'threshold']),
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
          checked: true,
          valid: true,
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
          checked: form.get(fieldNames.alertChannelIds).value.length > 0,
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
          checked: !!(form.get(fieldNames.name).value || form.get(fieldNames.description).value),
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
          checked: validateCheckForCustomPayload(form),
          valid: true,
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
