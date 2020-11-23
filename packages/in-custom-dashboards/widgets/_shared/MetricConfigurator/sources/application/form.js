import { createField } from 'formalistic';

import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { alwaysInvalidValidator } from 'in-services/validators/alwaysInvalid';
import { objectValidator } from 'in-services/validators/jsonType';

export function createForm(form, savedState) {
  form = form.put(
    'tagFilterExpression',
    createField({
      value: savedState?.tagFilterExpression || EMPTY_EXPRESSION,
      validator: composeAndShortCircuitOnError(objectValidator, objectValidator, markerValidator)
    })
  );

  // We temporarily place the old tagFilters structure into the form state. Upon the initial rendering,
  // the FormComponent will pick up this field and translate it to tagFilterExpression. Unfortunately,
  // the translation to the new format is an asynchronous operation. We therefore need to have this
  // temporary form field.
  if (savedState?.tagFilters) {
    form = form.put(
      'tagFilters',
      createField({
        value: savedState.tagFilters,
        validator: alwaysInvalidValidator('Please specify tag filters using the new tagFilterExpression format.')
      })
    );
  }

  return form;
}

export const invalidMarker = { invalid: true };

function markerValidator(value) {
  if (value.invalid) {
    return [{ severity: 'error' }];
  }
}
