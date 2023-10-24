/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { LogTag } from '@instana/types';

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
