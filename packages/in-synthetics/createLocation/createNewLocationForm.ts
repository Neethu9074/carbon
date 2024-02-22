/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import { datacentersNotEmptyValidator } from 'in-synthetics/createLocation/validators/datacentersnotEmptyValidator';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { arrayValidator } from 'in-services/validators/jsonType';

const createNewLocationForm = (locationType: string) => {
  return createMapForm({ validator: notUndefinedValidator })
    .put(
      'id',
      createField({
        value: generateUniqueShortId()
      })
    )
    .put(
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
