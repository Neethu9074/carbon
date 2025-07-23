/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LogTag } from '@instana/types';

import LogExceptionReadMode from 'in-logging/analyze/AnalyzeView/components/LogExceptionReadMode';
import LogMessage from 'in-logging/analyze/AnalyzeView/components/LogMessage';

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
        <LogMessage tags={tags} message={message} />
      </span>
      <LogExceptionReadMode tags={tags} />
    </div>
  );
}
