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
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import EvaluationGranularity from 'in-alerting/smart-alerts/components/tearSheet/EvaluationGranularity';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/tearSheet/ChartViewConfigurator';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/tearSheet/GracePeriodWrapper';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import toAlertConfigWithRules from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t } from 'in-i18n';

import locals from './AlertConfigTearSheetStep3.mless';

export default function AlertConfigTearSheetStep3({
  form,
  updateForm,
  editMode,
  onChartViewConfigChange,
  onChange,
  selectedChartViewConfigIndex
}) {
  const ruleForm = form.get('rule');
  const alertType = ruleForm.get('alertType').value;
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;

  const thresholdType = isWarningDefined
    ? warningThresholdField.get('type').value
    : criticalThresholdField.get('type').value;
  const blueprintConfig = getBlueprintConfig(alertType);

  const chartViewConfigs = isAdaptiveBaselineConfig(thresholdType) ? [chartViewConfig24hours] : defaultChartViewConfigs;

  const alertConfigWithFormModel = toAlertConfigWithRules(form);

  return (
    <>
      <div className={locals.container60_40}>
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
            hasTraceImpactOption
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
