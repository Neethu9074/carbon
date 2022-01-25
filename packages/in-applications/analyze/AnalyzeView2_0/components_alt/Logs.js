/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import {
  LOG_CUSTOM,
  LOG_LEVEL,
  getTraceIdTagFilter,
  getValueMatchTagFilter,
  LOG_MESSAGE,
  LOG_EXCEPTION_TYPE,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE
} from 'in-logging/queryBuilder';
import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { logLevelColumn, timestampColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import IconLink from 'in-components/IconButton/IconLink';
import getLogs from 'in-logging/subscriptions/getLogs';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  },
  {
    id: 'link',
    sortable: false,
    width: '3rem',
    widthInAbsoluteUnit: true,
    getContent(log) {
      return (
        <Tooltip content={t('in-analyze:logDetails.similarLogs')}>
          <IconLink
            type="lib_analyze"
            href$={getLinkToAnalyze({
              tagFilterExpression: [getValueMatchTagFilter({ name: LOG_MESSAGE, value: log.message })]
            })}
            onClick={() => jumpToLogs({ source: 'similar logs' })}
          />
        </Tooltip>
      );
    }
  }
];

export default function Logs(props) {
  const { traceId, totalNumberOfLogs, timeConfigForLogs } = props;
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
      {items.map(log => (
        <Li key={log.itemId} renderNestedContent={() => <LogTagsTable item={log} />}>
          <ColumnizedContent columnDefinitions={columnDefinitions} {...log} />
        </Li>
      ))}
    </Ul>
  );
}

function getData({ traceId, totalNumberOfLogs, timeConfigForLogs }) {
  return getLogs({
    timeConfig: timeConfigForLogs,
    retrievalSize: totalNumberOfLogs,
    tagFilterExpression: getTraceIdTagFilter(traceId),
    tags: [LOG_CUSTOM, LOG_LEVEL, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE]
  });
}
