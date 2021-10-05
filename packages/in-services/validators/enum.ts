/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';
import { ValidationResult } from 'formalistic';

type EnumValidator<ValueType> = (value: ValueType) => ValidationResult;

export function buildEnumValidator<T>(allowedValues: T[]): EnumValidator<T> {
  const sortedAllowedValues = allowedValues.slice().sort();

  return v => {
    // Do not check for required – deliberate triple eq check!
    if (v === undefined) {
      return;
    }

    if (allowedValues.indexOf(v) === -1) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueIsNotOneOfTheSupportedValuesExpectedOneOf', {
            v: v,
            allowedValues: sortedAllowedValues.join(', ')
          })
        }
      ];
    }

    return;
  };
}
