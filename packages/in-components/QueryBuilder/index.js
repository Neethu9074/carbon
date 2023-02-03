/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import QueryBuilder from 'in-components/QueryBuilder/QueryBuilder';
import { success, errorWithData } from 'in-services/util/result';
import { getTagCatalogOnce } from 'in-services/tags/tagCatalog';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function createQueryBuilder({
  getTagCatalog: originalGetTagCatalog,
  ...props
}) {
  // Ensure that we only ever receive the tag catalog once (per time config).
  const getTagCatalog = getTagCatalogOnce(originalGetTagCatalog);

  const {QueryBuilder, isQueryValid, toFormModel} = createDynamicQueryBuilder(props);

  return {
    // Re-exposed so that users follow the best practice to only ever load the tag catalog once.
    getTagCatalog,

    QueryBuilder: function CreatedQueryBuilder({...props}) {
      const timeConfig = useTimeConfig();
      const tagCatalog = useObservable(() => getTagCatalog({timeConfig}), [getTagCatalog, timeConfig]);

      return <QueryBuilder
        {...props}
        tagCatalog={tagCatalog?.data}
      />
    },

    // Observable<Result<Boolean>>
    isQueryValid: (formModel, timeConfig) =>
      getTagCatalog({ timeConfig }).map(result => isQueryValid(formModel, result)),

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
  maxExpressionDepth
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
        />
      )
    },

    isQueryValid: (formModel, tagCatalogResult) => {
      if (isLoading(tagCatalogResult)) {
        return tagCatalogResult;
      }
      if (tagCatalogResult?.data == null) {
        return errorWithData(false);
      }
      const { isValid, errors } = validateFormModel({ tagCatalog: tagCatalogResult?.data, formModel, maxExpressionDepth });
      if (!isValid) {
        return errorWithData(errors, false);
      }
      return success(isValid);
    },

    toFormModel: (tagFilterArray, tagCatalogResult) => {
      if (!tagCatalogResult?.data) {
        return tagCatalogResult;
      }
      return success(fromTagFiltersArray(tagFilterArray, tagCatalogResult?.data));
    }
  }
}
