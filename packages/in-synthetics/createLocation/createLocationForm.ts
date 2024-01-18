/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

const createNewLocationForm = () => {
  return createMapForm({ validator: notUndefinedValidator }).put(
    'location',
    createField({
      value: '',
      validator: composeAndShortCircuitOnError(notUndefinedValidator)
    })
  );
};

export default createNewLocationForm;
