/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LogItem, LogTag, TraceActivityTreeNode } from '@instana/types';

import { LOG_CALL_ID, LOG_SPAN_ID, LOG_STREAM_NAME, OTEL_STREAM_NAME } from 'in-logging/queryBuilder';
import { getLogLevelColor } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { isLogItem } from 'in-logging/analyze/AnalyzeView/utils';
import { LowercaseLogLevel } from 'in-components/Logging/types';

export function getSpanIdFromTags(tags: LogTag[]) {
  return tags.filter(({ name }) => name === LOG_SPAN_ID)[0]?.stringValue;
}

export function getCallIdFromTags(tags: LogTag[]) {
  return tags.filter(({ name }) => name === LOG_CALL_ID)[0]?.stringValue;
}

export function getStreamNameFromTags(tags: LogTag[]) {
  return tags.filter(({ name }) => name === LOG_STREAM_NAME)[0]?.stringValue;
}

export function countOtelLogs(logs: LogItem[]) {
  const count = { error: 0, warn: 0 };

  for (const { tags } of logs) {
    let level = getLogLevel(tags);
    if (level && getStreamNameFromTags(tags) === OTEL_STREAM_NAME) {
      count[level.toLowerCase() as keyof typeof count]++;
    }
  }

  return count;
}

export function filterOtelLogs(call: TraceActivityTreeNode) {
  return (log: LogItem) => {
    const logLevel = getLogLevel(log.tags);
    if (logLevel) {
      return getStreamNameFromTags(log.tags) === OTEL_STREAM_NAME && getSpanIdFromTags(log.tags) === call.id;
    }
    return false;
  };
}

export function getLogLevelAndColor(log: TraceActivityTreeNode | LogItem): { level: LowercaseLogLevel; color: string } {
  let level: LowercaseLogLevel;

  if (isLogItem(log)) {
    level = (getLogLevel(log.tags)?.toLowerCase() as LowercaseLogLevel) || 'unknown';
  } else {
    level = log.errorCount > 0 ? 'error' : 'warn';
  }

  return { level, color: getLogLevelColor(level) };
}
