/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createMapForm, createField } from 'formalistic';

import { createForm as createConfigurationForm } from 'in-custom-dashboards/widgets/Table/eventsTable/form';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';

interface TableConfiguration {
  source?: string;
  childConfiguration: any;
}
export function createForm(savedState: TableConfiguration) {
  return createMapForm()
    .put(
      'source',
      createField({
        value: savedState?.source ?? '',
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    )
    .put('childConfiguration', createConfigurationForm(savedState && savedState.childConfiguration));
}
