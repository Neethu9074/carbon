/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { notANumberValidator } from 'in-services/validators/number';
import { t } from 'in-i18n';

// These validators can be used for features such as "Edit as JSON"
// to validate that specific types be used.

export const objectValidator = createPrototypeCheck([Object.prototype]);
export const arrayValidator = createPrototypeCheck([Array.prototype]);
export const booleanValidator = createPrototypeCheck([Boolean.prototype]);
export const stringValidator = createPrototypeCheck([String.prototype]);
export const numberValidator = createPrototypeCheck([Number.prototype], notANumberValidator);
export const jsonPrimitiveValidator = createPrototypeCheck(
  [String.prototype, Boolean.prototype, Number.prototype],
  notANumberValidator
);

function createPrototypeCheck(expectedPrototypes, validateTypeDetails) {
  const expectedPrototypesLabel = expectedPrototypes
    .map(p => p.constructor?.name)
    .filter(Boolean)
    .join('|');

  return v => {
    // Do not check for required – deliberate triple eq check!
    if (v === undefined) {
      return;
    }

    // null does not have a prototype, i.e. we have to treat it in a special way.
    if (v === null) {
      return [
        {
          severity: 'error',
          message: getErrorMessage(expectedPrototypesLabel, 'null')
        }
      ];
    }

    const actualPrototype = Object.getPrototypeOf(v);
    for (const expectedPrototype of expectedPrototypes) {
      if (actualPrototype === expectedPrototype) {
        if (validateTypeDetails) {
          return validateTypeDetails(v);
        }
        return;
      }
    }

    const actualPrototypeLabel = actualPrototype.constructor?.name;
    return [
      {
        severity: 'error',
        message: getErrorMessage(expectedPrototypesLabel, actualPrototypeLabel)
      }
    ];
  };
}

// Exposed for testing purposes
export function getErrorMessage(expectedType, actualType) {
  const message = t('in-services:validators.aValueOfTypeExpectedTypeIsRequired', { expectedType: expectedType });
  if (!actualType) {
    return message;
  }
  return t('in-services:validators.msgGotActualType', { msg: message, actualType: actualType });
}
