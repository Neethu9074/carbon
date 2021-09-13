/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Button } from '@instana/components';

import {
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL
} from 'in-logging/queryBuilder';
import { logLevelColumn, timestampColumn, copyColumn } from 'in-logging/analyze/AnalyzeView/components/logsColumns';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/ChartsPresenter';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import LogTagsTable from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedViewList';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { loadMoreClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';
import { t } from 'in-i18n';

import locals from './Logs.mless';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  },
  copyColumn
];

const tracker = {
  loadMoreClicked: () => {
    loadMoreClicked({ view: 'Logs view' });
  }
};

export default function Logs(props) {
  const {
    getHrefWithAdditionalTagFilter,
    getHrefToGroupedView,
    filteringTagCatalog,
    groupingTagCatalog,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter
  } = props;

  const onSelectTagHref = getHrefWithAdditionalTagFilter
    ? tag => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))
    : undefined;

  const tagToLabelMap = useMemo(
    () => new Map((filteringTagCatalog?.tags || []).map(({ name, label }) => [name, label])),
    [filteringTagCatalog]
  );

  const allowedTagsForGrouping = useMemo(() => new Set((groupingTagCatalog?.tags || []).map(({ name }) => name)), [
    groupingTagCatalog
  ]);

  let content = (
    <UngroupedViewList
      {...props}
      Sidebar={Sidebar}
      Chart={Chart}
      useCursorPaginationStrategy={useLogsCursorPagination}
      classNames={{ listItem: locals.listItem }}
      columnDefinitions={columnDefinitions}
      getData={params => getTableData(params)}
      getId={item => item.itemId}
      withoutListItemLinkToDetails
      DetailView={DetailView}
      getDetailData={detailId => getLog({ itemId: detailId })}
      onSelectTagHref={onSelectTagHref}
      withCountHeader={false}
      withoutHeader={false}
      tracker={tracker}
      CustomHeaderActions={CustomHeaderActions}
      renderNestedContent={(_, item) => (
        <LogTagsTable
          item={item}
          onSelectTagHref={onSelectTagHref}
          getHrefToGroupedView={getHrefToGroupedView}
          tagToLabelMap={tagToLabelMap}
          allowedTagsForGrouping={allowedTagsForGrouping}
        />
      )}
    />
  );

  if (!props.withoutHeader && !props.detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function DetailView() {
  return null;
}

function CustomHeaderActions({ orderBy, setOrder }) {
  return (
    <Button
      icon={orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending'}
      kind="secondary"
      onClick={() =>
        setOrder({
          by: orderBy.by,
          direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
        })
      }
    >
      {orderBy.direction === 'ASC' ? t('in-logging:sorting.mostRecent') : t('in-logging:sorting.oldest')}
    </Button>
  );
}

function getTableData(props) {
  const { timeConfig, afterKey, backendQueryModel, loadAfterCount, retrievalSize, orderBy } = props;

  return getLogs({
    timeConfig,
    retrievalSize,
    afterKey,
    loadAfterCount,
    tagFilterExpression: backendQueryModel,
    tags: [LOG_CUSTOM, LOG_LEVEL, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE],
    orderDirection: orderBy?.direction
  });
}

function getTagExpressionWithTag(tag) {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}
