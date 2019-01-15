import { twoZeroModeEnabled } from 'in-services/featureFlags';

export function combinedValidationResults(validationResult10, validationResult20) {
  if (twoZeroModeEnabled) {
    if (validationResult10.valid && !validationResult20.valid) {
      return { valid: false, error: 'Dynamic Focus query is deprecated: ' + validationResult20.error };
    } else if (!validationResult10.valid && !validationResult20.valid) {
      return { valid: false, error: 'Dynamic Focus query is not valid: ' + validationResult20.error };
    }
    return validationResult20;
  } else {
    if (validationResult20.valid) {
      return validationResult20;
    } else {
      if (validationResult10.valid) {
        return validationResult10;
      } else {
        return { valid: false, error: 'Dynamic Focus query is not valid: ' + validationResult10.error };
      }
    }
  }
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
