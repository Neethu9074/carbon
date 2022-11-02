/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Group, MetricDescription, Result, TagSuggestions } from '@instana/types/typeDefinitions';
import { TagFilter, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { GroupingTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { TagFilterExpressionElementUnion } from 'in-types';

type Field = {
  customFieldId?: string;
  type: string;
  metricId: string;
  aggregationId?: string;
};

type Facets = Record<unknown, unknown>;

type Order = {
  by: string;
  direction: 'ASC' | 'DESC';
};

interface GetHrefToGroupedViewParams {
  tag?: string;
  secondLevelKey?: string;
}

type ChartableDataSeries = {
  label: string;
  formModel: FormModelElement;
}[];

type ChartedMetric = { metricId: string; aggregationId: string }[] | { templateId: string }[];

type GetFacetedSearchSuggestionsParams = {
  timeConfig: TimeConfig;
  facets: Facets;
  tag: TagFilter;
  facetedSearchItems: unknown;
  formModel: FormModelElement;
  group: string;
  metricKey: string;
  hiddenCalls: unknown;
};

/*
 * Interim typing, some types might be wrong - correct and narrow down the types whenever possible
 * */
export interface StateManagementProps {
  Sidebar: React.ReactNode;
  Chart: React.ReactNode;
  groupedPaginationRef: {
    current?: Record<string, number>;
  };
  groupLabel: string;
  dataSource: string;
  isLoading: boolean;
  isValid: boolean;
  refreshFixatedTimeConfig: () => void;
  ungroupedViewConfiguration: {
    defaultOrderBy: string;
    defaultOrderDirection: string;
    customFieldRenderingInstructions: string;
  };
  groupedViewConfiguration: {
    defaultOrderBy: string;
    defaultOrderDirection: string;
    customFieldRenderingInstructions: string;
  };
  getOrderByGroupId: (unknown) => unknown;
  facetedSearchItems: unknown[];
  fixedFields: Field[];
  backendQueryModel: TagFilterExpressionElementUnion;
  backendQueryModelWithFacets: TagFilterExpressionElementUnion;
  formModel: FormModelElement[];
  formModelWithFacets: FormModelElement[];
  initialLogLines: number;
  onFormModelChange: (unknown) => unknown;
  facets: Facets;
  facetsAsTagFilterExpression: unknown[];
  getLabel: (unknown) => string | null;
  isGrouped: boolean;
  groupBy: Record<string, string>;
  onFacetedSearchSelectionChange: (facets: unknown) => void;
  selectedId: string;
  selectedGroup: string;
  resetFacets: (tag: unknown) => unknown;
  getUpdatedFacetedSearchHref: (tag: unknown) => unknown;
  filteringTagCatalog: EnrichedTagCatalog;
  groupingTagCatalog: EnrichedTagCatalog;
  onGroupByChange: (groupBy: Group) => void;
  getHrefToGroupedView: (tag: TagFilter | GroupingTag) => string;
  getHrefToUngroupedView: (params: GetHrefToGroupedViewParams) => string;
  getHrefWithAdditionalTagFilter: (tag: TagFilter) => string;
  getHrefWithTagFilterExpression: (newTagExpression: FormModelElement) => string;
  orderBy: Order;
  onOrderByChange: (order: Order) => void;
  orderByGroups: Order;
  onOrderByGroupsChange: (order: Order) => void;
  selectableFields: Field[];
  onSelectableFieldsChange: (fields: Field[]) => void;
  metricCatalog: MetricDescription[];
  chartableDataSeries: ChartableDataSeries;
  onChartableDataSeriesChange: (DataSeries: ChartableDataSeries) => void;
  chartedMetrics: ChartedMetric;
  onChartedMetricsChange: (chartedMetric: ChartedMetric) => void;
  getHrefToDetailId: (id: string, item: unknown) => string;
  setDetailId: (id: string) => void;
  getFacetedSearchSuggestions: (params: GetFacetedSearchSuggestionsParams) => Observable<Result<TagSuggestions>>;
}
