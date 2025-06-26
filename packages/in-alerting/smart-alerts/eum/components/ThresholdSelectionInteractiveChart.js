/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';

import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import JsErrorsThresholdCondition from 'in-alerting/smart-alerts/websites/dialog/advanced/JsErrorsThresholdCondition';
import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/CustomEventsThresholdCondition';
import CrashThresholdCondition from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/CrashThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/eum/components/StatusCodeThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/eum/components/ThroughputThresholdCondition';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/eum/components/SlownessThresholdCondition';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import toAlertConfigWithRules from 'in-alerting/smart-alerts/eum/utils/thresholdChartUtil';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
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
  const alertConfigWithFormModel = blueprintConfig.enrichWithDefaultThresholdValues(toAlertConfigWithRules(form));
  const thresholdType = alertConfigWithFormModel.rules[0].thresholds.WARNING;
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
            ruleMetricNameOptions={ruleMetricNameOptions}
          />
        )}
        renderSlowness={() => (
          <SlownessThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
            eumType={eumType}
          />
        )}
        renderStatusCode={() => (
          <StatusCodeThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
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
        renderCrash={() =>
          eumType === mobileAppEum && (
            <CrashThresholdCondition
              form={form}
              blueprintConfig={blueprintConfig}
              updateForm={updateForm}
              editMode={editMode}
              getMetricUnitPostfix={getMetricUnitPostfix}
              isPercentageMetric={isPercentageMetric}
            />
          )
        }
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
            isMultiThresholdEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </BorderedContainer>
  );
}
