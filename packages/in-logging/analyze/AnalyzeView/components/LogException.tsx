/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Stack } from '@instana/components';

import LogExceptionDialog from 'in-logging/analyze/AnalyzeView/components/LogExceptionDialog';
import { LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_TYPE } from 'in-logging/queryBuilder';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { LogItem } from 'in-types';

import locals from './LogException.mless';

interface LogExceptionWrapperProps {
  item: LogItem;
}

interface LogExceptionProps extends LogExceptionWrapperProps {
  type?: string;
  message?: string;
}

export default function LogExceptionWrapper({ item }: LogExceptionWrapperProps) {
  const tags = item.tags;

  const exceptionTypeTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_TYPE), [tags]);
  const exceptionMessageTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_MESSAGE), [tags]);
  if (!exceptionTypeTag && !exceptionMessageTag) {
    return null;
  }

  return <LogException type={exceptionTypeTag?.stringValue} message={exceptionMessageTag?.stringValue} item={item} />;
}

function LogException({ type, message, item }: LogExceptionProps) {
  if (!type && !message) {
    return null;
  }

  return (
    <Stack direction="horizontal" gap="normal">
      {type && <span className={locals.type}>{type}:</span>}
      {message && (
        <span
          className={locals.message}
          onClick={() => addActiveDialog(<LogExceptionDialog onClose={close} item={item} />)}
        >
          {message}
        </span>
      )}
    </Stack>
  );
}
