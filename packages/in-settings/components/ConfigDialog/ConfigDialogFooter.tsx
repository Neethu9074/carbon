/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';

export interface ConfigDialogFooterProps {
  form?: MapForm;
  onClickCancel: VoidFunction;
  onClickSave: (form?: MapForm) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  isSaving?: boolean;
}

export default function ConfigDialogFooter({
  form,
  onClickCancel,
  onClickSave,
  cancelButtonText,
  saveButtonText,
  isSaving
}: ConfigDialogFooterProps) {
  return (
    <FormFooter>
      <CancelButton onClick={() => onClickCancel()}>{cancelButtonText}</CancelButton>

      <SaveButton onClick={() => onClickSave(form)} isSaving={isSaving} disabled={isSaving}>
        {saveButtonText}
      </SaveButton>
    </FormFooter>
  );
}
