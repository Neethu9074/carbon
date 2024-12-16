/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import QueryBuilder from 'in-components/QueryBuilder/QueryBuilder';
import { success, errorWithData } from 'in-services/util/result';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function createQueryBuilder({ getTagCatalog: originalGetTagCatalog, ...props }) {
  // Ensure that we only ever receive the tag catalog once (per time config).
  const getTagCatalog = getTagCatalogOnce(originalGetTagCatalog);

  const { QueryBuilder, isQueryValid, toFormModel } = createDynamicQueryBuilder(props);

  return {
    // Re-exposed so that users follow the best practice to only ever load the tag catalog once.
    getTagCatalog,

    QueryBuilder: function CreatedQueryBuilder({ ...props }) {
      const timeConfig = useTimeConfig();
      const tagCatalog = useObservable(() => getTagCatalog({ timeConfig }), [getTagCatalog, timeConfig]);

      return <QueryBuilder {...props} tagCatalog={tagCatalog?.data} />;
    },

    // Observable<Result<Boolean>>
    isQueryValid: (formModel, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => {
        if (isLoading(result)) {
          return pendingResult;
        }
        if (result?.data == null) {
          return errorWithData(false);
        }
        return isQueryValid(formModel, result?.data);
      }),

    // Observable<Result<FormModel>>
    toFormModel: (tagFilterArray, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => toFormModel(tagFilterArray, result))
  };
}

// query builder where fetching of tag catalog is external to the query builder
export function createDynamicQueryBuilder({
  getSuggestions,
  withoutOrConjunction = false,
  withoutBrackets = false,
  allowEmptyKey = false,
  addTagDefinitionToFormModel = false,
  disableEntitySelection = false,
  maxExpressionDepth,
  getTagCatalog
}) {
  return {
    QueryBuilder: function CreatedQueryBuilder(props) {
      return (
        <QueryBuilder
          {...props}
          getSuggestions={getSuggestions}
          withoutOrConjunction={withoutOrConjunction}
          withoutBrackets={withoutBrackets}
          maxExpressionDepth={maxExpressionDepth}
          allowEmptyKey={allowEmptyKey}
          getTagCatalog={getTagCatalog}
          addTagDefinitionToFormModel={addTagDefinitionToFormModel}
          disableEntitySelection={disableEntitySelection}
        />
      );
    },

    isQueryValid: (formModel, tagCatalog) => {
      if (!tagCatalog) {
        return pendingResult;
      }
      const { isValid, errors } = validateFormModel({
        tagCatalog: tagCatalog,
        formModel,
        maxExpressionDepth,
        allowEmptyKey,
        disableEntitySelection
      });
      if (!isValid) {
        return errorWithData(errors, false);
      }
      return success(isValid);
    },

    toFormModel: (tagFilterArray, tagCatalog) => {
      if (!tagCatalog) {
        return pendingResult;
      }
      return success(fromTagFiltersArray(tagFilterArray, tagCatalog));
    }
  };
}
