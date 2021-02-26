/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

export function combinedValidationResults(validationResult20) {
  if (!validationResult20.valid) {
    return {
      valid: false,
      error: t('in-settings:terms.dynamicFocusQueryIsNotValid', { err: validationResult20.error })
    };
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
        message: t('in-settings:pleaseDefineAValidQuery')
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
        message: t('in-settings:queryValidationStillInProgress')
      }
    ];
  }
  return null;
}
