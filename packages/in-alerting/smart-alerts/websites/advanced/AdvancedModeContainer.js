/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';

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
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import {
  isCustomPayloadValidOrUntouched,
  fieldTouchedAndInvalid
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/AdaptiveBaselineErrorMessage';
import AlertProperties from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/websites/components/AlertTagFilterExpressionConfig';
import WebsiteAlertPropertiesTitleRow from 'in-alerting/smart-alerts/websites/advanced/WebsiteAlertPropertiesTitleRow';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/smart-alert-dialog/ConfigureAlertChannel';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/websites/advanced/BluePrintSelectionSection';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import TimeThresholdConfig from 'in-alerting/smart-alerts/websites/advanced/TimeThresholdConfig';
import { onThresholdTypeChange } from 'in-alerting/smart-alerts/websites/form/thresholdTypeForm';
import { ThresholdSection } from 'in-alerting/smart-alerts/websites/advanced/ThresholdSection';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import StepsContainer from 'in-components/StepsContainer';
import { t } from 'in-i18n';

export default function AdvancedModeContainer(props) {
  const {
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    form,
    timeConfig,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    updateForm,
    thresholdResult,
    messages,
    editMode,
    QueryBuilderComponent,
    isTagFilterFormModelValid,
    TagBasedPayloadConfigurator,
    isDynamicCustomPayloadValid,
    websiteLabel
  } = props;
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const thresholdType = form.get('threshold').get('type').value;

  const blueprintConfig = getBlueprintConfig(alertType);
  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());

  const isSpecificJsErrorBlueprint = blueprintConfig.type === 'specificJsError';
  const isCustomEvent = blueprintConfig.type === 'customEvent';

  const resetChartConfigSelectionWhenAdaptiveBaseline = updatedForm => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

  return (
    <StepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.websites.advanced.triggerLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.triggerTitle'),
          valid: !(
            (isCustomEvent && fieldTouchedAndInvalid(ruleForm?.get('customEventName'))) ||
            (isSpecificJsErrorBlueprint && fieldTouchedAndInvalid(ruleForm?.get('value')))
          ),
          content: (
            <>
              <BluePrintSelectionSection
                alertType={alertType}
                form={form}
                updateForm={updateForm}
                setSliderState={setSliderState}
              />
              {blueprintConfig?.baselineEnabled && (
                <LightCard
                  title={t(
                    'in-alerting:smartAlerts.applications.advanced.advancedModeContainer.threshold.staticOrAdaptiveTitle'
                  )}
                  withoutPadding
                  darkFrame
                >
                  <StaticOrAdaptiveSwitch
                    form={form}
                    setForm={resetChartConfigSelectionWhenAdaptiveBaseline}
                    onThresholdTypeChange={onThresholdTypeChange}
                  />
                </LightCard>
              )}
            </>
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
              QueryBuilderComponent={QueryBuilderComponent}
              websiteLabel={websiteLabel}
            />
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.websites.advanced.thresholdLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.thresholdTitle'),
          valid: isThresholdSectionValid(),
          content: (
            <>
              <ThresholdSection
                alertType={alertType}
                blueprintConfig={blueprintConfig}
                editMode={editMode}
                form={form}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                updateForm={updateForm}
                ruleComplete={ruleComplete}
                thresholdResult={thresholdResult}
                timeConfig={timeConfig}
                websiteLabel={websiteLabel}
              />
              {thresholdType === HISTORIC_BASELINE && (
                <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />
              )}
              {thresholdType === ADAPTIVE_BASELINE && (
                <AdaptiveBaselineErrorMessage thresholdResult={thresholdResult} />
              )}
            </>
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

  function isThresholdSectionValid() {
    // LATER: check correctness: on AP it checks the value - touched state
    if (fieldTouchedAndInvalid(form.get('threshold'))) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && !isTagFilterFormModelValid) {
      return false;
    }
    if (!ruleComplete) {
      return false;
    }
    if (thresholdType === HISTORIC_BASELINE && thresholdResult?.errors?.length > 0) {
      return false;
    }

    return !(thresholdType === ADAPTIVE_BASELINE && thresholdResult?.data?.message);
  }
}
