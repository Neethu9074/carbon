import { createMapForm, createField, notBlankValidator } from 'formalistic';

import { stringValidator, jsonPrimitiveValidator } from 'in-services/validators/jsonType';
import * as operators from 'in-new-components/QueryBuilder/tagFilter/operators';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import * as entities from 'in-new-components/QueryBuilder/tagFilter/entities';
import { enrichTagCatalog } from 'in-new-components/QueryBuilder/tagCatalog';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { buildEnumValidator } from 'in-services/validators/enum';

const allAllowedOperators = Object.values(operators);
const allAllowedEntities = Object.values(entities);

export function createTagForm(tagCatalog, tagFormModel) {
  tagCatalog = enrichTagCatalog(tagCatalog);

  return createMapForm()
    .put(
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
    )
    .put(
      'key',
      createField({
        value: tagFormModel?.key,
        validator: composeAndShortCircuitOnError(
          stringValidator
          // TODO validate max length. Waiting for merge of
          // https://github.com/instana/ui-client/pull/3542/files
        )
      })
    )
    .put(
      'value',
      createField({
        value: tagFormModel?.value,
        validator: composeAndShortCircuitOnError(
          jsonPrimitiveValidator
          // TODO validate max length. Waiting for merge of
          // https://github.com/instana/ui-client/pull/3542/files
        )
      })
    )
    .put(
      'operator',
      createField({
        value: tagFormModel?.operator ?? EQUALS,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(allAllowedOperators)
        )
      })
    )
    .put(
      'entity',
      createField({
        value: tagFormModel?.entity,
        validator: composeAndShortCircuitOnError(stringValidator, buildEnumValidator(allAllowedEntities))
      })
    );
}
