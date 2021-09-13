/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { Stack } from '@instana/components';

import { LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE } from 'in-logging/queryBuilder';
import { LogTag } from 'in-types';

// @ts-expect-error
import locals from './LogExceptionReadOnly.mless';

interface LogExceptionReadOnlyWrapperProps {
  tags: LogTag[];
}

interface LogExceptionReadOnlyProps {
  type?: string;
  message?: string;
}

export default function LogExceptionReadOnlyWrapper({ tags }: LogExceptionReadOnlyWrapperProps) {
  const exceptionTypeTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_TYPE), [tags]);
  const exceptionMessageTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_MESSAGE), [tags]);
  if (!exceptionTypeTag && !exceptionMessageTag) {
    return null;
  }

  return <LogExceptionReadOnly type={exceptionTypeTag?.stringValue} message={exceptionMessageTag?.stringValue} />;
}

function LogExceptionReadOnly({ type, message }: LogExceptionReadOnlyProps) {
  if (!type && !message) {
    return null;
  }

  return (
    <Stack direction="horizontal" gap="normal">
      {type && <span className={locals.type}>{type}:</span>}
      {message && <span className={locals.messageWrapper}>{message}</span>}
    </Stack>
  );
}
