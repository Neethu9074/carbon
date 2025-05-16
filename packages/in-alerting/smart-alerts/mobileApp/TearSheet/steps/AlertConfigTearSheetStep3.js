/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer } from '@instana/components';

import ThresholdSelectionInteractiveSection from 'in-alerting/smart-alerts/eum/components/TearSheet/ThresholdSelectionInteractiveSection';
import TimeThresholdConfigPresenter from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/TimeThresholdConfigPresenter';
import {
  oneMinuteGranularityForStaticThresholdEnabled,
  alertChannelPerSeverityMobileAppSaEnabled
} from 'in-services/featureFlags';
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import EvaluationGranularity from 'in-alerting/smart-alerts/components/tearSheet/EvaluationGranularity';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/tearSheet/ChartViewConfigurator';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/tearSheet/GracePeriodWrapper';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import toAlertConfigWithRules from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
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

  const chartViewConfigs = defaultChartViewConfigs;

  return (
    <>
      <div className={locals.container60_40}>
        <div className={locals.wrapper}>
          <TearSheetStepTitleWrapper
            headline={t('in-alerting:smartAlerts.mobileApp.tearSheet.threshold.header')}
            description={t('in-alerting:smartAlerts.mobileApp.tearSheet.threshold.description')}
          >
            {/* Threshold */}
            <ThresholdSelectionInteractiveSection
              form={form}
              eumType={mobileAppEum}
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
              alertChannelPerSeverityEnabled={alertChannelPerSeverityMobileAppSaEnabled}
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
            />
          </TearSheetStepTitleWrapper>
        </div>
        <span className={locals.seperator} />
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.mobileApp.tearSheet.timeThreshold.title')}
          description={t('in-alerting:smartAlerts.mobileApp.tearSheet.timeThreshold.description')}
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
          <MobileAppAlertingChartWithErrorMessage
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
