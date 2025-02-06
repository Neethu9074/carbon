/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult } from 'formalistic';
import mimeDb from 'mime-db';

import { ActionType } from '@instana/types';

import { MappedHeader } from 'in-automation/ActionCatalog/useActionForm/types';
import { positiveNumberValidator } from 'in-services/validators/number';
import { isNotBlank } from 'in-services/util/string';
import { ActionFilter } from 'in-automation/types';
import { t } from 'in-i18n';

export function mimeValidator(str: string): ValidationResult {
  if (isNotBlank(str) && !(str in mimeDb)) {
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.theValueMustBeValidMime')
      }
    ];
  }

  return null;
}

export function urlValidator(string: string): ValidationResult {
  try {
    new URL(string);
    return null;
  } catch (err) {
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.validUrl')
      }
    ];
  }
}

export function additionalHeadersValidator(additionalHeaders: MappedHeader[]): ValidationResult {
  const hasBlankAdditionalHeaders = additionalHeaders.reduce(
    (hasBlank, additionalHeader) => hasBlank || additionalHeader.value.includes(''),
    false
  );
  if (hasBlankAdditionalHeaders) {
    return [
      {
        severity: 'error',
        message: t('in-automation:theValueMustNotBeBlank')
      }
    ];
  }

  return null;
}

export function timeoutValidator(timeout: string): ValidationResult {
  if (timeout === '') return null;

  return positiveNumberValidator(timeout);
}

export function tagFilterExpressionValidator(tags: string[], actionFilter: 'all' | ActionFilter): ValidationResult {
  if (actionFilter === 'all' || actionFilter.tags.length === 0) return null;

  const hasRequiredTag = tags.some(tag => actionFilter.tags.includes(tag));
  if (!hasRequiredTag) {
    const formattedTags = actionFilter.tags.join(', ');
    return [
      {
        severity: 'error',
        message: t('in-automation:ActionCatalog.mustHaveRequiredTag', { tags: formattedTags })
      }
    ];
  }

  return null;
}

export function checkTypeBeforeValidating<VALUE_TYPE>(
  types: ActionType | ActionType[],
  currentType: ActionType,
  validator?: (value: VALUE_TYPE) => ValidationResult
) {
  if ((Array.isArray(types) && !types.includes(currentType)) || (!Array.isArray(types) && types !== currentType)) {
    return undefined;
  }
  return validator;
}
