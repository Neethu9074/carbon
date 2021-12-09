/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import {
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL
} from 'in-logging/queryBuilder';
import {
  logLevelColumn,
  timestampColumn,
  centerAlignedCopyColumn
} from 'in-logging/analyze/AnalyzeView/components/logsColumns';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/ChartsPresenter';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import LogTagsTable from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedViewList';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
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
  centerAlignedCopyColumn
];

export default function Logs(props) {
  const {
    getHrefWithAdditionalTagFilter,
    getHrefToGroupedView,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter
  } = props;

  const onSelectTagHref = getHrefWithAdditionalTagFilter
    ? tag => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))
    : undefined;

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
      CustomHeaderActions={CustomHeaderActions}
      renderNestedContent={(_, item) => (
        <LogTagsTable item={item} onSelectTagHref={onSelectTagHref} getHrefToGroupedView={getHrefToGroupedView} />
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
      {orderBy.direction === 'ASC' ? t('in-logging:sorting.oldest') : t('in-logging:sorting.mostRecent')}
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
