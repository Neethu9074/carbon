/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Stack } from '@instana/components';

import { LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE } from 'in-logging/queryBuilder';
import { LogTag } from 'in-types';

// @ts-expect-error
import locals from './LogExceptionReadMode.mless';

interface LogExceptionReadModeWrapperProps {
  tags: LogTag[];
}

interface LogExceptionReadModeProps {
  type?: string;
  message?: string;
}

export default function LogExceptionReadModeWrapper({ tags }: LogExceptionReadModeWrapperProps) {
  const exceptionTypeTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_TYPE), [tags]);
  const exceptionMessageTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_MESSAGE), [tags]);
  if (!exceptionTypeTag && !exceptionMessageTag) {
    return null;
  }

  return <LogExceptionReadMode type={exceptionTypeTag?.stringValue} message={exceptionMessageTag?.stringValue} />;
}

function LogExceptionReadMode({ type, message }: LogExceptionReadModeProps) {
  if (!type && !message) {
    return null;
  }

  return (
    <Stack direction="vertical" gap="xsmall">
      {type && <span className={locals.type}>{type}:</span>}
      {message && <span className={locals.messageWrapper}>{message}</span>}
    </Stack>
  );
}
