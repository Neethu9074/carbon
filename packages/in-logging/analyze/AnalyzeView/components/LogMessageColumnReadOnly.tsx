/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LogExceptionReadOnly from 'in-logging/analyze/AnalyzeView/components/LogExceptionReadOnly';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';
import { LogTag } from 'in-types';

// @ts-expect-error
import locals from './LogMessageColumn.mless';

interface LogMessageColumnReadOnlyProps {
  tags: LogTag[];
  message: string;
}

export default function LogMessageColumnReadOnly(props: LogMessageColumnReadOnlyProps) {
  const { tags, message } = props;

  return (
    <div className={locals.messageWrapper}>
      <span className={locals.messageExpanded}>
        <LogMessage tags={tags} message={message} isExpanded isHovered={false} isOverflowing={false} />
      </span>
      <LogExceptionReadOnly tags={tags} />
    </div>
  );
}
