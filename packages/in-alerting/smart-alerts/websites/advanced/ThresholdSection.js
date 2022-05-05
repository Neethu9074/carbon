/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/smart-alert-dialog/HistoricBaselineErrorMessage';
import CustomEventsInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/CustomEventsInteractiveChart';
import StatusCodeInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/StatusCodeInteractiveChart';
import ThroughputInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/ThroughputInteractiveChart';
import JsErrorsInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/JsErrorsInteractiveChart';
import SlownessInteractiveChart from 'in-alerting/smart-alerts/websites/advanced/SlownessInteractiveChart';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

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

  const thresholdType = form.get('threshold').get('type').value;

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
            updateForm={updateForm}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          />
        )}
        renderSlowness={() => (
          <SlownessInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
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
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          />
        )}
        renderThroughput={() => (
          <ThroughputInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
            updateForm={updateForm}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
            editMode={editMode}
          />
        )}
        renderCustomEvent={() => (
          <CustomEventsInteractiveChart
            blueprintConfig={blueprintConfig}
            form={form}
            updateForm={updateForm}
            onChartViewConfigChange={onChartViewConfigChange}
            selectedChartViewConfigIndex={selectedChartViewConfigIndex}
          />
        )}
      />
      {thresholdType === HISTORIC_BASELINE && <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />}
    </>
  );
}
