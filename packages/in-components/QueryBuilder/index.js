/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import QueryBuilder from 'in-components/QueryBuilder/QueryBuilder';
import { success, errorWithData } from 'in-services/util/result';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { isLoading } from 'in-services/util/result';

export function createQueryBuilder({
  getTagCatalog: originalGetTagCatalog,
  getSuggestions,
  withoutOrConjunction = false,
  withoutBrackets = false,
  maxExpressionDepth
}) {
  // Ensure that we only ever receive the tag catalog once (per time config).
  const getTagCatalog = getTagCatalogOnce(originalGetTagCatalog);

  return {
    // Re-exposed so that users follow the best practice to only ever load the tag catalog once.
    getTagCatalog,

    QueryBuilder: function CreatedQueryBuilder(props) {
      return (
        <QueryBuilder
          {...props}
          getTagCatalog={getTagCatalog}
          getSuggestions={getSuggestions}
          withoutOrConjunction={withoutOrConjunction}
          withoutBrackets={withoutBrackets}
          maxExpressionDepth={maxExpressionDepth}
        />
      );
    },

    // Observable<Result<Boolean>>
    isQueryValid: (formModel, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => {
        if (isLoading(result)) {
          return result;
        }
        if (result.data == null) {
          return errorWithData(false);
        }
        const { isValid, errors } = validateFormModel({ tagCatalog: result.data, formModel, maxExpressionDepth });
        if (!isValid) {
          return errorWithData(errors, false);
        }
        return success(isValid);
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
