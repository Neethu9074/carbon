/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result, LogItem } from '@instana/types/typeDefinitions';
import { ColumnizedDefinition } from '@instana/components';
import { Progress, TagFilter } from '@instana/types';
import { Observable } from '@instana/observables';

import { GetDataParams, HeaderActionProps } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import { StateManagementProps } from 'in-components/AnalyzeView/StateManagement';

/*
 * Interim types - correct and narrow down the types once UngroupedView.js is migrated to TS
 * */
export interface UngroupedViewProps extends StateManagementProps {
  Presenter?: JSX.Element;
  useCursorPaginationStrategy: () => unknown;
  classNames: Record<string, string>;
  columnDefinitions: ColumnizedDefinition[];
  getData: (params: GetDataParams) => Observable<Result<unknown>>;
  getId: (item: any) => string;
  withoutListItemLinkToDetails: boolean;
  renderNestedContent: (_: unknown, item: any) => JSX.Element;
  withEmbeddedLoadingIndicator: boolean;
  initiallyOpenedItemIds: string[];
  onToggleContentRow: (toggled: boolean, item: any) => void;
  initialLines: number;
  DetailView: () => JSX.Element | null;
  getDetailData: (detailId: string) => Observable<Result<LogItem>>;
  onSelectTagHref: ((tag: TagFilter) => string) | undefined;
  withCountHeader: boolean;
  withoutHeader: boolean;
  CustomHeaderActions: ({ orderBy, setOrder }: HeaderActionProps) => JSX.Element;
}

/*
 * Interim types - reconcile with UngroupedViewProps once UngroupedView.js is migrated to TS
 * */
export interface ListProps extends UngroupedViewProps {
  result: Result<unknown>;
  hasItems: boolean;
  items: Record<string, unknown>[];
  canLoadMore: boolean;
  loadMore: () => void;
  progress: Progress;
  groupKey: string;
  time: string;
}

export interface ListItemProps {
  isInitiallyToggled: boolean;
  item: unknown;
  href?: string;
  className: string;
  renderNestedContent: () => JSX.Element;
  onToggleContentRow: (toggled: boolean, item: unknown) => void;
  columnDefinitions: ColumnizedDefinition[];
}
