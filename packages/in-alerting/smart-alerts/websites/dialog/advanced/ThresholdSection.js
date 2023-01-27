/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/websites/dialog/advanced/ThresholdSelectionInteractiveChart';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
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
    updateForm
  } = props;

  const thresholdType = form.get('threshold').get('type').value;

  return (
    <>
      <ThresholdSelectionInteractiveChart
        alertType={alertType}
        blueprintConfig={blueprintConfig}
        form={form}
        updateForm={updateForm}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        editMode={editMode}
      />
      {thresholdType === HISTORIC_BASELINE && <HistoricBaselineErrorMessage thresholdResult={thresholdResult} />}
    </>
  );
}
