/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import FacetedSearch from 'in-components/AnalyzeView/FacetedSearch';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function FacetedSearchPresenter(props) {
  const timeConfig = useTimeConfig();

  const {
    dataSource,
    excludeMissingGroupingTagFilterExpression,
    facetedSearchItems,
    facets,
    filteringTagCatalog,
    formModel,
    getFacetedSearchSuggestions
  } = props;

  return facetedSearchItems?.length > 0 ? (
    <FacetedSearch
      {...props}
      getSuggestions={({ tag, entity }) =>
        getFacetedSearchSuggestions({
          timeConfig,
          formModel,
          tag,
          facets,
          facetedSearchItems,
          excludeMissingGroupingTagFilterExpression,
          metricKey: 'facetedSearchMetric',
          group: {
            groupbyTag: tag
          },
          dataSource,
          entity
        })
      }
      tagCatalog={filteringTagCatalog}
    />
  ) : null;
}
