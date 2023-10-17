/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';

import { logLevelColumn, timestampColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { getSpanIdFromTags } from 'in-components/Logging/TraceDetails/utils';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  }
];

export default function Logs(props) {
  const { items, progress, errors, selectLogId } = props;

  if (progress?.loading) {
    return <LoadingList numSkeletonRows={3} />;
  }

  const hasErrors = errors.length > 0;
  if (hasErrors) {
    return <ErrorList errors={errors} />;
  }

  return (
    <Ul space="disabled">
      {items?.map(log => {
        const id = log.itemId;
        const spanId = getSpanIdFromTags(log.tags);

        return (
          <Li
            key={id}
            onClick={() => selectLogId({ logId: id, spanId })}
            renderNestedContent={() => <LogTagsTable item={log} />}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} {...log} />
          </Li>
        );
      })}
    </Ul>
  );
}
