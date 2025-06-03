/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ValidationMessage, ValidationResult } from 'formalistic';

import { recordTypeValidator } from 'in-synthetics/createTests/validators/dnsValidators';
import { AssertionTargetFilter } from 'in-synthetics/utils/constants';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

export function arrayNotEmptyValidator(arr?: ValidationMessage[]): ValidationResult {
  if (arr == null || arr.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.theValueMustNotBeEmpty')
      }
    ];
  }

  return null;
}

/**
 * Validates the syntax of an assertion filter.
 * @param selectedFilter - The assertion to be validated.
 * @param newValue - new input value for key/ operator/ value.
 * @param scenario - The scenario of the input change.
 * @param queryType - queryType value for dns test.
 * @param testType - type of the test.
 * @returns the updated assertion with it's selectedFilter.error field filled.
 */
export function assertionValidator(
  selectedFilter: AssertionTargetFilter,
  newValue: string,
  scenario: string,
  queryType: string,
  testType: string
): AssertionTargetFilter {
  const attributeName = scenario === 'key' ? newValue : selectedFilter.key;
  const operator = scenario === 'operator' ? newValue : selectedFilter.operator;
  const attributeValue = scenario === 'value' ? newValue : selectedFilter.value;

  const attributeNameNotBlank: ValidationResult = notBlankValidator(attributeName);
  const operatorNotBlank: ValidationResult = notBlankValidator(operator);
  const attributeValueNotBlank: ValidationResult = notBlankValidator(attributeValue);
  const attributeValueNotValid: ValidationResult = noSpaceValidator(testType, attributeValue);

  if (attributeNameNotBlank) {
    selectedFilter.error['key'] = { invalid: true, message: attributeNameNotBlank[0].message! };
  } else if (testType === 'DNS') {
    const recordTypeNotValid: ValidationResult = recordTypeValidator(queryType, selectedFilter);
    if (recordTypeNotValid) {
      selectedFilter.error['key'] = { invalid: true, message: recordTypeNotValid[0].message! };
    }
  } else {
    selectedFilter.error['key'] = { invalid: false, message: '' };
  }

  if (operatorNotBlank) {
    selectedFilter.error['operator'] = { invalid: true, message: operatorNotBlank[0].message! };
  } else {
    selectedFilter.error['operator'] = { invalid: false, message: '' };
  }

  if (attributeValueNotBlank) {
    selectedFilter.error['value'] = { invalid: true, message: attributeValueNotBlank[0].message! };
  } else if (attributeValueNotValid) {
    selectedFilter.error['value'] = { invalid: true, message: attributeValueNotValid[0].message! };
  } else {
    selectedFilter.error['value'] = { invalid: false, message: '' };
  }
  return selectedFilter;
}

/**
 * Validates the syntax of value field.
 * @Param testType - type of the test.
 * @param record - The value to be validated.
 * @returns An array of severity-message pairs if the resolution record contains spaces, otherwise return undefined.
 */
export function noSpaceValidator(testType: string, record?: string): ValidationResult {
  if (record != null && typeof record === 'string' && record.includes(' ')) {
    return [
      {
        severity: 'error',
        message:
          testType === 'DNS'
            ? t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidResolutionRecord')
            : t('in-synthetics:dialog.createTest.advancedMode.configStep.ssl.invalidAttributeValue')
      }
    ];
  }

  return undefined;
}
