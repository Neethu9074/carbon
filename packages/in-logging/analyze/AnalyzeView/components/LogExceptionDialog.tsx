/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useMemo } from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import { logLevelColumn, timestampColumn, copyColumn } from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import LogMessageColumnReadMode from 'in-logging/analyze/AnalyzeView/components/LogMessageColumnReadMode';
import { LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE } from 'in-logging/queryBuilder';
import LogStackTrace from 'in-logging/analyze/AnalyzeView/components/LogStackTrace';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { LogItem } from 'in-types';
import { t } from 'in-i18n';

import locals from './LogExceptionDialog.mless';

interface LogExceptionDialogProps {
  item: LogItem;
  onClose: () => void;
}

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumnReadMode
  },
  copyColumn
];

const columnDefinitions2 = [
  {
    id: 'logLevel',
    width: '14.5rem',
    widthInAbsoluteUnit: true,
    getContent() {
      return null;
    }
  },
  {
    id: 'log',
    getContent: LogStackTrace
  },
  copyColumn
];

export default function LogExceptionDialog({ item, onClose = close }: LogExceptionDialogProps) {
  const stackTraceMessageTag = useMemo(
    () => item.tags.find(({ name }) => name === LOG_EXCEPTION_STACK_TRACE),
    [item.tags]
  );

  const hasOnlyStackTrace = useMemo(() => {
    return (
      Array.isArray(item.tags) &&
      item.tags.some(({ name }) => name === LOG_EXCEPTION_STACK_TRACE) &&
      !item.tags.some(({ name }) => name === LOG_EXCEPTION_MESSAGE)
    );
  }, [item.tags]);
  const logExceptionMessageHeader = hasOnlyStackTrace
    ? t('in-logging:stackTraceHeader')
    : t('in-logging:exceptionMessageHeader');
  return (
    <Dialog className={locals.dialog} title={logExceptionMessageHeader} onClose={onClose}>
      <Ul space="disabled">
        <Li className={locals.listItem} size="compact">
          <ColumnizedContent columnDefinitions={columnDefinitions} {...item} />
        </Li>
        {stackTraceMessageTag && !hasOnlyStackTrace && (
          <Li className={locals.listItem} size="compact">
            <ColumnizedContent
              columnDefinitions={columnDefinitions2}
              stackTrace={stackTraceMessageTag.stringValue}
              message={stackTraceMessageTag.stringValue}
            />
          </Li>
        )}
      </Ul>
    </Dialog>
  );
}
