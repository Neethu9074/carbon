/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';
import { MapForm } from 'formalistic';

export type FieldPath = string[];

export type StepConfigs = {
  title: React.ReactNode;
  validateIntermediately?: FieldPath[];
}[];

/**
 * if any field, specified in the stepConfig, in validateIntermediately is invalid the result is true, else false.
 */
export function isStepInvalid(step: number, stepConfigs: StepConfigs, form: MapForm<any>): boolean {
  const fieldsToValidate = stepConfigs[step].validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return false;
  }

  function isFieldInvalid(fieldPath: FieldPath) {
    try {
      // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
      const field = form.getIn(fieldPath);
      if (field && !field.valid) {
        return true;
      }
    } catch (ignore) {
      // don't validate if field not present
    }

    return false;
  }

  return fieldsToValidate.some(isFieldInvalid);
}
