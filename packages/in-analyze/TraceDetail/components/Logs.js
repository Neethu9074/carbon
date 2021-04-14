/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { getTraceIdTagFilter } from 'in-logging/queryBuilder';
import { formatDateTime } from 'in-services/formatters/date';
import HealthDot from 'in-new-components/health/HealthDot';
import getLogs from 'in-logging/subscriptions/getLogs';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    width: '2.5rem',
    widthInAbsoluteUnit: true,
    getContent({ logTags }) {
      return (
        <LogHealthColumn logTags={logTags}>
          {({ severity }) => <HealthDot severity={severity} iconSize={10} />}
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
      return <div>{formatDateTime(timestamp)}</div>;
    }
  },
  {
    id: 'log',
    getContent({ message, logTags }) {
      return <LogMessage logTags={logTags} message={message} />;
    }
  }
];

export default function Logs({ traceId, selectedLogId, clearSelectedLogId, selectLogId, timeConfigForLogs }) {
  const { items, errors, progress, canLoadMore, loadMore } = useLogsCursorPagination(
    params => getData({ traceId, timeConfigForLogs, ...params }),
    [traceId]
  );

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const hasErrors = errors.length > 0;
  if (hasErrors) {
    return <ErrorList errors={errors} />;
  }

  return (
    <Ul space="disabled">
      {items.map(log => {
        const id = log.itemId;
        const isSelected = selectedLogId === id;
        return (
          <Li
            key={id}
            className={classNames({
              [locals.selectedRow]: isSelected
            })}
            onClick={() => (isSelected ? clearSelectedLogId() : selectLogId(id))}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} {...log} />
          </Li>
        );
      })}
      {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
    </Ul>
  );
}

function getData({ traceId, timeConfigForLogs, afterKey, beforeKey }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: 10,
    afterKey,
    beforeKey,
    logicalOperator: 'AND',
    logTagFilterExpression: getTraceIdTagFilter(traceId),
    infraTagFilterExpression: emptyTagFilterExpression
  });
}
