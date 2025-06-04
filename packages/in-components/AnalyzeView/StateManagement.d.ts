/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item } from 'formalistic';
import React from 'react';

import {
  AggregationType,
  Cursor,
  DataSource,
  Group,
  MetricDescription,
  Result,
  TagFilter,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  TimeConfig
} from '@instana/types';
import { Observable } from '@instana/observables';

import { GroupingTag } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import { ObservableCreator } from 'in-services/util/memoizingObservableGenerator';
import { GetLogGroupsResponse } from 'in-logging/subscriptions/getLogGroups';
import { GetMetricCatalog } from 'in-services/metrics/metricCatalog';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { ParameterDefinition } from 'in-stores/navigation/types';
import { UrlState } from 'in-synthetics/utils/constants';
import { Options } from 'in-hooks/useUrlState';

export type Facets = Record<string, unknown[]>;

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

export type ChartableDataSeries = {
  label: string;
  color?: string;
  formModel: FormModelElement;
}[];

export type GetHrefWithAdditionalTagFilter = (tag: TagFilter) => string;
export type GetHrefToGroupedView = (tag: TagFilter | GroupingTag) => string;

export type GetFacetedSearchSuggestionsParams = {
  timeConfig: TimeConfig;
  facets: Facets;
  tag: string;
  formModel: FormModelElement[];
  group: Group;
  metricKey: string;
  facetedSearchItems?: FacetedSearchItem[];
  excludeMissingGroupingTagFilterExpression?: boolean;
  cursor?: Cursor;
  dataSource: string;
  entity: string;
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
  tracking: Record<string, ({ metric: string, aggregation: AggregationType }) => void>;
  Sidebar: (props: UngroupedViewProps<Item>) => JSX.Element;
  Chart: (props: UngroupedViewProps<Item>) => JSX.Element;
  groupedPaginationRef: {
    current?: Record<string, number>;
  };
  groupLabel: string;
  dataSource: DataSource | 'LOGS';
  isLoading: boolean;
  isValid: boolean;
  refreshFixatedTimeConfig: () => void;
  ungroupedViewConfiguration: UngroupedView;
  groupedViewConfiguration: {
    defaultOrderBy: string;
    defaultOrderDirection: string;
    customFieldRenderingInstructions: string;
  };
  getOrderByGroupId: (unknown) => unknown;
  facetedSearchItems: FacetedSearchItem[];
  fixedFields: Field[];
  backendQueryModel: TagFilterExpressionElementUnion;
  backendQueryModelWithFacets: TagFilterExpression;
  formModel: FormModelElement[];
  formModelWithFacets: FormModelElement[];
  initialLogLines: number;
  onFormModelChange: (unknown) => unknown;
  facets: Facets;
  facetsAsTagFilterExpression: unknown[];
  getLabel: (unknown) => string | null;
  isGrouped: boolean;
  groupBy: Group;
  onFacetedSearchSelectionChange: (facets: unknown) => void;
  selectedId: string;
  selectedGroup: string;
  resetFacets: (tag: unknown) => unknown;
  getUpdatedFacetedSearchHref: (tag: unknown) => unknown;
  filteringTagCatalog: EnrichedTagCatalog;
  groupingTagCatalog: EnrichedTagCatalog;
  onGroupByChange: (groupBy: Group) => void;
  getHrefToGroupedView: GetHrefToGroupedView;
  getHrefToUngroupedView: (params: GetHrefToGroupedViewParams) => string;
  getHrefWithAdditionalTagFilter: GetHrefWithAdditionalTagFilter;
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
  chartedMetrics: ChartedMetric[];
  onChartedMetricsChange: (chartedMetric: ChartedMetric | ChartedMetrics[]) => void;
  getHrefToDetailId: (id: string, item: unknown) => string;
  setDetailId: (id: string) => void;
  getFacetedSearchSuggestions: (params: GetFacetedSearchSuggestionsParams) => Observable<GetLogGroupsResponse>;
  setSelectedId: (selectedId: string | null) => void;
  setUrlState: (selectedId: string | null) => void;
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
    hasRawValue: boolean;
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
  defaultChartedMetrics: ChartedMetric[];
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
  defaultDataSource: Lowercase<DataSource | 'LOGS'>;
  getMetricCatalog?: GetMetricCatalog;
  getMetricTemplates?: ObservableCreator<unknown, unknown>;
  urlStateDefinition?: Options<UrlState>;
}

declare const StateManagement: React.FC<StateManagementProps>;

export default StateManagement;

export type ChartedMetric = {
  metricId: string;
  aggregationId: AggregationType;
};
