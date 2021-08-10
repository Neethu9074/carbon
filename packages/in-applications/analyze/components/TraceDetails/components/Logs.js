/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { LOG_SPAN_ID, LOG_CUSTOM, getTraceIdTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { formatDateTime } from 'in-services/formatters/date';
import getLogs from 'in-logging/subscriptions/getLogs';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    width: '4.5rem',
    widthInAbsoluteUnit: true,
    getContent({ tags }) {
      return <LogHealthColumn tags={tags} />;
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
  const { traceId, totalNumberOfLogs, selectedLogIdPair, selectLogId, timeConfigForLogs } = props;
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
        const spanId = getSpanIdFromTags(log.tags);
        const isSelected = selectedLogIdPair
          ? selectedLogIdPair.logId === id && spanId === selectedLogIdPair.spanId
          : false;
        return (
          <Li
            key={id}
            className={classNames({
              [locals.selectedRow]: isSelected
            })}
            onClick={() => selectLogId({ logId: id, spanId })}
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
    tagFilterExpression: getTraceIdTagFilter(traceId),
    tags: [LOG_SPAN_ID, LOG_LEVEL, LOG_CUSTOM]
  });
}

function getSpanIdFromTags(tags) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}
