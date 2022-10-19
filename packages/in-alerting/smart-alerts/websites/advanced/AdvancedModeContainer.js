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
import AdvancedModeStepsContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AdvancedModeStepsContainer';
import {
  isCustomPayloadValidOrUntouched,
  fieldTouchedAndInvalid
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/components/AlertTagFilterExpressionConfig';
import WebsiteAlertPropertiesTitleRow from 'in-alerting/smart-alerts/websites/advanced/WebsiteAlertPropertiesTitleRow';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/websites/advanced/BluePrintSelectionSection';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
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
    isDynamicCustomPayloadValid,
    TagBasedPayloadConfigurator,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    websiteLabel
  } = props;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isSpecificJsErrorBlueprint = blueprintConfig.type === 'specificJsError';
  const isCustomEvent = blueprintConfig.type === 'customEvent';

  return (
    <AdvancedModeStepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          valid: !(
            (isCustomEvent && fieldTouchedAndInvalid(ruleForm?.get('customEventName'))) ||
            (isSpecificJsErrorBlueprint && fieldTouchedAndInvalid(ruleForm?.get('value')))
          ),
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
            !fieldTouchedAndInvalid(form.get('threshold')) ||
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
            !fieldTouchedAndInvalid(form.get('timeThreshold')?.get('users')) &&
            !fieldTouchedAndInvalid(form.get('timeThreshold')?.get('userPercentage')),
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
                  renderHeadline={() => (
                    <AlertPreviewHeadline title={form.get('name').value || getTitlePlaceholder(form)} />
                  )}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  entityLabel={websiteLabel}
                  entityIconType="lib_website"
                />
              )}
            />
          )
        },
        {
          scrollId: '7',
          label: t('in-alerting:smartAlerts.websites.advanced.payloadsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.payloadsTitle'),
          valid: isCustomPayloadValidOrUntouched(form) && isDynamicCustomPayloadValid,
          content: (
            <>
              <GlobalCustomPayloadCard context="WEBSITE" />

              <AlertConfigCustomPayload
                form={form}
                setForm={updateForm}
                TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
                supportDynamicTypes
              />
            </>
          )
        }
      ]}
    />
  );
}
