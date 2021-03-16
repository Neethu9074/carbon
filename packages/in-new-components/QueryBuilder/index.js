/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  toBackendQueryModel,
  getMaximumExpressionDepth
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import { isFormModelValid } from 'in-new-components/QueryBuilder/validation/formModel';
import QueryBuilder from 'in-new-components/QueryBuilder/QueryBuilder';
import { success, errorWithData } from 'in-services/util/result';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { t } from 'in-i18n';

export function createQueryBuilder({
  getTagCatalog: originalGetTagCatalog,
  getSuggestions,
  withoutOrConjunction = false,
  withoutBrackets = false
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
        />
      );
    },

    // Observable<Result<Boolean>>
    isQueryValid: (formModel, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => {
        if (!result.data) {
          return result;
        }
        const formModelValid = isFormModelValid({ tagCatalog: result.data, formModel });
        if (formModelValid && getMaximumExpressionDepth(toBackendQueryModel(formModel)) > 5) {
          return errorWithData([t('in-new-components:queryBuilder.errorWithDataYourDefinedQueryIsTooComplex')], false);
        }
        return success(formModelValid);
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
