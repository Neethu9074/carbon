/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import PropTypes from 'prop-types';
import React from 'react';

import { isAdaptiveBaselineConfig } from '@instana/types';

import {
  chartViewConfig24hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/CustomEventsThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/eum/components/StatusCodeThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/eum/components/ThroughputThresholdCondition';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { isPercentageMetric, getMetricUnitPostfix } from 'in-alerting/smart-alerts/mobileApp/form/formUtils';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import AlertTypeSwitch from 'in-alerting/smart-alerts/mobileApp/components/AlertTypeSwitch';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import BorderedContainer from 'in-alerting/components/BorderedContainer';

export default function ThresholdSelectionInteractiveChart({
  alertType,
  blueprintConfig,
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  editMode
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
        renderCustomEvent={() => (
          <CustomEventsThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
            eumType={mobileAppEum}
            isPercentageMetric={isPercentageMetric}
            getMetricUnitPostfix={getMetricUnitPostfix}
          />
        )}
        renderStatusCode={() => (
          <StatusCodeThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            eumType={mobileAppEum}
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
            eumType={mobileAppEum}
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
          <MobileAppAlertingChartWithErrorMessage
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

ThresholdSelectionInteractiveChart.propTypes = {
  alertType: PropTypes.string.isRequired,
  blueprintConfig: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
