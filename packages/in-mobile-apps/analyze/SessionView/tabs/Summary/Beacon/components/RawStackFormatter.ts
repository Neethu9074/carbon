/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { CodeProps } from '@instana/components';

import { removeBlankLines } from 'in-services/util/string';

export type StackFormatterType = 'java-stacktrace-alike' | 'ios-translated-dump' | 'raw';

type StackFormatter = Pick<Required<CodeProps>, 'lang'> & {
  format: (content?: string) => string;
};

const stackFormatters: Record<StackFormatterType, StackFormatter> = {
  'java-stacktrace-alike': {
    // @ts-ignore Code does support Java, but the types are incomplete
    lang: 'java',
    format: formatJavaStacktraces
  },
  'ios-translated-dump': {
    lang: 'git',
    format: formatIOSDump
  },
  raw: {
    lang: 'git',
    format: (content?: string) => content || ''
  }
};

export function getStackFormatter(format?: StackFormatterType) {
  const defaultFormatter = stackFormatters['java-stacktrace-alike'];
  if (!format) {
    return defaultFormatter;
  }
  return stackFormatters[format] ?? defaultFormatter;
}

function formatJavaStacktraces(content?: string) {
  return removeBlankLines(content) || '';
}

function formatIOSDump(content?: string) {
  return content || '';
}
