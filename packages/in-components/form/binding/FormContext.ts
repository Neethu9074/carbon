/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Item } from 'formalistic';
import React from 'react';

export interface FormContextContent {
  form: Item;
  disabled: boolean;
}

export const FormContext = React.createContext<FormContextContent | undefined>(undefined);
