/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import ThroughputThresholdCondition from 'in-alerting/smart-alerts/websites/TearSheet/ThresholdConditions/ThroughputThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/websites/TearSheet/ThresholdConditions/SlownessThresholdCondition';
import JsErrorsThresholdCondition from 'in-alerting/smart-alerts/websites/TearSheet/ThresholdConditions/JsErrorsThresholdCondition';
import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/CustomEventsThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/StatusCodeThresholdCondition';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';

export default function ThresholdSelectionInteractiveSection({
  form,
  updateForm,
  editMode,
  onChartViewConfigChange,
  alertType,
  blueprintConfig,
  eumType,
  isPercentageMetric,
  getMetricUnitPostfix
}) {
  return (
    <AlertTypeSwitch
      alertType={alertType}
      renderJsErrors={() => (
        <JsErrorsThresholdCondition form={form} blueprintConfig={blueprintConfig} updateForm={updateForm} />
      )}
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
      renderSlowness={() => (
        <SlownessThresholdCondition
          form={form}
          blueprintConfig={blueprintConfig}
          updateForm={updateForm}
          editMode={editMode}
          eumType={eumType}
          onChartViewConfigChange={onChartViewConfigChange}
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
          onChartViewConfigChange={onChartViewConfigChange}
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
          onChartViewConfigChange={onChartViewConfigChange}
        />
      )}
    />
  );
}
