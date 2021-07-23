/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { stringValidator } from 'in-services/validators/jsonType';

export function createForm(savedState) {
  return createField({
    value: savedState || '',
    validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
  });
}
