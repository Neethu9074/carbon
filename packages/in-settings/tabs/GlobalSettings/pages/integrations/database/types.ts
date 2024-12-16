/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, MapPath } from 'formalistic';

export type Variant = 'success' | 'error';

export interface Integration {
  path: string;
  type: string;
  label: string;
  url?: string;
  enabled?: boolean;
}

// form fields
export type IntegrationFormFields = {
  path: Field<string>;
  type: Field<string>;
  label: Field<string>;
  url: Field<string>;
  enabled: Field<boolean>;
};

export type IntegrationForm = MapForm<IntegrationFormFields>;
export type IntegrationFormPath = MapPath<IntegrationFormFields>;
