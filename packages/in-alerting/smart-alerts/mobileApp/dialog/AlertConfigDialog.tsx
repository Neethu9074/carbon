/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React, { useState } from 'react';

import AlertConfigDialogWithThreshold from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialogWithThreshold';
import alertFormDefinition from 'in-alerting/smart-alerts/mobileApp/form/alertDialogFormDefinition';
import { MobileAppAlertConfig } from 'in-types';

export interface DuplicateFrom {
  duplicateFrom?: string;
}
interface AlertConfigDialogType {
  onClose: (config?: MobileAppAlertConfig) => void;
  startWithSimpleMode: boolean;
}

export default function AlertConfigDialog({ onClose, startWithSimpleMode }: AlertConfigDialogType) {
  const [form, setForm] = useState(() => alertFormDefinition(false));
  return (
    <AlertConfigDialogWithThreshold
      updateForm={(updateForm: MapForm<any>) => {
        setForm(updateForm);
      }}
      form={form}
      onChange={createOnChange(setForm, form)}
      onCreate={() => ''}
      onClose={() => {
        // canceled and dialog closed
        onClose();
      }}
      editMode={false}
      startWithSimpleMode={startWithSimpleMode}
      isSaving={false}
      messages={[]}
    />
  );
}

function createOnChange(setForm: (form: MapForm<any>) => void, externalForm: MapForm<any>) {
  return function onChange(path: string[], updater: (item: Item) => Item): void {
    // @ts-expect-error ts cant determine nested fields of MapForm<any>
    setForm(externalForm.updateIn(path, updater));
  };
}
