/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/HistoricBaselineErrorMessage';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/ThroughputInteractiveChart';
import JsErrorsInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/JsErrorsInteractiveChart';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/SlownessInteractiveChart';
import { isHistoricBaseline } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';

export function ThresholdSection(props) {
  const {
    alertType,
    blueprintConfig,
    editMode,
    form,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    thresholdResult,
    timeConfig,
    updateForm
  } = props;

  return (
    <>
      <AlertTypeSwitch
        form={form}
        timeConfig={timeConfig}
        updateForm={updateForm}
        alertType={alertType}
        renderJsErrors={() => (
          <JsErrorsInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
            timeConfig={timeConfig}
            updateForm={updateForm}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            editMode={editMode}
          />
        )}
        renderSlowness={() => (
          <SlownessInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
            timeConfig={timeConfig}
            updateForm={updateForm}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            editMode={editMode}
          />
        )}
        renderStatusCode={() => (
          <StatusCodeInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
            updateForm={updateForm}
            timeConfig={timeConfig}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            editMode={editMode}
          />
        )}
        renderThroughput={() => (
          <ThroughputInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
            timeConfig={timeConfig}
            updateForm={updateForm}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            editMode={editMode}
          />
        )}
      />
      {isHistoricBaseline(form.get('threshold').get('type').value) && (
        <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />
      )}
    </>
  );
}
