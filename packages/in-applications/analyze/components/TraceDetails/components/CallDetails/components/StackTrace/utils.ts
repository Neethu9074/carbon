/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import { StackTraceItem } from '@instana/types';

import { t } from 'in-i18n';

const STRIP_QUOTES_REGEX = /`|'/g;
const NODE_REGEX = /\.(js|ts)/g;
const PHP_REGEX = /\.php/g;
const PYTHON_REGEX = /\.py/g;

// Some trace agents will record quotes in method names. We don't want to present these
// as it looks ugly.
// Ruby example: `<main>'
export function stripQuotes(s: string) {
  return s.replace(STRIP_QUOTES_REGEX, '');
}

const combineLanguage: Record<string, (stackTrace: StackTraceItem) => string> = {
  node: stackTrace => combineNode(stackTrace),
  php: stackTrace => combinePhp(stackTrace),
  python: stackTrace => combinePython(stackTrace)
};

export function determineCombineMethod(stackTrace: StackTraceItem[]) {
  if (stackTrace.find(st => st.file?.match(NODE_REGEX) != null)) return combineLanguage['node'];
  if (stackTrace.find(st => st.file?.match(PHP_REGEX) != null)) return combineLanguage['php'];
  if (stackTrace.find(st => st.file?.match(PYTHON_REGEX) != null)) return combineLanguage['python'];
  return combineAgnostic;
}

export function combineAgnostic(stackTrace: StackTraceItem) {
  const { file, line, method } = stackTrace;
  let fileLine = `${t('in-analyze:traceDetail.components.callDetails.in')} ${file}`;
  if (method) fileLine = `${method} in `.concat(fileLine);
  if (line) fileLine = fileLine.concat(`:${line}`);
  return fileLine;
}

export function combineNode(stackTrace: StackTraceItem) {
  const { file, line, method } = stackTrace;
  let fileLine = 'at';
  if (method) fileLine = fileLine.concat(` ${stripQuotes(method)}`);
  if (line) fileLine = fileLine.concat(` (${file}:${line})`);
  return fileLine;
}

export function combinePhp(stackTrace: StackTraceItem) {
  const { file, line, method } = stackTrace;
  let fileLine = `${file}`;
  if (line) fileLine = fileLine.concat(`(${line}):`);
  if (method) fileLine = fileLine.concat(` ${method}`);
  return fileLine;
}

export function combinePython(stackTrace: StackTraceItem) {
  const { file, line, method } = stackTrace;
  let fileLine = `File "${file}"`;
  if (line) fileLine = fileLine.concat(`, line ${line}`);
  if (method) fileLine = fileLine.concat(`, in ${stripQuotes(method)}`);
  return fileLine;
}
