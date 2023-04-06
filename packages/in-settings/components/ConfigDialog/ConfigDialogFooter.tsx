/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import FormFooter, { CancelButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';

export interface ConfigDialogFooterProps<FORM_TYPE extends MapFormItems> {
  form?: MapForm<FORM_TYPE>;
  onClickCancel: VoidFunction;
  onClickSave: (form?: MapForm<FORM_TYPE>) => void;
  saveButtonText?: string;
  cancelButtonText?: string;
  isSaving?: boolean;
  disabledSaveButton?: boolean;
}

export default function ConfigDialogFooter<FORM_TYPE extends MapFormItems>({
  form,
  onClickCancel,
  onClickSave,
  cancelButtonText,
  saveButtonText,
  isSaving,
  disabledSaveButton
}: ConfigDialogFooterProps<FORM_TYPE>) {
  return (
    <FormFooter>
      <CancelButton onClick={() => onClickCancel()}>{cancelButtonText}</CancelButton>

      <SaveButton onClick={() => onClickSave(form)} isSaving={isSaving} disabled={disabledSaveButton}>
        {saveButtonText}
      </SaveButton>
    </FormFooter>
  );
}
