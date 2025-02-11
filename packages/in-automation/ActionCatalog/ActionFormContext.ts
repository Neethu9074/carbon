/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item } from 'formalistic';
import React from 'react';

import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';

export interface FormContextContent {
  form: Item | ActionForm;
  disabled?: boolean;
  rootPath: string[];
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}

const ActionFormContext = React.createContext<FormContextContent | undefined>(undefined);

export default ActionFormContext;
