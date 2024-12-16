/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Stack } from '@instana/components';

import { LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_STACK_TRACE } from 'in-logging/queryBuilder';
import LogExceptionDialog from 'in-logging/analyze/AnalyzeView/components/LogExceptionDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { LogItem } from 'in-types';
import { t } from 'in-i18n';

import locals from './LogException.mless';

interface LogExceptionWrapperProps {
  item: LogItem;
  isToggled?: boolean;
}

interface LogExceptionProps extends LogExceptionWrapperProps {
  type?: string;
  message?: string;
  stackTraceMessage?: string;
  hasExceptionAndStackTrace?: boolean;
}

export default function LogExceptionWrapper({ item, isToggled }: LogExceptionWrapperProps) {
  const tags = item.tags;

  const exceptionTypeTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_TYPE), [tags]);
  const exceptionMessageTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_MESSAGE), [tags]);
  const exceptionStackTraceMessage = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_STACK_TRACE), [tags]);

  if (!exceptionTypeTag && !exceptionMessageTag) {
    return null;
  }

  return (
    <LogException
      type={exceptionTypeTag?.stringValue}
      message={exceptionMessageTag?.stringValue}
      stackTraceMessage={exceptionStackTraceMessage?.stringValue}
      item={item}
      hasExceptionAndStackTrace={
        Boolean(exceptionMessageTag || exceptionTypeTag) && Boolean(exceptionStackTraceMessage)
      }
      isToggled={isToggled}
    />
  );
}

function LogException({
  type,
  message,
  item,
  hasExceptionAndStackTrace,
  isToggled,
  stackTraceMessage
}: LogExceptionProps) {
  if (!type && !message) {
    return null;
  }

  return (
    <div>
      {!isToggled ? (
        <Stack direction="horizontal" gap="normal">
          {(type || message) && (
            <span
              className={type ? locals.type : locals.message}
              onClick={e => {
                e.stopPropagation();
                addActiveDialog(<LogExceptionDialog onClose={close} item={item} />);
              }}
            >
              {hasExceptionAndStackTrace && <span>{t('in-logging:stacktraceLogMessage')} & </span>}
              {type && `${type}: `}
              {message}
            </span>
          )}
        </Stack>
      ) : (
        <div className={locals.exceptionContentWrapper}>
          {type && <b>{type}:</b>}
          {message && <div className={locals.logExceptionMessage}>{message}</div>}
          {hasExceptionAndStackTrace && stackTraceMessage && (
            <>
              <b> {t('in-logging:logTraceTitle')} &gt;</b>
              <div className={locals.logExceptionMessage}>{stackTraceMessage}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
