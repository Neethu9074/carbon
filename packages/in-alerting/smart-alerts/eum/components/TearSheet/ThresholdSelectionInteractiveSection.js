/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Stack } from '@instana/components';

import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/CustomEventsThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/ThroughputThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/StatusCodeThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/SlownessThresholdCondition';
import JsErrorsThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/JsErrorsThresholdCondition';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';

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
    <Stack direction="vertical" gap="small" align="start">
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
        renderSlowness={() =>
          eumType === websiteEum && (
            <SlownessThresholdCondition
              form={form}
              blueprintConfig={blueprintConfig}
              updateForm={updateForm}
              editMode={editMode}
              eumType={eumType}
              onChartViewConfigChange={onChartViewConfigChange}
              isPercentageMetric={isPercentageMetric}
            />
          )
        }
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
    </Stack>
  );
}
