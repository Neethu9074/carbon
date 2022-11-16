/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Group, MetricDescription, Result } from '@instana/types/typeDefinitions';
import { TagFilter, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import { GroupingTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { ObservableCreator } from 'in-services/util/memoizingObservableGenerator';
import { GetLogGroupsResponse } from 'in-logging/subscriptions/getLogGroups';
import { GetMetricCatalog } from 'in-services/metrics/metricCatalog';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { ParameterDefinition } from 'in-stores/navigation/types';
import { TagFilterExpressionElementUnion } from 'in-types';
import { UrlState } from 'in-synthetics/utils/constants';
import { IngestionOffsetCursor } from 'in-types';
import { Options } from 'in-hooks/useUrlState';

export type Facets = Record<unknown, unknown>;

type Direction = 'ASC' | 'DESC';

type Field = {
  customFieldId?: string;
  type: string;
  metricId: string;
  aggregationId?: string;
};

type Order = {
  by: string;
  direction: Direction;
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

export type GetFacetedSearchSuggestionsParams = {
  timeConfig: TimeConfig;
  facets: Facets;
  tag: TagFilter;
  facetedSearchItems: FacetedSearchItem[];
  formModel: FormModelElement;
  group: Group;
  metricKey: string;
  hiddenCalls: unknown;
  excludeMissingGroupingTagFilterExpression: boolean;
  cursor?: IngestionOffsetCursor;
};

export interface FacetedSearchItem {
  renderer: () => JSX.Element;
  title: string;
  tag: string;
  getSuggestionName: (unknown) => unknown;
  getMetric: (unknown) => unknown;
  customLabelMapper?: () => string;
  ranges?: { start: number; string: number }[];
  key?: string;
  getItems?: (unknown) => unknown;
  getSuggestions?: (unknown) => unknown;
  enableUseAsGroup?: boolean;
  extraProps?: Record<string, unknown>;
}

interface ExtendedColumnDefinition {
  width: string;
  minWidth: string;
  getContent: (unknown) => unknown;
  verticallyCenter: boolean;
  forceMinimumWidth: boolean;
  shrink: boolean;
  label: string;
}

/*
 * Interim typing, some types might be wrong - correct and narrow down the types whenever possible
 * */
export interface StateManagementChildProps {
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
  getFacetedSearchSuggestions: (params: GetFacetedSearchSuggestionsParams) => Observable<GetLogGroupsResponse>;
}

interface GroupedView {
  defaultOrderBy: string;
  defaultOrderDirection: Direction;
  customFieldRenderingInstructions?: ExtendedColumnDefinition;
  timestampName?: string;
  orderByGroupName?: string;
  getCustomGroupLabel?: (unknown) => string;
}

interface UngroupedView {
  defaultOrderBy: string;
  defaultOrderDirection: Direction;
  customFieldRenderingInstructions?: ExtendedColumnDefinition;
  timestamp?: string;
  metricFieldExtractors?: {
    getColumnId: (unknown) => string;
    getColumnLabel: (unknown) => string;
    getColumnFormatter: (unknown) => unknown;
    getColumnValue: (unknown) => unknown;
    ColumnContent: (unknown) => JSX.Element;
  };
}

interface DataSourceConfiguration {
  metricCatalogTransformer: (unknown) => unknown;
  chartableMetricCatalogTransformer: (unknown) => unknown;
  facetedSearchItems: FacetedSearchItem[];
  groupedView: GroupedView;
  ungroupedView: UngroupedView;
  fixedFields: Field[];
  defaultSelectableFields: Field[];
  defaultChartedMetrics: ChartedMetric;
  getCustomFormatter: () => unknown;
}

export interface TimeFixatingAnalyzeStateManagementProps {
  path: string;
  dataSourceParameter: ParameterDefinition<string>;
  defaultDataSource: string;
  getTagCatalog?: ObservableCreator<GetTagCatalogParams, Result<CatalogResponse>>;
  dataSourceConfigurations: Record<string, Partial<DataSourceConfiguration>>;
}

export interface StateManagementProps extends TimeFixatingAnalyzeStateManagementProps {
  refreshFixatedTimeConfig?: () => void;
  defaultDataSource: string;
  getMetricCatalog?: GetMetricCatalog;
  getMetricTemplates?: ObservableCreator<unknown, unknown>;
  urlStateDefinition?: Options<UrlState>;
}

declare const StateManagement: React.FC<StateManagementProps>;

export default StateManagement;
