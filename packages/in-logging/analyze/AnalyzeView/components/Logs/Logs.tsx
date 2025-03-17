/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef } from 'react';

import { ColumnizedDefinition, Button } from '@instana/components';
import { TagFilter } from '@instana/types';

import {
  centerAlignedCopyColumn,
  centerAlignedLinkColumn,
  logLevelColumn,
  timestampColumn
} from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import {
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL,
  logTableTags
} from 'in-logging/queryBuilder';
import { createPageSizeAwareLogsCursorPaginationHook } from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { HeaderActionProps, LogsProps, SortDirection } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/Charts/ChartsPresenter';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { GetDataParams, ListItemProps } from 'in-components/AnalyzeView/UngroupedView/types';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedView/UngroupedViewList';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import { ANALYZE_LOGGING_SORTING_CHANGED } from 'in-services/tracking/eventNames';
import { handleLogCallsWithFilters } from 'in-logging/analyze/AnalyzeView/utils';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { trySet } from 'in-services/localStorage';
import { LogItem } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/Logs.mless';

const pageSize = 20;

export interface ColumnContentProps extends ListItemProps, LogItem {
  isToggled: boolean;
}

export default function Logs(props: LogsProps) {
  const {
    getHrefWithAdditionalTagFilter,
    getHrefToGroupedView,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter,
    initialLogLines: initialLogLinesProp,
    groupedPaginationRef,
    groupLabel,
    selectedId,
    withoutHeader,
    detailId,
    setSelectedId
  } = props;

  const initialLogLines = initialLogLinesProp || groupedPaginationRef.current?.[groupLabel] || pageSize;

  const onSelectTagHref = getHrefWithAdditionalTagFilter
    ? (tag: TagFilter) => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))
    : undefined;

  const selectedWasOpened = useRef(false);
  const timeConfig = useTimeConfig();
  const { trackCta } = useSegmentTracking();
  useEffect(() => {
    selectedWasOpened.current = false;
  }, [selectedId]);

  /* Changing the timeframe to one outside of where the selected log is can cause errors so selectedId is cleared on every timeConfig change using the effect cleanup */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => setSelectedId(null), [timeConfig]);

  const initiallyToggled = selectedId ? [selectedId] : [];
  const toggledEntries = useRef(new Set(initiallyToggled));

  const initiallyOpenedItemIds = Array.from(new Set([...initiallyToggled, ...toggledEntries.current]));

  function onToggleHandler(toggled: boolean, item: LogItem) {
    const itemId = getItemId(item);
    if (toggled) {
      toggledEntries.current.add(itemId);
    } else {
      toggledEntries.current.delete(itemId);
    }
  }

  const getData = (params: GetDataParams) => {
    const isFirstPage = params.initialLogLines === pageSize;

    if (groupedPaginationRef.current && params.initialLogLines) {
      groupedPaginationRef.current[groupLabel] = params.initialLogLines;
    }

    if (isFirstPage) params.contextSubjectLogId = props.selectedId;

    return getTableData(trackCta, params);
  };

  const columnDefinitions = [
    logLevelColumn,
    timestampColumn,
    {
      id: 'log',
      getContent: (columnContentProps: ColumnContentProps) => <LogMessageColumn {...columnContentProps} />
    },
    centerAlignedLinkColumn,
    centerAlignedCopyColumn
  ] as ColumnizedDefinition[];

  const renderNestedContent = (_: string, item: LogItem) => (
    <LogTagsTable
      item={item}
      selectedId={selectedId}
      onSelectTagHref={onSelectTagHref}
      getHrefToGroupedView={getHrefToGroupedView}
    />
  );

  const infiniteScroll = groupLabel ? false : { loadingCompleteMessage: t('in-logging:endOfInfiniteScroll') };

  let content = (
    <UngroupedViewList<LogItem>
      {...props}
      Sidebar={Sidebar}
      Chart={Chart}
      useCursorPaginationStrategy={createPageSizeAwareLogsCursorPaginationHook(initialLogLines)}
      classNames={{ listItem: locals.listItem }}
      columnDefinitions={columnDefinitions}
      getData={getData}
      getId={getItemId}
      withoutListItemLinkToDetails
      DetailView={DetailView}
      getDetailData={(detailId: string) => getLog({ itemId: detailId, requestedTags: logTableTags })}
      onSelectTagHref={onSelectTagHref}
      withCountHeader={false}
      withoutHeader={false}
      CustomHeaderActions={CustomHeaderActions}
      initiallyOpenedItemIds={initiallyOpenedItemIds}
      onToggleContentRow={onToggleHandler}
      renderNestedContent={renderNestedContent}
      initialLines={initialLogLines}
      withEmbeddedLoadingIndicator
      infiniteScroll={infiniteScroll}
      wrapperClassNames={locals.removeBackground}
    />
  );

  if (!withoutHeader && !detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function DetailView() {
  return null;
}

function CustomHeaderActions({ orderBy, setOrder }: HeaderActionProps) {
  const { trackCta } = useSegmentTracking();
  useEffect(() => {
    const cleanup = () => trackCta(ANALYZE_LOGGING_SORTING_CHANGED, { source: 'end state of sorting order' });
    window.addEventListener('beforeunload', cleanup);
    return cleanup;
  }, [orderBy.direction, trackCta]);

  const sortingButtonClickHandle = () => {
    const newDirection = (orderBy.direction === 'ASC' ? 'DESC' : 'ASC') as SortDirection;
    trackCta(ANALYZE_LOGGING_SORTING_CHANGED, { source: `changed sorting order to ${newDirection}` });
    const order = {
      by: orderBy.by,
      direction: newDirection
    };
    trySet('logSortingOrder', JSON.stringify(order));
    setOrder(order);
  };
  const sortingIcon = orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending';
  const sortingButtonLabel =
    orderBy.direction === 'ASC' ? t('in-logging:sorting.oldest') : t('in-logging:sorting.mostRecent');

  return (
    <Button
      data-testid={`sortLogsButton-${orderBy.direction}`}
      icon={sortingIcon}
      kind="secondary"
      onClick={sortingButtonClickHandle}
    >
      {sortingButtonLabel}
    </Button>
  );
}

function getTableData(trackCta: CtaTrackingFunction, props: GetDataParams) {
  const { timeConfig, afterKey, backendQueryModel, retrievalSize = pageSize, orderBy, contextSubjectLogId } = props;
  const mixpanelProps = {
    timeConfig: timeConfig,
    tagFilterExpression: backendQueryModel
  };
  handleLogCallsWithFilters(trackCta, mixpanelProps);

  return getLogs({
    timeConfig,
    retrievalSize: contextSubjectLogId ? 40 : retrievalSize,
    afterKey,
    tagFilterExpression: backendQueryModel,
    requestedTags: [LOG_CUSTOM, LOG_LEVEL, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE],
    orderDirection: orderBy?.direction,
    contextSubjectLogId
  });
}

function getTagExpressionWithTag(tag: TagFilter): TagFilter {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}

function getItemId(item: LogItem) {
  return item.itemId;
}
