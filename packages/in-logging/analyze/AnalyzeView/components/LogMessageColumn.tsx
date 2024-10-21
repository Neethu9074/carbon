/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import classNames from 'classnames';

import LogExceptionDialog from 'in-logging/analyze/AnalyzeView/components/LogExceptionDialog';
import { LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE } from 'in-logging/queryBuilder';
import { ColumnContentProps } from 'in-logging/analyze/AnalyzeView/components/Logs/Logs';
import LogException from 'in-logging/analyze/AnalyzeView/components/LogException';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from './LogMessageColumn.mless';

export default function LogMessageColumn(props: ColumnContentProps) {
  const { tags, message, timestamp, itemId, isToggled, item } = props;
  const hasOnlyStackTrace = useMemo(() => {
    return (
      Array.isArray(tags) &&
      tags.some(({ name }) => name === LOG_EXCEPTION_STACK_TRACE) &&
      !tags.some(({ name }) => name === LOG_EXCEPTION_MESSAGE)
    );
  }, [tags]);

  if (hasOnlyStackTrace) {
    return !isToggled ? (
      <div className={locals.stackTraceMessageWrapper}>
        <span
          className={locals.stackTrace}
          onClick={e => {
            e.stopPropagation();
            addActiveDialog(<LogExceptionDialog onClose={close} item={item} />);
          }}
        >
          {t('in-logging:stacktraceLogMessage')}
        </span>
      </div>
    ) : (
      <div className={locals.stackTraceMessageWrapper}>
        <LogMessage tags={tags} message={message} />
      </div>
    );
  }
  return (
    <div className={locals.messageWrapper}>
      <span
        className={classNames({
          [locals.collapsedMessage]: !isToggled,
          [locals.messageExpanded]: isToggled
        })}
      >
        <LogMessage tags={tags} message={message} />
      </span>
      <LogException
        isToggled={isToggled}
        item={{
          tags,
          timestamp,
          message,
          itemId
        }}
      />
    </div>
  );
}
