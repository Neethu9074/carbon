/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createListForm } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { arrayValidator } from 'in-services/validators/jsonType';

export function createForm() {
  let listForm = createListForm({
    validator: composeAndShortCircuitOnError(arrayValidator, notUndefinedValidator),
    items: []
  });

  return listForm;
}
