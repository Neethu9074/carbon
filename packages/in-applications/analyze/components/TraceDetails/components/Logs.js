/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
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
    getContent({ tags }) {
      return (
        <LogHealthColumn tags={tags}>
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
    getContent({ message, tags }) {
      return <LogMessage tags={tags} message={message} />;
    }
  }
];

export default function Logs(props) {
  const { traceId, totalNumberOfLogs, selectedLogId, clearSelectedLogId, selectLogId, timeConfigForLogs } = props;
  const { items, errors, progress } = useLogsCursorPagination(
    params => getData({ traceId, totalNumberOfLogs, timeConfigForLogs, ...params }),
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
    </Ul>
  );
}

function getData({ traceId, totalNumberOfLogs, timeConfigForLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId)
  });
}
