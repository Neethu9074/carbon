/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationMessage, ValidationResult, createField, createMapForm } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { arrayValidator } from 'in-services/validators/jsonType';
import { t } from 'in-i18n';

const createNewLocationForm = (locationType: string) => {
  return createMapForm({ validator: notUndefinedValidator }).put(
    'syntheticDatacenters',
    createField({
      value: [],
      validator:
        locationType === 'managed'
          ? composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator, datacentersNotEmptyValidator)
          : composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
    })
  );
};

export default createNewLocationForm;

function datacentersNotEmptyValidator(arr?: ValidationMessage[]): ValidationResult {
  if (arr == null || arr.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createLocation.validators.theValueMustNotBeEmpty')
      }
    ];
  }

  return null;
}
