/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { LogItem, LogTag } from '@instana/types';

import { LogSpanExcerpt } from 'in-components/Logging/TraceDetails/components/LogDetails/LogDetails';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import { t } from 'in-i18n';

export function isParameterTag({ key }: LogTag) {
  return key && key.indexOf('_msg_param') === 0;
}

export function mapToSiderbarTagListObject(tag: LogTag) {
  return {
    name: getTagKey(tag),
    value: tag.stringValue ?? tag.doubleValue ?? tag.booleanValue ?? tag.longValue
  };
}

function getTagKey({ name, key }: LogTag) {
  const tagName = name;
  if (key) {
    return `${tagName} - ${isParameterTag({ key }) ? 'parameter' : key}`;
  }
  return tagName;
}

export const parseStackTrace = (stackTrace: string): ParsedStackTrace[] => {
  return JSON.parse(stackTrace).map((stackTrace: RawStackTrace) => ({
    //class is used as a fallback where filename is unavailable until parsing for different languages is implemented
    file: stackTrace.f || stackTrace.c,
    line: stackTrace.n,
    method: stackTrace.m,
    class: stackTrace.c
  }));
};

export type ParsedStackTrace = Record<ParsedSpanStackAttributes, string>;
type RawStackTrace = Record<RawSpanStackAttributes, string>;

type RawSpanStackAttributes = 'c' | 'f' | 'm' | 'n';
type ParsedSpanStackAttributes = 'class' | 'file' | 'method' | 'line';

export const getCardTitle = (logs: LogSpanExcerpt[] | LogItem[]) => {
  const logLevelCounts = { error: 0, warn: 0 };

  if (isLogItems(logs)) {
    logs.forEach(log => {
      const level = getLogLevel(log.tags)?.toLowerCase();
      logLevelCounts[level as 'warn' | 'error']++;
    });
  } else {
    logs.forEach(log => {
      const level = log.data.log?.level?.toLowerCase() ?? (log.errorCount > 0 ? 'error' : 'warn');
      logLevelCounts[level as 'warn' | 'error']++;
    });
  }

  const { getWarnString, getErrorString } = {
    getWarnString: (count: number) => t('in-logging:warn', { count }),
    getErrorString: (count: number) => t('in-logging:error', { count })
  };

  return Object.entries(logLevelCounts)
    .flatMap(([level, count]) => (count > 0 ? [level === 'error' ? getErrorString(count) : getWarnString(count)] : []))
    .join(', ');
};

function isLogItems(logs: any): logs is LogItem[] {
  return !!logs[0].tags;
}
