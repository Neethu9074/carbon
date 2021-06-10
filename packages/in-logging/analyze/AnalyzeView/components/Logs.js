/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import { LOG_CUSTOM, LOG_LEVEL, LOG_TRACE_ID } from 'in-logging/queryBuilder';
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedViewList';
import { loadMoreClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { formatDateTime } from 'in-services/formatters/date';
import HealthDot from 'in-components/health/HealthDot';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    width: '2.5rem',
    widthInAbsoluteUnit: true,
    getContent({ tags }) {
      return (
        <LogHealthColumn tags={tags}>
          {({ severity }) => <HealthDot className={locals.dot} severity={severity} iconSize={10} />}
        </LogHealthColumn>
      );
    }
  },
  {
    id: 'timestamp',
    width: '10rem',
    useMaxHeight: true,
    widthInAbsoluteUnit: true,
    getContent({ timestamp }) {
      return <div className={locals.dateTime}>{formatDateTime(timestamp)}</div>;
    }
  },
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

const tracker = {
  loadMoreClicked: () => {
    loadMoreClicked({ view: 'Logs view' });
  }
};

export default function Logs(props) {
  let content = (
    <UngroupedViewList
      {...props}
      useCursorPaginationStrategy={useLogsCursorPagination}
      additionalGetDataDependencies={[props.selectedTags]}
      classNames={{ listItem: locals.listItem }}
      withoutSorting
      columnDefinitions={columnDefinitions}
      getData={params => getTableData({ ...params, selectedTags: props.selectedTags })}
      getId={item => item.itemId}
      withoutListItemLinkToDetails
      DetailView={DetailView}
      getDetailData={detailId => getLog({ itemId: detailId })}
      CustomHeaderActions={TagSelector}
      withCountHeader={false}
      tracker={tracker}
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

function getTableData(props) {
  const { timeConfig, afterKey, backendQueryModel, loadAfterCount, selectedTags, retrievalSize } = props;

  return getLogs({
    timeConfig,
    retrievalSize,
    afterKey,
    loadAfterCount,
    tagFilterExpression: backendQueryModel,
    tags: [...selectedTags, LOG_TRACE_ID, LOG_CUSTOM, LOG_LEVEL]
  });
}
