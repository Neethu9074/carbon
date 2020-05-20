import { createField, notBlankValidator } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { stringValidator } from 'in-services/validators/jsonType';

export function createForm(form, savedState) {
  return form.put(
    'sliConfig',
    createField({
      value: (savedState && savedState.sliConfig) || '',
      validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
    })
  );
}
