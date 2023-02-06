/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

//@ts-expect-error needs TS migration
import { toBackendQuery } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { GetFacetedSearchSuggestionsParams } from 'in-components/AnalyzeView/StateManagement';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';

export default function getFacetedSearchSuggestions({
  timeConfig,
  formModel,
  tag,
  excludeMissingGroupingTagFilterExpression,
  facets,
  facetedSearchItems,
  group
}: GetFacetedSearchSuggestionsParams) {
  const backendQuery = toBackendQuery({
    formModel,
    facets,
    facetedSearchConfiguration: facetedSearchItems,
    tagToExclude: tag,
    excludeMissingGroupingTagFilterExpression
  });

  return getLogGroups({
    timeConfig,
    group,
    tagFilterExpression: backendQuery,
    pagination: {
      retrievalSize: 20
    }
  });
}
