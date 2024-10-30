/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Error, Progress, ResultPrecisionDetails, TagFilter, TagFilterExpression, TimeConfig } from '@instana/types';
import { ColumnizedDefinition } from '@instana/components';
import { Group } from '@instana/types/typeDefinitions';
import { Observable } from '@instana/observables';

import { StateManagementChildProps } from 'in-components/AnalyzeView/StateManagement';
import { OrderBy } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import { HeaderProps } from 'in-components/QueryBuilder/components/Header';

export type CursorPaginationStrategy = (
  create: (params: any) => Observable<any>,
  deps: unknown[]
) => {
  items: unknown[];
  errors: Error[];
  progress: Progress;
  totalHits?: number;
  totalRepresentedItemCount?: number;
  totalRetainedItemCount?: number;
  adjustedWindowSize?: number;
  resultPrecisionDetails?: ResultPrecisionDetails;
  time?: number;
  canLoadMore?: boolean;
};

type InfiniteScrollProps = { loadingCompleteMessage: string } | boolean;

type CursorPaginationReturn = ReturnType<CursorPaginationStrategy>;
export type Presenter = (props: PresenterProps) => JSX.Element;

export interface GetDataParams {
  timeConfig: TimeConfig;
  orderBy: OrderBy;
  backendQueryModel: TagFilterExpression;
  dataSource: string;
  metrics: Array<string>;
  afterKey?: string;
  initialLogLines?: number;
  retrievalSize?: number;
  contextSubjectLogId?: string;
}

interface DetailViewProps extends UngroupedViewProps, CursorPaginationReturn {
  hasErrors: boolean;
  hasItems: boolean;
  ListItemContent?: (props: unknown) => JSX.Element;
}

export interface PresenterProps extends UngroupedViewProps, CursorPaginationReturn {
  hasErrors: boolean;
  hasItems: boolean;
  items: unknown[];
  canLoadMore?: boolean;
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
  Presenter: (props: PresenterProps) => JSX.Element;
  SplitScreenListItemContent?: () => JSX.Element;
  getItemName?: () => string;
  getData: (params: GetDataParams) => Observable<unknown>;
  getDetailData: (detailId: string) => Observable<any>;
  getId: (item: Item) => string;
  columnDefinitions: ColumnizedDefinition[];
  useCursorPaginationStrategy: CursorPaginationStrategy;
  getColor?: (item: unknown, i: number, groupBy: Group) => string;
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
  item: any;
  href?: string;
  className: string;
  renderNestedContent: () => JSX.Element;
  onToggleContentRow: (toggled: boolean, item: unknown) => void;
  columnDefinitions: ColumnizedDefinition[];
}
