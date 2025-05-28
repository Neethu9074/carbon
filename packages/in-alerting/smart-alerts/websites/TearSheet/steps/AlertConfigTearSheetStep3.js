/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';
import { Spacer } from '@instana/components';

import ThresholdSelectionInteractiveSection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdSelectionInteractiveSection';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdConfigPresenter';
import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import {
  oneMinuteGranularityForStaticThresholdEnabled,
  alertChannelPerSeverityWebsiteSaEnabled
} from 'in-services/featureFlags';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import EvaluationGranularity from 'in-alerting/smart-alerts/components/tearSheet/EvaluationGranularity';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/tearSheet/ChartViewConfigurator';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/tearSheet/GracePeriodWrapper';
import toAlertConfigWithRules from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getTitleWidth } from 'in-alerting/smart-alerts/eum/data/utils';
import { days } from 'in-services/time/time';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

export default function AlertConfigTearSheetStep3({
  form,
  updateForm,
  editMode,
  onChartViewConfigChange,
  onChange,
  selectedChartViewConfigIndex,
  thresholdResult,
  blueprintConfig,
  isTagFilterFormModelValid,
  setStep
}) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const alertConfigWithFormModel = blueprintConfig.enrichWithDefaultThresholdValues(toAlertConfigWithRules(form));

  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;
  const thresholdType = isWarningDefined
    ? warningThresholdField.get('type').value
    : criticalThresholdField.get('type').value;

  const chartViewConfigs = isAdaptiveBaselineConfig(form.get('threshold').toJS().warningThreshold)
    ? [chartViewConfig24hours]
    : defaultChartViewConfigs;

  return (
    <>
      <div className={locals.container60_40}>
        <div className={locals.wrapper}>
          <TearSheetStepTitleWrapper
            headline={t('in-alerting:smartAlerts.websites.tearSheet.threshold.header')}
            description={t('in-alerting:smartAlerts.websites.tearSheet.threshold.description')}
          >
            {/* Threshold */}
            <ThresholdSelectionInteractiveSection
              form={form}
              eumType={websiteEum}
              alertType={alertType}
              updateForm={updateForm}
              editMode={editMode}
              onChartViewConfigChange={onChartViewConfigChange}
              blueprintConfig={blueprintConfig}
              isPercentageMetric={isPercentageMetric}
              getMetricUnitPostfix={getMetricUnitPostfix}
              thresholdType={thresholdType}
              thresholdResult={thresholdResult}
              AlertTypeSwitch={AlertTypeSwitch}
              isTagFilterFormModelValid={isTagFilterFormModelValid}
              setStep={setStep}
              alertChannelPerSeverityEnabled={alertChannelPerSeverityWebsiteSaEnabled}
            />
            <Spacer size="normal" />
            {/* Granularity Slider */}
            <EvaluationGranularity
              form={form}
              updateForm={updateForm}
              oneMinuteGranularityAllowed={
                thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
              }
              thresholdType={thresholdType}
              titleWidth={getTitleWidth()}
            />
          </TearSheetStepTitleWrapper>
        </div>
        <span className={locals.seperator} />
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.websites.tearSheet.timeThreshold.title')}
          description={t('in-alerting:smartAlerts.websites.tearSheet.timeThreshold.description')}
          hideSpace
        >
          <TimeThresholdConfigPresenter
            form={form}
            onChange={onChange}
            updateForm={updateForm}
            impactTimeThresholdDisabled={blueprintConfig.impactTimeThresholdDisabled}
            hasUserImpactOption
            oneMinuteGranularityAllowed={
              thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
            }
          />
          <Spacer size="gutter" />
          <GracePeriodWrapper form={form} updateForm={updateForm} />
        </TearSheetStepTitleWrapper>
      </div>
      <Spacer size="gutter" />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        chartViewConfigs={chartViewConfigs}
        headerTransparent
      >
        {chartViewConfig => (
          <WebsitesAlertingChartWithErrorMessage
            alertConfigWithFormModel={alertConfigWithFormModel}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </>
  );
}
