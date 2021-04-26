/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';

export default function LogHealthColumn({ tags, children }) {
  const logLevel = getLogLevel(tags);
  const severity = getSeverityByLogLevel(logLevel);
  return children({ severity });
}

function getSeverityByLogLevel(level) {
  if ('ERROR' === level) {
    return 10;
  }
  if ('WARN' === level) {
    return 5;
  }
  return 0;
}
