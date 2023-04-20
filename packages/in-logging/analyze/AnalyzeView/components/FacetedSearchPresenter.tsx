/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

//@ts-expect-error needs ts migration
import FacetedSearch from 'in-components/AnalyzeView/FacetedSearch';
import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import { getTotalActiveFacetItems } from 'in-components/AnalyzeView/utils';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function FacetedSearchPresenter(props: UngroupedViewProps) {
  const timeConfig = useTimeConfig();

  const { dataSource, facetedSearchItems, facets, filteringTagCatalog, formModel, getFacetedSearchSuggestions } = props;
  const totalActiveCount = getTotalActiveFacetItems(facetedSearchItems, facets);

  return facetedSearchItems?.length > 0 ? (
    <FacetedSearch
      {...props}
      totalActiveCount={totalActiveCount}
      getSuggestions={({ tag, entity }: { tag: string; entity: string }) =>
        getFacetedSearchSuggestions({
          timeConfig,
          formModel,
          tag,
          facets,
          metricKey: 'facetedSearchMetric',
          group: {
            groupbyTag: tag,
            groupbyTagEntity: 'NOT_APPLICABLE'
          },
          dataSource,
          entity,
          facetedSearchItems
        })
      }
      tagCatalog={filteringTagCatalog}
    />
  ) : (
    <React.Fragment />
  );
}
