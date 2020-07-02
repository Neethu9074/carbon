import { createMapForm, createField, notBlankValidator } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createTagForm(tagCatalog, tagFormModel) {
  return createMapForm().put(
    'name',
    createField({
      value: tagFormModel?.name ?? '',
      validator: composeAndShortCircuitOnError(
        notUndefinedValidator,
        stringValidator,
        notBlankValidator,
        buildEnumValidator(tagCatalog.allTagNames)
      )
    })
  );
}
