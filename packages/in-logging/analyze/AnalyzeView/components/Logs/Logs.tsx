/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef } from 'react';

import { Button } from '@instana/components';
import { TagFilter } from '@instana/types';

// @ts-expect-error needs TS migration
import { createPageSizeAwareLogsCursorPaginationHook } from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
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
// @ts-expect-error needs TS migration
import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
// @ts-expect-error needs TS migration
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
// @ts-expect-error needs TS migration
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/ChartsPresenter';
// @ts-expect-error needs TS migration
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
// @ts-expect-error needs ts migration
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedViewList';
import { GetDataParams, HeaderActionProps, LogsProps } from 'in-logging/analyze/AnalyzeView/components/Logs/types';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { sortingChanged } from 'in-logging/analyze/AnalyzeView/tracker';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';
import { LogItem } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/Logs.mless';

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
    detailId
  } = props;

  const initialLogLines = initialLogLinesProp || groupedPaginationRef.current?.[groupLabel];

  const onSelectTagHref = getHrefWithAdditionalTagFilter
    ? (tag: TagFilter) => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))
    : undefined;

  const selectedWasOpened = useRef(false);

  useEffect(() => {
    selectedWasOpened.current = false;
  }, [selectedId]);

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
    if (groupedPaginationRef.current) {
      groupedPaginationRef.current[groupLabel] = params.initialLogLines;
    }
    return getTableData(params);
  };

  const columnDefinitions = [
    logLevelColumn,
    timestampColumn,
    {
      id: 'log',
      getContent: (item: LogItem) => <LogMessageColumn {...item} />
    },
    centerAlignedLinkColumn,
    centerAlignedCopyColumn
  ];

  const renderNestedContent = (_: unknown, item: LogItem) => (
    <LogTagsTable
      item={item}
      selectedId={selectedId}
      onSelectTagHref={onSelectTagHref}
      getHrefToGroupedView={getHrefToGroupedView}
    />
  );

  let content = (
    <UngroupedViewList
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
  useEffect(() => {
    const cleanup = () => sortingChanged({ source: 'end state of sorting order' });
    window.addEventListener('beforeunload', cleanup);
    return cleanup;
  }, [orderBy.direction]);

  const sortingButtonClickHandle = () => {
    sortingChanged({ source: `changed sorting order to ${orderBy.direction}` });
    setOrder({
      by: orderBy.by,
      direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
    });
  };
  const sortingIcon = orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending';
  const sortingButtonLabel =
    orderBy.direction === 'ASC' ? t('in-logging:sorting.oldest') : t('in-logging:sorting.mostRecent');

  return (
    <Button icon={sortingIcon} kind="secondary" onClick={sortingButtonClickHandle}>
      {sortingButtonLabel}
    </Button>
  );
}

function getTableData(props: GetDataParams) {
  const { timeConfig, afterKey, backendQueryModel, retrievalSize, orderBy } = props;

  return getLogs({
    timeConfig,
    retrievalSize,
    afterKey,
    tagFilterExpression: backendQueryModel,
    tags: [LOG_CUSTOM, LOG_LEVEL, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE],
    orderDirection: orderBy?.direction
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
