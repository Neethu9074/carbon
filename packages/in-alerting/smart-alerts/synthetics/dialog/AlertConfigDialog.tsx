/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { SyntheticAlertConfigWithMetadata } from 'in-types';
import { MessageType } from 'in-components/MessageStack';

interface AlertConfigDialogType {
  onClose: (config?: SyntheticAlertConfigWithMetadata) => void;
  alertConfig: SyntheticAlertConfigWithMetadata;
  editMode: boolean;
  startWithSimpleMode: boolean;
}

export default function AlertConfigDialog({
  onClose,
  alertConfig,
  editMode,
  startWithSimpleMode
}: AlertConfigDialogType) {
  const [form, setForm] = useState(() => alertFormDefinition(alertConfig, editMode));

  const [isSaving] = useState(false);
  const [messages] = useState<MessageType[]>([]);

  return (
    <AlertConfigDialogWithThreshold
      updateForm={(updateForm: MapForm) => {
        setForm(updateForm);
      }}
      form={form}
      onChange={createOnChange(setForm, form)}
      onCreate={() => {
        // LATER: store in backend
        onClose(/* Later: created new config */);
      }}
      onClose={() => {
        // canceled and dialog closed
        onClose();
      }}
      editMode={editMode}
      startWithSimpleMode={startWithSimpleMode}
      isSaving={isSaving}
      messages={messages}
    />
  );
}

function createOnChange(setForm: (form: MapForm) => void, externalForm: MapForm) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    setForm(externalForm.updateIn(path, updater));
  };
}
