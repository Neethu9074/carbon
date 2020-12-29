import { just } from '@instana/observables';
import { createField } from 'formalistic';
import { isEqual } from 'lodash';

import { toBackendQueryModel, EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { finishedProgress, emptyArray } from 'in-services/fixedObjects';
import { objectValidator } from 'in-services/validators/jsonType';
import { identity } from 'in-services/util/function';
import { timeConfig$ } from 'in-stores/time/config';

export const invalidMarker = { invalid: true };

function markerValidator(value) {
  if (isEqual(value, invalidMarker)) {
    return [{ severity: 'error' }];
  }
}

export function addTagFilterExpressionField(form, savedState) {
  let tagFilterExpression = savedState?.tagFilterExpression || EMPTY_EXPRESSION;
  if (isEqual(tagFilterExpression, invalidMarker)) {
    tagFilterExpression = EMPTY_EXPRESSION;
  }

  return form.put(
    'tagFilterExpression',
    createField({
      value: tagFilterExpression,
      validator: composeAndShortCircuitOnError(notUndefinedValidator, objectValidator, markerValidator)
    })
  );
}

export function migrate({ savedState, getTagCatalog, modifyTagFilterArrayBeforeConversion = identity }) {
  if (!savedState.tagFilters) {
    return just({
      data: savedState,
      progress: finishedProgress,
      errors: emptyArray
    });
  }

  return timeConfig$
    .flatMap(timeConfig => getTagCatalog({ timeConfig }))
    .map(tagCatalogResult => {
      if (!tagCatalogResult.data) {
        return tagCatalogResult;
      }

      return {
        progress: finishedProgress,
        errors: emptyArray,
        data: {
          ...savedState,
          tagFilters: undefined,
          tagFilterExpression: toBackendQueryModel(
            fromTagFiltersArray(modifyTagFilterArrayBeforeConversion(savedState.tagFilters), tagCatalogResult.data)
          )
        }
      };
    });
}
