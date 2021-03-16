/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const failureMessage = [
  {
    severity: 'error',
    message: t('in-services:validators.pleaseTypeInANumber')
  }
];

export function numericValidator(v) {
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

const positiveNumberFailureMessage = [
  {
    severity: 'error',
    message: t('in-services:validators.pleaseTypeInAPositiveNumber')
  }
];

export function minValidator(minInclusive) {
  return v => {
    if (typeof v === 'number' && !isNaN(v) && v < minInclusive) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeLargerOrEqualToMinInclusive', { minInclusive: minInclusive })
        }
      ];
    }
  };
}

export function maxValidator(maxInclusive) {
  return v => {
    if (typeof v === 'number' && !isNaN(v) && v > maxInclusive) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeSmallerOrEqualToMinInclusive', { maxInclusive: maxInclusive })
        }
      ];
    }
  };
}

export function positiveNumberValidator(v) {
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

export function notANumberValidator(v) {
  if (typeof v === 'number' && isNaN(v)) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theProvidedNumberIsInvalid')
      }
    ];
  }
}
