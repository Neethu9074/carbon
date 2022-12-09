/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Progress, TagFilter, TagFilterExpressionElementUnion, TimeConfig } from '@instana/types';
import { ColumnizedDefinition } from '@instana/components';
import { Observable } from '@instana/observables';

import { StateManagementChildProps } from 'in-components/AnalyzeView/StateManagement';
import { OrderBy } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import { HeaderProps } from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';

type CursorPaginationStrategy = typeof useCursorPagination;
type InfiniteScrollProps = { loadingCompleteMessage: string } | boolean;

type CursorPaginationReturn = ReturnType<CursorPaginationStrategy>;
export type Presenter = (props: PresenterProps) => JSX.Element;

export interface GetDataParams {
  timeConfig: TimeConfig;
  orderBy: OrderBy;
  backendQueryModel: TagFilterExpressionElementUnion;
  dataSource: string;
  afterKey?: string;
  initialLogLines?: number;
  retrievalSize?: number;
}

interface DetailViewProps extends UngroupedViewProps, CursorPaginationReturn {
  hasErrors: boolean;
  hasItems: boolean;
  ListItemContent?: (props: unknown) => JSX.Element;
  tracker: Record<string, () => void>;
}

export interface PresenterProps extends UngroupedViewProps, CursorPaginationReturn {
  hasErrors: boolean;
  hasItems: boolean;
  items: Record<string, unknown>[];
  canLoadMore: boolean;
  progress: Progress;
}

export interface UngroupedViewProps<Item = any> extends StateManagementChildProps {
  withoutHeader: boolean;
  withOverflow?: boolean;
  hideMetricAndSortingConfigurator?: boolean;
  detailId?: string;
  groupLabel: string;
  DetailView: (detailViewProps: DetailViewProps) => JSX.Element | null;
  CustomHeaderActions: (props: HeaderProps) => JSX.Element;
  Chart: (props: UngroupedViewProps<Item>) => JSX.Element;
  Sidebar: (props: UngroupedViewProps<Item>) => JSX.Element;
  Presenter: (props: PresenterProps) => JSX.Element;
  SplitScreenListItemContent?: () => JSX.Element;
  getItemName?: () => string;
  getData: (params: GetDataParams) => Observable<unknown>;
  getDetailData: (detailId: string) => Observable<any>;
  getId: (item: Item) => string;
  columnDefinitions: ColumnizedDefinition[];
  useCursorPaginationStrategy: CursorPaginationStrategy;
}

export interface UngroupedViewListProps<Item> extends Omit<UngroupedViewProps, 'Presenter'> {
  classNames: Record<string, string>;
  renderNestedContent: (id: string, item: Item) => JSX.Element;
  withoutListItemLinkToDetails: boolean;
  withEmbeddedLoadingIndicator: boolean;
  withCountHeader: boolean;
  initiallyOpenedItemIds: string[];
  onToggleContentRow: (toggled: boolean, item: Item) => void;
  infiniteScroll: InfiniteScrollProps;
  initialLines: number;
  onSelectTagHref?: (tag: TagFilter) => string;
}

export interface UngroupedViewListPresenterProps<Item = any> extends UngroupedViewListProps<Item>, PresenterProps {
  loadMore: () => void;
  groupKey: unknown;
}

export interface ListItemProps {
  isInitiallyToggled?: boolean;
  item: unknown;
  href?: string;
  className: string;
  renderNestedContent: () => JSX.Element;
  onToggleContentRow: (toggled: boolean, item: unknown) => void;
  columnDefinitions: ColumnizedDefinition[];
}
