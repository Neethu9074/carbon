import React from 'react';

import { fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import { isFormModelValid } from 'in-new-components/QueryBuilder/validation/formModel';
import QueryBuilder from 'in-new-components/QueryBuilder/QueryBuilder';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { success } from 'in-services/util/result';

export function createQueryBuilder({
  getTagCatalog: originalGetTagCatalog,
  getSuggestions,
  withoutOrConjunction = false,
  withoutBrackets = false
}) {
  // Ensure that we only ever receive the tag catalog once (per time config).
  const getTagCatalog = getTagCatalogOnce(originalGetTagCatalog);

  return {
    QueryBuilder: function CreatedQueryBuilder(props) {
      return (
        <QueryBuilder
          {...props}
          getTagCatalog={getTagCatalog}
          getSuggestions={getSuggestions}
          withoutOrConjunction={withoutOrConjunction}
          withoutBrackets={withoutBrackets}
        />
      );
    },

    // Observable<Result<Boolean>>
    isQueryValid: (formModel, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => {
        if (!result.data) {
          return result;
        }
        return success(isFormModelValid({ tagCatalog: result.data, formModel }));
      }),

    // Observable<Result<FormModel>>
    toFormModel: (tagFilterArray, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => {
        if (!result.data) {
          return result;
        }
        return success(fromTagFiltersArray(tagFilterArray, result.data));
      })
  };
}
