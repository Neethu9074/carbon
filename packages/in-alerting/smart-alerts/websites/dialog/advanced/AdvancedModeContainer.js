/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';

import { MultiThresholdAlertPreviewCommon } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon';
import StaticOrAdaptiveSwitch from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import {
  isCustomPayloadValidOrUntouched,
  fieldTouchedAndInvalid
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/eum/components/ThresholdSelectionInteractiveChart';
import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { HISTORIC_BASELINE, ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/eum/components/AlertTagFilterExpressionConfig';
import BluePrintSelectionSection from 'in-alerting/smart-alerts/websites/dialog/advanced/BluePrintSelectionSection';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import AdaptiveBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/AdaptiveBaselineErrorMessage';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import TimeThresholdConfig from 'in-alerting/smart-alerts/websites/dialog/advanced/TimeThresholdConfig';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/dialog/advanced/GracePeriodWrapper';
import { useOnThresholdTypeChange } from 'in-alerting/smart-alerts/eum/hooks/useOnThresholdTypeChange';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { severityPlaceholderList } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import websiteCreateRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { alertChannelPerSeverityWebsiteSaEnabled } from 'in-services/featureFlags';
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
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;
  const isCriticalDefined = criticalThresholdField.get('isCheckboxSelected').value;
  const thresholdType = isWarningDefined
    ? warningThresholdField.get('type').value
    : criticalThresholdField.get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);
  const ruleComplete = blueprintConfig?.isRuleComplete(ruleForm.toJS());
  const isSpecificJsErrorBlueprint = blueprintConfig.type === 'specificJsError';
  const isCustomEvent = blueprintConfig.type === 'customEvent';
  const websiteOnThresholdTypeChange = useOnThresholdTypeChange(websiteCreateRuleForm);
  const resetChartConfigSelectionWhenAdaptiveBaseline = updatedForm => {
    if (isAdaptiveBaselineConfig(updatedForm.get('threshold').toJS())) {
      onChartViewConfigChange(0);
    }
    return updateForm(updatedForm);
  };

  const name = form.get('name').value;
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
                    onThresholdTypeChange={websiteOnThresholdTypeChange}
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
              label={websiteLabel}
              iconType="lib_website"
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
              <ThresholdSelectionInteractiveChart
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
                AlertingChartWithErrorMessage={WebsitesAlertingChartWithErrorMessage}
                eumType={websiteEum}
                isPercentageMetric={isPercentageMetric}
                getMetricUnitPostfix={getMetricUnitPostfix}
                ruleMetricNameOptions={ruleMetricNameOptions}
                AlertTypeSwitch={AlertTypeSwitch}
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
            <>
              <TimeThresholdConfig
                form={form}
                onChange={onChange}
                updateForm={updateForm}
                impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
                hasUserImpactOption
                oneMinuteGranularityAllowed={thresholdType === STATIC_THRESHOLD}
              />
              <GracePeriodWrapper form={form} updateForm={updateForm} />
            </>
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.websites.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.alertChannelsTitle'),
          valid: true,
          content: (
            <>
              {alertChannelPerSeverityWebsiteSaEnabled ? (
                <ConfigureAlertChannelMT
                  form={form}
                  onChange={onChange}
                  updateForm={updateForm}
                  setSliderState={setSliderState}
                  setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                  numberOfAlertChannelListRows={5}
                />
              ) : (
                <ConfigureAlertChannel
                  form={form}
                  onChange={onChange}
                  setSliderState={setSliderState}
                  setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                  numberOfAlertChannelListRows={5}
                />
              )}
            </>
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
                  shouldDisplayAlertLevelSelection={false}
                  renderAlertPropertiesTitleRow={() => (
                    <AlertPropertiesTitleRow
                      form={form}
                      onChange={onChange}
                      getTitlePlaceholder={getTitlePlaceholder}
                      placeholders={severityPlaceholderList}
                    />
                  )}
                />
              )}
              renderAlertPreview={() => (
                <MultiThresholdAlertPreviewCommon
                  form={form}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  isWarningDefined={isWarningDefined}
                  isCriticalDefined={isCriticalDefined}
                  entityLabel={websiteLabel}
                  entityIconType="lib_website"
                  renderHeadline={() => (
                    <AlertPreviewHeadline
                      title={
                        name
                          ? replacePlaceholdersWithMarkup(severityPlaceholderList, name, ({ name }) => name)
                          : getTitlePlaceholder(form)
                      }
                    />
                  )}
                  isTearSheet={false}
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
