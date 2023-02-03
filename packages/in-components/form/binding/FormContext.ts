/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item } from 'formalistic';
import React from 'react';

export interface FormContextContent {
  form: Item;
  disabled?: boolean;
  rootPath: string[];
  setForm: (from: Item) => void;
}

export const FormContext = React.createContext<FormContextContent | undefined>(undefined);
