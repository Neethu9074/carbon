/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

//@ts-expect-error TS migration
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/mobileApp/dialog/advanced/ThresholdSelectionInteractiveChart';
import { BluePrint, MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';

interface ThresholdSectionProps {
  alertType: MobileAlertType;
  blueprintConfig: BluePrint;
  editMode?: boolean;
  form: MapForm<any>;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
  updateForm?: (form: MapForm<any>) => void;
}

export function ThresholdSection(props: ThresholdSectionProps) {
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
