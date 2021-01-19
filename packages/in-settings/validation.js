/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function combinedValidationResults(validationResult20) {
  if (!validationResult20.valid) {
    return { valid: false, error: 'Dynamic Focus query is not valid: ' + validationResult20.error };
  }
  return validationResult20;
}

export function valid() {
  return {
    valid: true,
    error: null
  };
}

export function queryValidationResultValidator(validationResult) {
  if (!validationResult.valid) {
    return [
      {
        severity: 'error',
        message: `Please define a valid query`
      }
    ];
  }
  return null;
}

export function queryValidationInProgressValidator(valiationInProgress) {
  if (valiationInProgress) {
    return [
      {
        severity: 'error',
        message: `Query validation still in progress`
      }
    ];
  }
  return null;
}
