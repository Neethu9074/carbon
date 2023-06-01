/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/mobileApp/form/alertDialogFormDefinition';
import { MobileAppAlertConfig, MobileAppAlertConfigWithMetadata } from 'in-types';
import { chartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';

interface AlertConfigDialogType {
  onClose: (config?: MobileAppAlertConfig) => void;
  startWithSimpleMode: boolean;
  alertConfig: MobileAppAlertConfigWithMetadata;
  editMode: boolean;
}

const initialChartConfigIndex = 0;

export default function AlertConfigDialog({
  onClose,
  alertConfig,
  editMode,
  startWithSimpleMode
}: AlertConfigDialogType) {
  const [selectedChartViewConfigIndex, setSelectedChartViewConfigIndex] = useState(initialChartConfigIndex);
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));

  const [isSaving] = useState(false);
  const [messages] = useState([]);

  return (
    <AlertConfigDialogWithThreshold
      updateForm={(updateForm: MapForm<any>) => {
        setForm(updateForm);
      }}
      form={form}
      onChange={createOnChange(setForm, form)}
      onChartViewConfigChange={setSelectedChartViewConfigIndex}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      timeConfig={chartViewConfigs[selectedChartViewConfigIndex].timeConfig}
      onCreate={() => ''}
      onClose={() => {
        // canceled and dialog closed
        onClose();
      }}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      granularity={form.get('granularity').value}
      isSaving={isSaving}
      messages={messages}
    />
  );
}

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    // @ts-expect-error ts cant determine nested fields of MapForm<any>
    setForm(externalForm.updateIn(path, updater));
  };
}
