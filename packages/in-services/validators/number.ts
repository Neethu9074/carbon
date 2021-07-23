/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ValidationResult } from 'formalistic';

import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const failureMessage: ValidationResult = [
  {
    severity: 'error',
    message: t('in-services:validators.pleaseTypeInANumber')
  }
];

export function numericValidator(v: any): ValidationResult {
  if (!v) {
    return null;
  }

  if (typeof v === 'number') {
    return null;
  }

  if (typeof v === 'string') {
    if (isBlank(v)) {
      return null;
    }

    try {
      const num = Number(v);
      if (isNaN(num)) {
        return failureMessage;
      }
      return null;
    } catch (e) {
      return failureMessage;
    }
  }

  return failureMessage;
}

const positiveNumberFailureMessage: ValidationResult = [
  {
    severity: 'error',
    message: t('in-services:validators.pleaseTypeInAPositiveNumber')
  }
];

export function minValidator(minInclusive: number): ((v: any) => ValidationResult) {
  return (v: any) => {
    if (typeof v === 'number' && !isNaN(v) && v < minInclusive) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeLargerOrEqualToMinInclusive', { minInclusive: minInclusive })
        }
      ];
    }
    return undefined;
  };
}

export function maxValidator(maxInclusive: number): ((v: any) => ValidationResult) {
  return (v: any) => {
    if (typeof v === 'number' && !isNaN(v) && v > maxInclusive) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeSmallerOrEqualToMinInclusive', { maxInclusive: maxInclusive })
        }
      ];
    }
    return undefined;
  };
}

export function positiveNumberValidator(v: string | number): ValidationResult {
  try {
    const num = Number(v);
    if (isNaN(num) || num <= 0) {
      return positiveNumberFailureMessage;
    }
    return null;
  } catch (e) {
    return positiveNumberFailureMessage;
  }
}

export function notANumberValidator(v: any): ValidationResult {
  if (typeof v === 'number' && isNaN(v)) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theProvidedNumberIsInvalid')
      }
    ];
  }
  return undefined;
}
