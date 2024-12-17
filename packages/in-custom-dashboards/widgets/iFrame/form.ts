/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm, createField, createMapForm, ValidationResult } from 'formalistic';

export type IFrameWidgetForm = MapForm<{ iframe: Field<string> }>;

export const potentialProblemsCategory = 'PotentialProblemsError';

export function createForm(): IFrameWidgetForm {
  return createMapForm({
    items: {
      iframe: createField({
        validator: urlValidator,
        value: ''
      })
    }
  });
}

function urlValidator(url: string): ValidationResult {
  const regexString = '^https?:\\/\\/[\\w.-]+(\\/[\\w.-]*)*(\\/)?(\\?[\\w.-]+=[\\w.-]+(&[\\w.-]+=[\\w.-]+)*)?$'; // using string for handling no-useless-escape eslint error.
  const regex = new RegExp(regexString);
  return regex.test(url) // return true if url is valid.
    ? null
    : [
        {
          severity: 'error',
          message: 'Please enter a valid URL.'
        }
      ];
}
