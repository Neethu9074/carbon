/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ValidationMessage, ValidationResult } from 'formalistic';

export function composeAndShortCircuitOnError<VALUE_TYPE>(...validators: ((v: VALUE_TYPE) => ValidationResult)[]) {
  return (value: VALUE_TYPE) => {
    const result: ValidationMessage[] = [];

    for (const validator of validators) {
      let errorSeen = false;
      const validationMessages = validator(value) || [];

      for (const validationMessage of validationMessages) {
        result.push(validationMessage);
        errorSeen = errorSeen || validationMessage.severity === 'error';
      }

      if (errorSeen) {
        return result;
      }
    }

    return result;
  };
}

export function anyOf<VALUE_TYPE>(...validators: ((v: VALUE_TYPE) => ValidationResult)[]) {
  return (value: VALUE_TYPE) => {
    const result: ValidationMessage[] = [];

    for (const validator of validators) {
      let errorSeen = false;
      const validationMessages = validator(value) || [];

      for (const validationMessage of validationMessages) {
        result.push(validationMessage);
        errorSeen = errorSeen || validationMessage.severity === 'error';
      }

      if (errorSeen) {
        return result;
      }
    }

    return result;
  };
}
