/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import UngroupedViewList from 'in-new-components/AnalyzeView/UngroupedViewList';
import { formatDateTime } from 'in-services/formatters/date';
import HealthDot from 'in-new-components/health/HealthDot';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    width: '2.5rem',
    widthInAbsoluteUnit: true,
    getContent({ logTags }) {
      return (
        <LogHealthColumn logTags={logTags}>
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

export default function Logs(props) {
  let content = (
    <UngroupedViewList
      {...props}
      useCursorPaginationStrategy={useLogsCursorPagination}
      classNames={{ listItem: locals.listItem }}
      withoutSorting
      columnDefinitions={columnDefinitions}
      getData={getTableData}
      getId={item => item.itemId}
      withoutListItemLinkToDetails
      DetailView={DetailView}
      getDetailData={detailId => getLog({ id: detailId })}
      CustomHeaderActions={TagSelector}
      withCountHeader={false}
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

function getTableData({ timeConfig, afterKey, beforeKey, backendQueryModel, loadAfterCount }) {
  return getLogs({
    timeConfig,
    retrievalSize: 20,
    afterKey,
    beforeKey,
    loadAfterCount,
    logicalOperator: 'AND',
    logTagFilterExpression: backendQueryModel,
    infraTagFilterExpression: emptyTagFilterExpression
  });
}
