/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { ConfigItem } from 'in-synthetics/utils/constants';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function statusCodeValidator(code: string): ValidationResult {
  const regExp =
    /(\b10[0-3]\b)|(\b2(0[0-8]|26)\b)|(\b30[0-8]\b)|(\b4(0[0-9]|1[0-8]|2[1-689]|31|44|51|99)\b)|(\b5(0[0-8]|1[0-1]|99)\b)/;
  if (code.length !== 0 && !regExp.test(code)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.mustBeValidHttpReturnCode')
      }
    ];
  }
  return undefined;
}

export function regExpValidator(pattern: string): ValidationResult {
  try {
    if (pattern !== '') {
      new RegExp(pattern);
    }
  } catch (e) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.shouldBeValidRegExp')
      }
    ];
  }
  return undefined;
}

export function requestHeaderNameValidator(headerName: string): ValidationResult {
  const regExp = /^[ A-Za-z0-9_@./#&+-]*$/;
  if (headerName && !regExp.test(headerName)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.shouldBeValidHeaderName')
      }
    ];
  }
  return undefined;
}
export function requestHeaderValueValidator(headerValue: string): ValidationResult {
  const regExp = /^[ A-Za-z0-9_ :;.,/\\"'?!(){}[\]@<>=\-+*#$&`|~^%]*$/;
  if (headerValue && !regExp.test(headerValue)) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.shouldBeValidHeaderValue')
      }
    ];
  }
  return undefined;
}

export function onlyUniqueKeyNames(items: ConfigItem[], category: string): ValidationResult {
  const keys = items.map(i => i.key).filter(isNotBlank);
  const keySet = new Set(keys);
  if (keys.length > keySet.size) {
    return [
      {
        severity: 'error',
        message: category === 'headers' 
                ? t('in-synthetics:dialog.createTest.advancedMode.configStep.headerNameMustBeUnique')
                : t('in-synthetics:dialog.createTest.advancedMode.customProperties.propertyNameMustBeUnique')
      }
    ];
  }
  return undefined;
}
