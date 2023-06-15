/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';

import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import JsErrorsThresholdCondition from 'in-alerting/smart-alerts/websites/dialog/advanced/JsErrorsThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/websites/dialog/advanced/SlownessThresholdCondition';
import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/CustomEventsThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/eum/components/StatusCodeThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/eum/components/ThroughputThresholdCondition';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import BorderedContainer from 'in-alerting/components/BorderedContainer';

export default function ThresholdSelectionInteractiveChart({
  alertType,
  blueprintConfig,
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  editMode,
  AlertingChartWithErrorMessage,
  eumType,
  getMetricUnitPostfix,
  isPercentageMetric,
  ruleMetricNameOptions,
  AlertTypeSwitch
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultThreshold(form);

  const thresholdType = alertConfigWithFormModel.threshold;
  const chartViewConfigs = isAdaptiveBaselineConfig(thresholdType) ? [chartViewConfig24hours] : defaultChartViewConfigs;

  if (!blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule)) {
    return (
      <BorderedContainer>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </BorderedContainer>
    );
  }

  return (
    <BorderedContainer>
      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() =>
          eumType === websiteEum && (
            <JsErrorsThresholdCondition form={form} blueprintConfig={blueprintConfig} updateForm={updateForm} />
          )
        }
        renderCustomEvent={() => (
          <CustomEventsThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
            eumType={eumType}
            isPercentageMetric={isPercentageMetric}
            getMetricUnitPostfix={getMetricUnitPostfix}
          />
        )}
        renderSlowness={() =>
          eumType === websiteEum && (
            <SlownessThresholdCondition
              form={form}
              blueprintConfig={blueprintConfig}
              updateForm={updateForm}
              editMode={editMode}
            />
          )
        }
        renderStatusCode={() => (
          <StatusCodeThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            eumType={eumType}
            isPercentageMetric={isPercentageMetric}
            getMetricUnitPostfix={getMetricUnitPostfix}
            ruleMetricNameOptions={ruleMetricNameOptions}
          />
        )}
        renderThroughput={() => (
          <ThroughputThresholdCondition
            form={form}
            updateForm={updateForm}
            blueprintConfig={blueprintConfig}
            editMode={editMode}
            eumType={eumType}
            ruleMetricNameOptions={ruleMetricNameOptions}
            getMetricUnitPostfix={getMetricUnitPostfix}
          />
        )}
      />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        chartViewConfigs={chartViewConfigs}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingChartWithErrorMessage
            alertConfigWithFormModel={alertConfigWithFormModel}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </BorderedContainer>
  );
}
