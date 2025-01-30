/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item } from 'formalistic';
import React from 'react';

import { ParameterForm } from 'in-automation/ActionCatalog/useParameterForm';

export interface FormContextContent {
  form: ParameterForm | Item;
  setForm: React.Dispatch<React.SetStateAction<ParameterForm>>;
  disabled?: boolean;
  rootPath: string[];
}

const ParameterFormContext = React.createContext<FormContextContent | undefined>(undefined);

export default ParameterFormContext;
