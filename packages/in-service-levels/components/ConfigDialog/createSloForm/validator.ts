/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { ServiceLevelIndicatorType } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import {
  CustomBlueprintType,
  SloIndicatorFields,
  SloTimeWindowFields
} from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { maxValidator, minValidator, numericValidator, positiveNumberValidator } from 'in-services/validators/number';
import { isEmptyExpression, toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

export const inputNotUndefinedValidator = (v: any): ValidationResult => {
  if (v === undefined) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeBlank')
      }
    ];
  }
  return undefined;
};

export function validateTimeWindow(timeWindow: SloTimeWindowFields): ValidationResult {
  const { duration, durationUnit } = timeWindow;

  if (duration === undefined || !durationUnit) return;

  if (duration.value < 1) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorTimeWindowMin')
      }
    ];
  }

  if (durationUnit.value === 'day' && duration.value > 31) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorTimeWindowDay')
      }
    ];
  }

  if (durationUnit.value === 'week' && duration.value > 4) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorTimeWindowWeek')
      }
    ];
  }

  return;
}

type ThresholdFieldValidator = (value: number | undefined) => ValidationResult;
const commonThresholdValidator = composeAndShortCircuitOnError(inputNotUndefinedValidator, numericValidator);
export function createThresholdFieldValidator(
  blueprint: CustomBlueprintType,
  type?: ServiceLevelIndicatorType
): ThresholdFieldValidator | undefined {
  if (!blueprint) return undefined;

  switch (blueprint) {
    case 'custom':
      return undefined;
    case 'latency':
      return composeAndShortCircuitOnError(commonThresholdValidator, minValidator(1));
    case 'availability':
      if (type === 'eventBased') return undefined;
      return composeAndShortCircuitOnError(commonThresholdValidator, positiveNumberValidator, maxValidator(100));
    case 'traffic':
      throw new Error('Missing traffic case in createThresholdFieldValidator.');
  }
}

export const targetFieldValidator = composeAndShortCircuitOnError(inputNotUndefinedValidator);
export const timeFieldValidator = composeAndShortCircuitOnError(timeValidator, notBlankValidator);
export const dateFieldValidator = composeAndShortCircuitOnError(notBlankValidator, dateValidator);
export const indicatorFormValidator = composeAndShortCircuitOnError(
  noEmptyCustomGoodFilterExpressions,
  noEqualCustomTagFilterExpressions
);
export const timeWindowValidator = composeAndShortCircuitOnError(validateTimeWindow);

export function noInvalidTagFilterExpression(tagFilterExpression: FormModelElement[]): ValidationResult {
  try {
    // The tag filter parser will raise an exception in cases the provided filters are invalid or incomplete.
    toBackendQueryModel(tagFilterExpression);
  } catch {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorInvalidExpression')
      }
    ];
  }
  return undefined;
}

export function noBlankEntitySelection(entityIds: string[]): ValidationResult {
  if (entityIds && entityIds.length > 0) return;

  return [
    {
      severity: 'error',
      message: t('in-service-levels:createSloDialog.errorBlankEntity')
    }
  ];
}

export function noEmptyCustomGoodFilterExpressions(form: SloIndicatorFields): ValidationResult {
  const isCustomBlueprint = form.blueprint.value === 'custom';
  const isEmptyGoodEventsFilter = isEmptyExpression(toBackendQueryModel(form.goodEventsFilter.value));

  if (isCustomBlueprint && isEmptyGoodEventsFilter)
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorEmptyGoodFilter')
      }
    ];

  return undefined;
}

export function noEqualCustomTagFilterExpressions(form: SloIndicatorFields): ValidationResult {
  const isCustomBlueprint = form.blueprint.value === 'custom';
  const badEventsFilter = generateStableHash(form.badEventsFilter.value);
  const goodEventsFilter = generateStableHash(form.goodEventsFilter.value);

  if (isCustomBlueprint && badEventsFilter === goodEventsFilter)
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorEqualTagFilter')
      }
    ];

  return undefined;
}
