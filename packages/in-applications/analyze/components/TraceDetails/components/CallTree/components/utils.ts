/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LogItem, TraceActivityTreeNode } from '@instana/types';

import { getSpanIdFromTags } from 'in-components/Logging/TraceDetails/utils';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { PartialExcept } from 'in-types';

export function convertToCallLogs(
  logs: LogItem[]
): PartialExcept<TraceActivityTreeNode, 'start' | 'label' | 'errorCount'>[] {
  return logs.map(log => ({
    start: log.timestamp,
    label: log.message,
    id: getSpanIdFromTags(log.tags),
    errorCount: getLogLevel(log.tags) === 'ERROR' ? 1 : 0
  }));
}
