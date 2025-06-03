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
export function recordTypeValidator(queryType: string, targetFilter: AssertionTargetFilter): ValidationResult {
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
