/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { getTotalActiveFacetItems } from 'in-components/AnalyzeView/utils';
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
    getFacetedSearchSuggestions,
    hiddenCalls,
    resetFacets,
    resetHiddenCalls
  } = props;

  let totalActiveCount = getTotalActiveFacetItems(facetedSearchItems, facets);

  if (hiddenCalls.includeSynthetic) {
    totalActiveCount += 1;
  }

  if (hiddenCalls.includeInternal) {
    totalActiveCount += 1;
  }

  function resetFacetsAndHiddenCalls(tag) {
    resetFacets?.(tag);
    if (tag == null) {
      resetHiddenCalls?.({ hiddenCalls: {} });
    }
  }

  return facetedSearchItems?.length > 0 ? (
    <FacetedSearch
      {...props}
      resetFacets={resetFacetsAndHiddenCalls}
      totalActiveCount={totalActiveCount}
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
