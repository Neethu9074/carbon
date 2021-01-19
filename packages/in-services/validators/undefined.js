/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function notUndefinedValidator(v) {
  if (v === undefined) {
    return [
      {
        severity: 'error',
        message: `The value must not be undefined.`
      }
    ];
  }
}
