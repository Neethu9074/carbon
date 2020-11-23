import { createField, notBlankValidator } from 'formalistic';
import { find } from 'lodash';

import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { stringValidator, objectValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { alwaysInvalidValidator } from 'in-services/validators/alwaysInvalid';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';
import { dataSourceTitles } from 'in-mobile-apps/tags';

export function createForm(form, savedState) {
  form = form
    .put(
      'tagFilterExpression',
      createField({
        value: savedState?.tagFilterExpression || EMPTY_EXPRESSION,
        validator: composeAndShortCircuitOnError(objectValidator, objectValidator, markerValidator)
      })
    )
    .put(
      'beaconType',
      createField({
        value:
          savedState?.beaconType || (savedState?.tagFilters && getBeaconType(savedState?.tagFilters)) || 'sessionStart',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(dataSourceTitles))
        )
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

export function getBeaconType(tagFilterArray) {
  const tagFilter = find(tagFilterArray, ({ name }) => name === 'mobileBeacon.type');
  if (tagFilter == null) {
    return '';
  }
  return tagFilter.stringValue;
}
