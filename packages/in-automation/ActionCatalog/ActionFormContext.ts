/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { ActionForm } from 'in-automation/ActionCatalog/useActionForm/types';

// Assuming ActionForm and Item are compatible or convertible
export interface FormContextContent {
  form: Item | ActionForm; // Allow flexibility if needed
  disabled?: boolean;
  rootPath: string[];
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>; // Match useActionForm
}

const ActionFormContext = React.createContext<FormContextContent | undefined>(undefined);

export default ActionFormContext;
