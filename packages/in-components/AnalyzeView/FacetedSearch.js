/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { sortBy } from 'lodash';
import React from 'react';

import FacetedSearchHeader from 'in-components/AnalyzeView/FacetedFilters/FacetedSearchHeader';

import locals from './FacetedSearch.mless';

function orderByMetric(suggestions) {
  const hasMetricData = Boolean(
    suggestions?.length > 0 &&
      Object.keys(suggestions[0]?.metrics ?? {}).length &&
      suggestions[0]?.metrics?.facetedSearchMetric[0][1]
  );
  return hasMetricData
    ? sortBy(suggestions, suggestion => -1 * suggestion.metrics.facetedSearchMetric[0][1])
    : suggestions;
}

export default function FacetedSearch({
  facetedSearchItems = [],
  facets,
  formModel,
  formModelWithFacets,
  resetFacets,
  onFacetedSearchSelectionChange,
  getUpdatedFacetedSearchHref,
  getHrefToGroupedView,
  getHrefToUngroupedView,
  dataSource,
  isValid,
  getSuggestions,
  groupbyTag,
  tagCatalog
}) {
  return (
    <div className={locals.wrapper}>
      <FacetedSearchHeader facets={facets} facetedSearchItems={facetedSearchItems} resetFacets={resetFacets} />
      {facetedSearchItems.map(facetedSearchItem => {
        const FilterComponent = facetedSearchItem.renderer;
        return (
          <FilterComponent
            key={facetedSearchItem.tag ?? facetedSearchItem.key}
            title={facetedSearchItem.title}
            tag={facetedSearchItem.tag}
            entity={facetedSearchItem.entity}
            formModel={formModel}
            formModelWithFacets={formModelWithFacets}
            facets={facets}
            resetFacets={resetFacets}
            updateFacets={onFacetedSearchSelectionChange}
            getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
            getHrefToGroupedView={getHrefToGroupedView}
            getHrefToUngroupedView={getHrefToUngroupedView}
            isValid={isValid}
            openByDefault={facetedSearchItem.openByDefault}
            dataSource={dataSource}
            getSuggestions={getSuggestions}
            groupbyTag={groupbyTag}
            tagCatalog={tagCatalog}
            customLabelMapper={facetedSearchItem.customLabelMapper}
            ranges={facetedSearchItem.ranges}
            enableUseAsGroup={facetedSearchItem.enableUseAsGroup}
            getItems={facetedSearchItem.getItems}
            getSuggestionName={facetedSearchItem.getSuggestionName}
            orderSuggestions={facetedSearchItem.orderSuggestions || orderByMetric}
            getMetric={facetedSearchItem.getMetric}
            fallbackValues={facetedSearchItem.fallbackValues}
            {...facetedSearchItem.extraProps}
          />
        );
      })}
    </div>
  );
}
