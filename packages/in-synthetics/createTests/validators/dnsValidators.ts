/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Address4, Address6 } from 'ip-address';
import { ValidationResult } from 'formalistic';

import { DNSFilterQueryTime } from '@instana/types';

import { getErrorMessage, numberValidator } from 'in-services/validators/jsonType';
import { AssertionTargetFilter } from 'in-synthetics/utils/constants';
import { notBlankValidator } from 'in-services/validators/string';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

/**
 * Validates the syntax of a domain name.
 * @param domain - The domain name to be validated.
 * @returns An array of severity-message pairs if the domain name is invalid, otherwise return undefined.
 */
export function lookupValidator(domain: string): ValidationResult {
  const regEx = /^(?![-.])((https?:\/\/)?([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,})(:\d+)?(\/.*)?$/;
  if (domain.length >= 256 || !regEx.test(domain)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSLookup')
      }
    ];
  }
  return undefined;
}

/**
 * Validates the syntax of an IPv4 address.
 * @param address - The address to be validated.
 * @returns An array of severity-message pairs if the address is invalid, otherwise return undefined.
 */
export function IPv4Validator(address: string): ValidationResult {
  const regEx_leading_zeros = /(\.0\d{1,2}|\.0{2,3})/;
  if (!Address4.isValid(address) || regEx_leading_zeros.test(address)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidIPv4Address')
      }
    ];
  }
  return undefined;
}

/**
 * Validates the syntax of an IPv6 address.
 * @param address - The address to be validated.
 * @returns An array of severity-message pairs if the address is invalid, otherwise return undefined.
 */
export function IPv6Validator(address: string): ValidationResult {
  if (!Address6.isValid(address)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidIPv6Address')
      }
    ];
  }
  return undefined;
}

/**
 * Validates the syntax of a DNS server.
 * @param server - The server to be validated.
 * @returns An array of severity-message pairs if the server isn't either a valid IP address or FQDN, otherwise return undefined.
 */
export function dnsServerValidator(server: string): ValidationResult {
  if (lookupValidator(server) && IPv4Validator(server) && IPv6Validator(server)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidDNSServer')
      }
    ];
  }
  return undefined;
}

/**
 * Validates the syntax of a DNS assertion.
 * @param selectedFilter - The assertion to be validated.
 * @param newValue - new input value for key/ operator/ value.
 * @param scenario - The scenario of the input change.
 * @returns the updated assertion with it's selectedFilter.error field filled.
 */
export function assertionValidator(
  selectedFilter: AssertionTargetFilter,
  newValue: string,
  queryType: string,
  scenario: string
): AssertionTargetFilter {
  const recordType = scenario === 'key' ? newValue : selectedFilter.key;
  const operator = scenario === 'operator' ? newValue : selectedFilter.operator;
  const recordResolution = scenario === 'value' ? newValue : selectedFilter.value;

  const recordTypeNotBlank: ValidationResult = notBlankValidator(recordType);
  const recordTypeNotValid: ValidationResult = recordTypeValidator(queryType, selectedFilter);
  const operatorNotBlank: ValidationResult = notBlankValidator(operator);
  const recordResolutionNotBlank: ValidationResult = notBlankValidator(recordResolution);

  const recordResolutionNotValid: ValidationResult = noSpaceValidator(recordResolution);

  if (recordTypeNotBlank) {
    selectedFilter.error['key'] = { invalid: true, message: recordTypeNotBlank[0].message! };
  } else if (recordTypeNotValid) {
    selectedFilter.error['key'] = { invalid: true, message: recordTypeNotValid[0].message! };
  } else {
    selectedFilter.error['key'] = { invalid: false, message: '' };
  }
  if (operatorNotBlank) {
    selectedFilter.error['operator'] = { invalid: true, message: operatorNotBlank[0].message! };
  } else {
    selectedFilter.error['operator'] = { invalid: false, message: '' };
  }
  if (recordResolutionNotBlank) {
    selectedFilter.error['value'] = { invalid: true, message: recordResolutionNotBlank[0].message! };
  } else if (recordResolutionNotValid) {
    selectedFilter.error['value'] = { invalid: true, message: recordResolutionNotValid[0].message! };
  } else {
    selectedFilter.error['value'] = { invalid: false, message: '' };
  }
  return selectedFilter;
}

/**
 * Validates the syntax of a resolution record.
 * @param responseTimeObj - The responseTime key-operator-value to be validated.
 * @returns An array of severity-message pairs if the value is blank or is not a number.
 */
export function responseTimeValidator(responseTimeObj: DNSFilterQueryTime): ValidationResult {
  const responseTimeNotBlank: ValidationResult = notBlankValidator(responseTimeObj.value);
  const responseTimeInvalid: ValidationResult = numberValidator(+responseTimeObj.value);
  if (responseTimeNotBlank) {
    return responseTimeNotBlank;
  } else if (responseTimeInvalid) {
    return [
      {
        severity: 'error',
        message: getErrorMessage('Number', 'String')
      }
    ];
  }
  return undefined;
}

/**
 * Validates the syntax of a resolution record.
 * @param record - The resolution record to be validated.
 * @returns An array of severity-message pairs if the resolution record contains spaces, otherwise return undefined.
 */
export function noSpaceValidator(record?: string): ValidationResult {
  if (record != null && typeof record === 'string' && record.includes(' ')) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidResolutionRecord')
      }
    ];
  }

  return undefined;
}

/**
 * Validates the value of a record type.
 * @param queryType - The selected query type of the test.
 * @param targetFilters - The selected target filters of the test.
 * @returns The updated target filter with targetFilter.error field of all invalid record types filled.
 */
export function checkQueryTypeAssertionMismatch(queryType: string, targetFilters: AssertionTargetFilter[]) {
  const updatedTargetFilter = targetFilters.map(targetFilter => {
    const recordTypeNotValid = recordTypeValidator(queryType, targetFilter);
    if (recordTypeNotValid) {
      targetFilter.error['key'] = {
        invalid: true,
        message: recordTypeNotValid[0].message!
      };
    } else {
      targetFilter.error['key'] = { invalid: false, message: '' };
    }
    return targetFilter;
  });
  return updatedTargetFilter;
}

/**
 * Validates the value of a record type.
 * @param queryType - The selected query type of the test.
 * @param targetFilter - The target filter which has to be validated.
 * @returns An array of severity-message pairs if the target filter and query type mismatches.
 */
function recordTypeValidator(queryType: string, targetFilter: AssertionTargetFilter): ValidationResult {
  if (
    isNotBlank(targetFilter.key) &&
    ((queryType === 'A' && targetFilter.key === 'AAAA') ||
      (queryType === 'AAAA' && targetFilter.key === 'A') ||
      (queryType === 'NS' && !['CNAME', 'NS'].includes(targetFilter.key)) ||
      (queryType === 'CNAME' && targetFilter.key !== 'CNAME'))
  ) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.dns.validators.invalidRecordType')
      }
    ];
  }
  return undefined;
}
