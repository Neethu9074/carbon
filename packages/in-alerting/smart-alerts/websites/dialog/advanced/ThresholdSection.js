/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/websites/dialog/advanced/ThresholdSelectionInteractiveChart';

export function ThresholdSection(props) {
  const {
    alertType,
    blueprintConfig,
    editMode,
    form,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    updateForm
  } = props;

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
    </>
  );
}
