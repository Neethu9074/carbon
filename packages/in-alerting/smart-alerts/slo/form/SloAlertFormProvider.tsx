/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { PropsWithChildren, createContext } from 'react';
import { Item } from 'formalistic';

import {
  SloAlertForm,
  SloAlertFormPath,
  createSloAlertForm
} from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import { createNewAlertConfig } from 'in-alerting/smart-alerts/slo/data/sloAlertConfig';

export type CreateSloAlertDialogMode = 'NEW' | 'EDIT';
export type SloAlertFormOnChange = (path: SloAlertFormPath, updater: (i: Item) => Item) => void;
export interface SloAlertFormContext {
  form: SloAlertForm;
  mode: CreateSloAlertDialogMode;
  updateForm: (form: SloAlertForm) => void;
  onChange: SloAlertFormOnChange;
}

const defaultForm = createSloAlertForm(createNewAlertConfig());

const defaultContext: SloAlertFormContext = {
  form: defaultForm,
  mode: 'NEW',
  updateForm: _form => {},
  onChange: defaultForm.updateIn
};

export const sloAlertFormContext = createContext<SloAlertFormContext>(defaultContext);

export default function SloAlertFormProvider({
  children,
  form,
  mode,
  onChange,
  updateForm
}: PropsWithChildren<SloAlertFormContext>) {
  return (
    <sloAlertFormContext.Provider
      value={{
        form,
        mode,
        onChange,
        updateForm
      }}
    >
      {children}
    </sloAlertFormContext.Provider>
  );
}
